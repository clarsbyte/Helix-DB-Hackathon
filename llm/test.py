import requests
import os

# Get the full path to the PDF
pdf_path = os.path.join(os.path.dirname(__file__), "ccornellvec.pdf")

print("="*60)
print("1. Fetching all existing PDFs...")
print("="*60)
# all_pdfs_response = requests.get("http://localhost:8000/pdfs/")
# all_pdfs = all_pdfs_response.json()
# print(f"Current PDFs: {all_pdfs['count']}")
# for pdf in all_pdfs.get('pdfs', []):
#     print(f"  - ID: {pdf.get('pdf_id')}, Title: {pdf.get('title')}")

# print("\n" + "="*60)
# print("2. Processing new PDF...")
# print("="*60)
# process_response = requests.post(
#     "http://localhost:8000/process-pdf/",
#     json={"pdf_path": pdf_path}
# )
# result = process_response.json()
# print(f"Status: {result.get('status')}")
# if result.get('status') == 'success':
#     print(f"PDF ID: {result.get('pdf_id')}")
#     print(f"Title: {result.get('title')}")
#     print(f"Connections found: {result.get('connections_found')}")
#     print(f"Connections: {result.get('connections')}")
# else:
#     print(f"Error: {result.get('message')}")

print("\n" + "="*60)
print("3. Fetching connections for PDF ID 1...")
print("="*60)
connections_response = requests.get("http://localhost:8000/pdf/3/connections")
connections_data = connections_response.json()
print(f"Status: {connections_data.get('status')}")
print(f"PDF ID: {connections_data.get('pdf_id')}")
print(f"Connections: {connections_data.get('connections')}")

print("\n" + "="*60)
print("4. Fetching all PDFs again...")
print("="*60)
final_response = requests.get("http://localhost:8000/pdfs/")
final_data = final_response.json()
print(f"Total PDFs: {final_data['count']}")
for pdf in final_data.get('pdfs', []):
    print(f"  - ID: {pdf.get('pdf_id')}, Title: {pdf.get('title')}")