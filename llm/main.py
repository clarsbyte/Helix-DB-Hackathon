import json
import os
import subprocess
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, Request, status, UploadFile, File
import uvicorn
from fastapi.params import Body
from pydantic_ai import Agent, RunContext
from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
from pathlib import Path
import requests
import helix
from s3_utils import upload_pdf_to_s3, download_pdf_from_s3, delete_pdf_from_s3, generate_presigned_url, verify_s3_connection, S3_PRESIGNED_URL_EXPIRATION
import uuid
import tempfile

class Output(BaseModel):
    title: str
    summary: str
    links: Optional[List[str]] = None

class ConnectionAnalysis(BaseModel):
    """Model for analyzing connections between PDFs"""
    related_pdfs: List[dict]  # List of {pdf_id, relationship_type, confidence}



load_dotenv()
os.getenv('GOOGLE_API_KEY')

prompt = """
# Role
You are an agent that reads and analyzes PDF documents.
Your task is to extract the title, write a concise summary, and identify any important links or references in the document.

# Instructions
- Extract or generate an appropriate title for the document
- Provide a clear, concise summary (2-3 sentences)
- Extract any URLs or important references found in the document
"""

connection_prompt = """
# Role
You are an expert at analyzing relationships between academic and technical documents.

# Task
Given a new PDF's title and summary, and a list of existing PDFs with their titles and summaries,
identify which existing PDFs are related to the new one.

# Instructions
For each relationship, provide:
- pdf_id: The ID of the related PDF
- relationship_type: One of ["similar_topic", "prerequisite", "references", "extends", "contradicts"]
- confidence: A score from 0.0 to 1.0 indicating how confident you are in this relationship

Only include relationships with confidence >= 0.6
"""

generator_agent = Agent(
    'gemini-2.5-flash',
    output_type=Output,
    system_prompt=prompt,
    deps_type=str
)

connection_agent = Agent(
    'gemini-2.5-flash',
    output_type=ConnectionAnalysis,
    system_prompt=connection_prompt,
    deps_type=str
)

db = helix.Client(local=True, verbose=True)

# Database is initialized when Client is created

# Verify S3 connection on startup
if not verify_s3_connection():
    print("WARNING: S3 connection failed. Check AWS credentials and bucket name in .env file.")

def extract_pdf_text(pdf_path: str) -> str:
    """Extract text content from a PDF file."""
    text = ""
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
    return text


def extract_pdf_text_from_s3(s3_key: str) -> str:
    """Extract text content from a PDF file stored in S3."""
    try:
        # Download PDF from S3
        pdf_content = download_pdf_from_s3(s3_key)

        # Create temporary file
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_file:
            temp_file.write(pdf_content)
            temp_path = temp_file.name

        # Extract text
        text = ""
        with open(temp_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"

        # Clean up temp file
        os.unlink(temp_path)

        return text

    except Exception as e:
        print(f"Error extracting text from S3 PDF: {e}")
        raise


def get_all_pdfs(user_id: Optional[str] = None) -> List[dict]:
    """Get all PDFs from the database, optionally filtered by user_id"""
    try:
        result = db.query("getAllPDFs", {})
        print(f"DEBUG - Raw result from getAllPDFs: {result}")
        print(f"DEBUG - Result type: {type(result)}")

        # Handle the nested structure returned by Helix
        pdfs = []
        if isinstance(result, list) and len(result) > 0:
            # Check if result is wrapped in a 'pdfs' key
            if isinstance(result[0], dict) and 'pdfs' in result[0]:
                pdfs = result[0]['pdfs']
            else:
                pdfs = result
        elif isinstance(result, list):
            pdfs = result

        # Filter by user_id if provided
        if user_id:
            pdfs = [pdf for pdf in pdfs if pdf.get("user_id") == user_id]
            print(f"DEBUG - Filtered PDFs for user {user_id}: {len(pdfs)} found")

        return pdfs
    except Exception as e:
        print(f"Error getting PDFs: {e}")
        import traceback
        traceback.print_exc()
        return []


def add_pdf_to_db(pdf_id: int, title: str, summary: str, filename: str, user_id: str) -> bool:
    """Add a PDF to the Helix database"""
    try:
        upload_date = datetime.now().isoformat()
        print(f"DEBUG - Adding PDF with id={pdf_id}, title={title}, user_id={user_id}")
        result = db.query("addPDF", {
            "pdf_id": pdf_id,
            "title": title,
            "summary": summary,
            "filename": filename,
            "upload_date": upload_date,
            "user_id": user_id
        })
        print(f"DEBUG - Add PDF result: {result}")
        return True
    except Exception as e:
        print(f"Error adding PDF: {e}")
        import traceback
        traceback.print_exc()
        return False


def create_pdf_relationship(from_id: int, to_id: int, relationship_type: str, confidence: float) -> bool:
    """Create bidirectional relationship edges between two PDFs"""
    forward_success = False
    reverse_success = False

    try:
        print(f"DEBUG - Creating bidirectional relationship: {from_id} <-> {to_id} ({relationship_type}, {confidence})")

        # Create forward relationship
        try:
            result1 = db.query("relatePDFs", {
                "from_id": from_id,
                "to_id": to_id,
                "relationship_type": relationship_type,
                "confidence": confidence
            })
            print(f"DEBUG - Forward relationship created ({from_id} -> {to_id}): {result1}")
            forward_success = True
        except Exception as e:
            print(f"Error creating forward relationship ({from_id} -> {to_id}): {e}")
            import traceback
            traceback.print_exc()

        # Create reverse relationship
        try:
            result2 = db.query("relatePDFs", {
                "from_id": to_id,
                "to_id": from_id,
                "relationship_type": relationship_type,
                "confidence": confidence
            })
            print(f"DEBUG - Reverse relationship created ({to_id} -> {from_id}): {result2}")
            reverse_success = True
        except Exception as e:
            print(f"Error creating reverse relationship ({to_id} -> {from_id}): {e}")
            import traceback
            traceback.print_exc()

        # Return True only if both edges were created successfully
        if forward_success and reverse_success:
            print(f"DEBUG - Both edges created successfully for {from_id} <-> {to_id}")
            return True
        else:
            print(f"DEBUG - Edge creation incomplete: forward={forward_success}, reverse={reverse_success}")
            return False

    except Exception as e:
        print(f"Error creating bidirectional relationship: {e}")
        import traceback
        traceback.print_exc()
        return False


def delete_pdf_from_db(pdf_id: int, user_id: str) -> bool:
    """Delete a PDF from the Helix database (with user_id verification)"""
    try:
        print(f"DEBUG - Deleting PDF with id={pdf_id} for user={user_id}")

        # First verify the PDF belongs to this user
        all_pdfs = get_all_pdfs(user_id=user_id)
        pdf_exists = any(pdf.get("pdf_id") == pdf_id for pdf in all_pdfs)

        if not pdf_exists:
            print(f"DEBUG - PDF {pdf_id} not found or doesn't belong to user {user_id}")
            return False

        # Delete the PDF (this should also cascade delete relationships in Helix)
        result = db.query("deletePDF", {"pdf_id": pdf_id})
        print(f"DEBUG - Delete PDF result: {result}")
        return True
    except Exception as e:
        print(f"Error deleting PDF: {e}")
        import traceback
        traceback.print_exc()
        return False


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...), user_id: str = Body(...)):
    """Upload a PDF file to S3"""
    try:
        # Validate file type
        if not file.filename.endswith('.pdf'):
            return {
                "status": "error",
                "message": "Only PDF files are allowed"
            }

        # Read file content
        content = await file.read()

        # Generate unique filename to avoid collisions
        original_filename = file.filename
        unique_filename = f"{uuid.uuid4()}_{original_filename}"

        # Upload to S3
        result = upload_pdf_to_s3(content, unique_filename, user_id)

        if result['status'] == 'success':
            return {
                "status": "success",
                "message": "File uploaded successfully to S3",
                "s3_key": result['s3_key'],
                "filename": unique_filename
            }
        else:
            return {
                "status": "error",
                "message": result.get('error', 'Failed to upload to S3')
            }

    except Exception as e:
        print(f"Upload error: {e}")
        import traceback
        traceback.print_exc()
        return {
            "status": "error",
            "message": str(e)
        }


@app.post("/process-pdf/")
async def process_pdf(s3_key: str = Body(..., embed=True), user_id: str = Body(..., embed=True)):
    """Process a PDF file from S3 and add it to the graph database with connections"""
    try:
        # Extract text from S3 PDF
        pdf_text = extract_pdf_text_from_s3(s3_key)

        # Run the agent to analyze the PDF
        result = await generator_agent.run(pdf_text)
        pdf_data = result.output

        # Get all existing PDFs from the database for THIS USER ONLY
        existing_pdfs = get_all_pdfs(user_id=user_id)
        print(f"DEBUG - Existing PDFs for user {user_id}: {existing_pdfs}")

        # Generate a new PDF ID
        new_pdf_id = max([pdf.get("pdf_id", 0) for pdf in existing_pdfs], default=0) + 1
        print(f"DEBUG - Generated new PDF ID: {new_pdf_id}")

        # Find connections to existing PDFs using AI
        connections = []
        if existing_pdfs:
            # Create context for connection analysis
            context = f"""
New PDF:
Title: {pdf_data.title}
Summary: {pdf_data.summary}

Existing PDFs:
{json.dumps([{"pdf_id": pdf["pdf_id"], "title": pdf["title"], "summary": pdf["summary"]} for pdf in existing_pdfs], indent=2)}
"""

            # Run connection analysis
            connection_result = await connection_agent.run(context)
            connections = connection_result.output.related_pdfs

        # Add the PDF to the database (s3_key stored as filename)
        add_success = add_pdf_to_db(
            pdf_id=new_pdf_id,
            title=pdf_data.title,
            summary=pdf_data.summary,
            filename=s3_key,  # Store S3 key instead of filename
            user_id=user_id
        )

        # Create relationship edges
        created_edges = []
        if add_success and connections:
            for conn in connections:
                edge_success = create_pdf_relationship(
                    from_id=new_pdf_id,
                    to_id=conn["pdf_id"],
                    relationship_type=conn["relationship_type"],
                    confidence=conn["confidence"]
                )
                if edge_success:
                    created_edges.append(conn)

        return {
            "status": "success",
            "message": "PDF processed and added to graph database",
            "pdf_id": new_pdf_id,
            "title": pdf_data.title,
            "summary": pdf_data.summary,
            "s3_key": s3_key,
            "connections_found": len(created_edges),
            "connections": created_edges
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


@app.get("/pdfs/")
async def get_pdfs():
    """Get all PDFs in the database"""
    try:
        pdfs = get_all_pdfs()
        return {
            "status": "success",
            "count": len(pdfs),
            "pdfs": pdfs
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


@app.get("/pdf/{pdf_id}/connections")
async def get_pdf_connections(pdf_id: int):
    """Get all connections for a specific PDF"""
    try:
        connections = db.query("getRelatedPDFs", {"pdf_id": pdf_id})
        print(f"DEBUG - Raw connections result: {connections}")

        # Handle the nested structure returned by Helix
        if isinstance(connections, list) and len(connections) > 0:
            # Check if result is wrapped in a 'related' key
            if isinstance(connections[0], dict) and 'related' in connections[0]:
                connections = connections[0]['related']

        return {
            "status": "success",
            "pdf_id": pdf_id,
            "connections": connections if isinstance(connections, list) else []
        }
    except Exception as e:
        print(f"Error getting connections: {e}")
        import traceback
        traceback.print_exc()
        return {
            "status": "error",
            "message": str(e)
        }


@app.delete("/pdf/{pdf_id}")
async def delete_pdf(pdf_id: int, user_id: str = Body(..., embed=True)):
    """Delete a PDF from S3 and database"""
    try:
        # Get PDF details before deletion (to get S3 key)
        all_pdfs = get_all_pdfs(user_id=user_id)
        pdf_to_delete = next((pdf for pdf in all_pdfs if pdf.get("pdf_id") == pdf_id), None)

        if not pdf_to_delete:
            return {
                "status": "error",
                "message": f"PDF with id {pdf_id} not found or doesn't belong to user {user_id}"
            }

        # Delete from database first
        delete_success = delete_pdf_from_db(pdf_id, user_id)

        if not delete_success:
            return {
                "status": "error",
                "message": "Failed to delete PDF from database"
            }

        # Delete from S3 (filename is the S3 key)
        s3_deleted = False
        if "filename" in pdf_to_delete:
            s3_key = pdf_to_delete["filename"]
            s3_deleted = delete_pdf_from_s3(s3_key)

        return {
            "status": "success",
            "message": "PDF deleted successfully",
            "pdf_id": pdf_id,
            "s3_deleted": s3_deleted
        }

    except Exception as e:
        print(f"Error in delete endpoint: {e}")
        import traceback
        traceback.print_exc()
        return {
            "status": "error",
            "message": str(e)
        }


@app.get("/pdf/{pdf_id}/download-url")
async def get_pdf_download_url(pdf_id: int, user_id: str):
    """Generate a presigned URL for downloading a PDF"""
    try:
        # Verify ownership
        all_pdfs = get_all_pdfs(user_id=user_id)
        pdf = next((p for p in all_pdfs if p.get("pdf_id") == pdf_id), None)

        if not pdf:
            return {
                "status": "error",
                "message": "PDF not found or access denied"
            }

        # Generate presigned URL
        s3_key = pdf["filename"]
        url = generate_presigned_url(s3_key)

        return {
            "status": "success",
            "download_url": url,
            "expires_in": S3_PRESIGNED_URL_EXPIRATION
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 

