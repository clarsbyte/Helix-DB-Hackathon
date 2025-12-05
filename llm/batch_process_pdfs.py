"""
Batch PDF Processing Script

This script processes multiple PDF files in a directory by sending them
to the FastAPI server which handles:
1. Text extraction
2. AI analysis (title, summary)
3. Finding connections between PDFs
4. Storing in Helix DB
"""

import os
import requests
import json
import time
from pathlib import Path
from typing import List, Dict
import sys

# Configuration
API_BASE_URL = "http://localhost:8000"
PDF_DIRECTORY = "pdf"  # Directory containing PDFs to process
BATCH_SIZE = 5  # Process this many PDFs before checking status
DELAY_BETWEEN_REQUESTS = 1  # Seconds to wait between requests


def get_pdf_files(directory: str) -> List[str]:
    """Get all PDF files from the specified directory."""
    pdf_dir = Path(directory)
    if not pdf_dir.exists():
        print(f"Error: Directory '{directory}' does not exist")
        return []

    pdf_files = list(pdf_dir.glob("*.pdf"))
    return [str(pdf.absolute()) for pdf in pdf_files]


def process_single_pdf(pdf_path: str) -> Dict:
    """Send a single PDF to the API for processing."""
    try:
        print(f"\n📄 Processing: {Path(pdf_path).name}")

        response = requests.post(
            f"{API_BASE_URL}/process-pdf/",
            json={"pdf_path": pdf_path},
            timeout=120  # 2 minute timeout for large PDFs
        )

        response.raise_for_status()
        result = response.json()

        if result.get("status") == "success":
            print(f"✅ Success: '{result.get('title')}'")
            print(f"   PDF ID: {result.get('pdf_id')}")
            print(f"   Connections found: {result.get('connections_found', 0)}")
            if result.get('connections'):
                for conn in result['connections']:
                    print(f"   → Related to PDF #{conn['pdf_id']} ({conn['relationship_type']}, confidence: {conn['confidence']:.2f})")
        else:
            print(f"❌ Error: {result.get('message')}")

        return result

    except requests.exceptions.Timeout:
        print(f"⏱️  Timeout processing {pdf_path}")
        return {"status": "error", "message": "Request timeout"}
    except requests.exceptions.RequestException as e:
        print(f"❌ Request error: {e}")
        return {"status": "error", "message": str(e)}
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return {"status": "error", "message": str(e)}


def check_server_status() -> bool:
    """Check if the FastAPI server is running."""
    try:
        response = requests.get(f"{API_BASE_URL}/pdfs/", timeout=5)
        return response.status_code == 200
    except:
        return False


def get_current_pdfs() -> List[Dict]:
    """Get all PDFs currently in the database."""
    try:
        response = requests.get(f"{API_BASE_URL}/pdfs/", timeout=10)
        response.raise_for_status()
        data = response.json()
        return data.get("pdfs", [])
    except Exception as e:
        print(f"Error fetching current PDFs: {e}")
        return []


def batch_process_pdfs(pdf_directory: str = PDF_DIRECTORY):
    """Process all PDFs in the directory in batches."""

    # Check server status
    print("🔍 Checking server status...")
    if not check_server_status():
        print("❌ FastAPI server is not running!")
        print("   Please start it with: cd llm && python main.py")
        return

    print("✅ Server is running")

    # Get initial state
    initial_pdfs = get_current_pdfs()
    print(f"\n📊 Current database state: {len(initial_pdfs)} PDFs")

    # Get PDF files
    pdf_files = get_pdf_files(pdf_directory)

    if not pdf_files:
        print(f"\n⚠️  No PDF files found in '{pdf_directory}'")
        return

    print(f"\n📚 Found {len(pdf_files)} PDF files to process")
    print("=" * 60)

    # Process results tracking
    results = {
        "success": [],
        "failed": [],
        "total_connections": 0
    }

    # Process each PDF
    for i, pdf_path in enumerate(pdf_files, 1):
        print(f"\n[{i}/{len(pdf_files)}]", end=" ")

        result = process_single_pdf(pdf_path)

        if result.get("status") == "success":
            results["success"].append({
                "path": pdf_path,
                "pdf_id": result.get("pdf_id"),
                "title": result.get("title"),
                "connections": result.get("connections_found", 0)
            })
            results["total_connections"] += result.get("connections_found", 0)
        else:
            results["failed"].append({
                "path": pdf_path,
                "error": result.get("message")
            })

        # Delay between requests to avoid overwhelming the server
        if i < len(pdf_files):
            time.sleep(DELAY_BETWEEN_REQUESTS)

    # Print summary
    print("\n" + "=" * 60)
    print("📊 BATCH PROCESSING SUMMARY")
    print("=" * 60)
    print(f"✅ Successfully processed: {len(results['success'])}")
    print(f"❌ Failed: {len(results['failed'])}")
    print(f"🔗 Total connections created: {results['total_connections']}")

    if results['success']:
        print("\n✅ Successful PDFs:")
        for item in results['success']:
            print(f"   • {Path(item['path']).name}")
            print(f"     ID: {item['pdf_id']}, Title: '{item['title']}'")
            print(f"     Connections: {item['connections']}")

    if results['failed']:
        print("\n❌ Failed PDFs:")
        for item in results['failed']:
            print(f"   • {Path(item['path']).name}: {item['error']}")

    # Get final state
    final_pdfs = get_current_pdfs()
    print(f"\n📈 Database growth: {len(initial_pdfs)} → {len(final_pdfs)} PDFs")

    return results


def main():
    """Main entry point."""
    global API_BASE_URL
    import argparse

    parser = argparse.ArgumentParser(description="Batch process PDF files and store in Helix DB")
    parser.add_argument(
        "--directory",
        "-d",
        default=PDF_DIRECTORY,
        help=f"Directory containing PDF files (default: {PDF_DIRECTORY})"
    )
    parser.add_argument(
        "--url",
        default=API_BASE_URL,
        help=f"FastAPI server URL (default: {API_BASE_URL})"
    )

    args = parser.parse_args()

    API_BASE_URL = args.url

    print("🚀 PDF Batch Processor")
    print("=" * 60)
    print(f"Directory: {args.directory}")
    print(f"API URL: {API_BASE_URL}")
    print("=" * 60)

    batch_process_pdfs(args.directory)


if __name__ == "__main__":
    main()
