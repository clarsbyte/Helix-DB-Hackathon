"""
Example: How to use the batch processor programmatically
"""

from batch_process_pdfs import batch_process_pdfs, get_current_pdfs, process_single_pdf
import sys

def example_1_batch_process():
    """Example 1: Process all PDFs in the default directory"""
    print("Example 1: Batch Processing All PDFs")
    print("-" * 60)

    results = batch_process_pdfs("pdf")
    return results


def example_2_single_pdf():
    """Example 2: Process a single PDF"""
    print("\nExample 2: Processing Single PDF")
    print("-" * 60)

    # Replace with your actual PDF path
    pdf_path = r"C:\Users\kprab\Documents\Helix-DB-Hackathon\llm\pdf\sample.pdf"

    result = process_single_pdf(pdf_path)
    print(f"Result: {result}")
    return result


def example_3_check_database():
    """Example 3: Check what's currently in the database"""
    print("\nExample 3: Checking Database Contents")
    print("-" * 60)

    pdfs = get_current_pdfs()
    print(f"Total PDFs in database: {len(pdfs)}")

    for pdf in pdfs:
        print(f"\nPDF ID: {pdf.get('pdf_id')}")
        print(f"  Title: {pdf.get('title')}")
        print(f"  Summary: {pdf.get('summary', '')[:100]}...")
        print(f"  Filename: {pdf.get('filename')}")

    return pdfs


def example_4_custom_directory():
    """Example 4: Process PDFs from a custom directory"""
    print("\nExample 4: Custom Directory Processing")
    print("-" * 60)

    # Process PDFs from a different directory
    custom_dir = "my_research_papers"
    results = batch_process_pdfs(custom_dir)
    return results


def example_5_selective_processing():
    """Example 5: Process only specific PDFs"""
    print("\nExample 5: Selective Processing")
    print("-" * 60)

    from pathlib import Path

    # Get all PDFs
    pdf_dir = Path("pdf")
    all_pdfs = list(pdf_dir.glob("*.pdf"))

    # Filter - only process PDFs with "lecture" in the name
    lecture_pdfs = [str(p.absolute()) for p in all_pdfs if "lecture" in p.name.lower()]

    print(f"Found {len(lecture_pdfs)} lecture PDFs")

    results = {"success": [], "failed": []}

    for pdf_path in lecture_pdfs:
        result = process_single_pdf(pdf_path)
        if result.get("status") == "success":
            results["success"].append(result)
        else:
            results["failed"].append(result)

    print(f"\nProcessed: {len(results['success'])} successful, {len(results['failed'])} failed")
    return results


if __name__ == "__main__":
    print("🧪 PDF Batch Processor - Usage Examples")
    print("=" * 60)

    # Run example 1: Batch process
    try:
        example_1_batch_process()
    except Exception as e:
        print(f"Example 1 failed: {e}")

    # Run example 3: Check database
    try:
        example_3_check_database()
    except Exception as e:
        print(f"Example 3 failed: {e}")

    print("\n" + "=" * 60)
    print("💡 Other examples available:")
    print("  - example_2_single_pdf(): Process one PDF")
    print("  - example_4_custom_directory(): Use custom directory")
    print("  - example_5_selective_processing(): Filter PDFs before processing")
    print("\nUncomment the example calls in the script to try them!")
