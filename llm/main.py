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

# Initialize the database with our schema
try:
    db.compile()
except Exception as e:
    print(f"Database compile warning: {e}")

def extract_pdf_text(pdf_path: str) -> str:
    """Extract text content from a PDF file."""
    text = ""
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
    return text


def get_all_pdfs() -> List[dict]:
    """Get all PDFs from the database"""
    try:
        result = db.getAllPDFs()
        return result if isinstance(result, list) else []
    except Exception as e:
        print(f"Error getting PDFs: {e}")
        return []


def add_pdf_to_db(pdf_id: int, title: str, summary: str, filename: str) -> bool:
    """Add a PDF to the Helix database"""
    try:
        upload_date = datetime.now().isoformat()
        db.addPDF(
            pdf_id=pdf_id,
            title=title,
            summary=summary,
            filename=filename,
            upload_date=upload_date
        )
        return True
    except Exception as e:
        print(f"Error adding PDF: {e}")
        return False


def create_pdf_relationship(from_id: int, to_id: int, relationship_type: str, confidence: float) -> bool:
    """Create a relationship edge between two PDFs"""
    try:
        db.relatePDFs(
            from_id=from_id,
            to_id=to_id,
            relationship_type=relationship_type,
            confidence=confidence
        )
        return True
    except Exception as e:
        print(f"Error creating relationship: {e}")
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


@app.post("/process-pdf/")
async def process_pdf(pdf_path: str = Body(..., embed=True)):
    """Process a PDF file and add it to the graph database with connections"""
    try:
        # Extract text from PDF
        pdf_text = extract_pdf_text(pdf_path)

        # Run the agent to analyze the PDF
        result = await generator_agent.run(pdf_text)
        pdf_data = result.output

        # Get all existing PDFs from the database
        existing_pdfs = get_all_pdfs()

        # Generate a new PDF ID
        new_pdf_id = max([pdf.get("pdf_id", 0) for pdf in existing_pdfs], default=0) + 1

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

        # Add the PDF to the database
        filename = Path(pdf_path).name
        add_success = add_pdf_to_db(
            pdf_id=new_pdf_id,
            title=pdf_data.title,
            summary=pdf_data.summary,
            filename=filename
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
        connections = db.getRelatedPDFs(pdf_id=pdf_id)
        return {
            "status": "success",
            "pdf_id": pdf_id,
            "connections": connections if isinstance(connections, list) else []
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 

