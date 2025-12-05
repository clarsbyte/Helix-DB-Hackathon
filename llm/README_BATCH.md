# PDF Batch Processing Guide

This guide explains how to batch process multiple PDF files and store them in the Helix DB with automatic connection detection.

## Overview

The batch processing system consists of:
- **main.py**: FastAPI server that handles individual PDF processing
- **batch_process_pdfs.py**: Batch processor that sends multiple PDFs to the server

## How It Works

1. **Text Extraction**: Each PDF is read and text is extracted
2. **AI Analysis**: Gemini analyzes the PDF to extract title and summary
3. **Connection Detection**: AI compares new PDF with existing ones to find relationships
4. **Storage**: PDF metadata and connections are stored in Helix DB as a graph

## Setup

### 1. Install Dependencies

Make sure you have all required packages:

```bash
cd llm
pip install -r requirements.txt
```

If you don't have a requirements.txt, install:

```bash
pip install fastapi uvicorn pydantic-ai python-dotenv PyPDF2 requests helix
```

### 2. Set Up Environment Variables

Create a `.env` file in the `llm` directory:

```bash
GOOGLE_API_KEY=your_gemini_api_key_here
```

### 3. Prepare PDF Files

Place your PDF files in the `llm/pdf/` directory:

```bash
mkdir -p pdf
# Copy your PDFs to this directory
```

## Running the Batch Processor

### Step 1: Start the FastAPI Server

In one terminal, start the API server:

```bash
cd llm
python main.py
```

The server will start on `http://localhost:8000`

### Step 2: Run the Batch Processor

In another terminal, run the batch processor:

```bash
cd llm
python batch_process_pdfs.py
```

**With custom directory:**

```bash
python batch_process_pdfs.py --directory /path/to/your/pdfs
```

**With custom API URL:**

```bash
python batch_process_pdfs.py --url http://localhost:8000
```

## Output

The batch processor will:
- Show progress for each PDF
- Display connections found between PDFs
- Provide a summary at the end

Example output:

```
🚀 PDF Batch Processor
============================================================
Directory: pdf
API URL: http://localhost:8000
============================================================

🔍 Checking server status...
✅ Server is running

📊 Current database state: 0 PDFs

📚 Found 5 PDF files to process
============================================================

[1/5] 📄 Processing: machine_learning.pdf
✅ Success: 'Introduction to Machine Learning'
   PDF ID: 1
   Connections found: 0

[2/5] 📄 Processing: deep_learning.pdf
✅ Success: 'Deep Learning Fundamentals'
   PDF ID: 2
   Connections found: 1
   → Related to PDF #1 (prerequisite, confidence: 0.85)

[3/5] 📄 Processing: neural_networks.pdf
✅ Success: 'Neural Networks Explained'
   PDF ID: 3
   Connections found: 2
   → Related to PDF #1 (extends, confidence: 0.75)
   → Related to PDF #2 (similar_topic, confidence: 0.92)

============================================================
📊 BATCH PROCESSING SUMMARY
============================================================
✅ Successfully processed: 5
❌ Failed: 0
🔗 Total connections created: 10
```

## Connection Types

The AI can identify these relationship types:

- **similar_topic**: PDFs covering similar subjects
- **prerequisite**: One PDF should be read before the other
- **references**: One PDF explicitly references the other
- **extends**: One PDF builds upon concepts in the other
- **contradicts**: PDFs present conflicting viewpoints

## API Endpoints

Once the server is running, you can also use these endpoints:

### Get All PDFs

```bash
curl http://localhost:8000/pdfs/
```

### Get Connections for a Specific PDF

```bash
curl http://localhost:8000/pdf/1/connections
```

### Process a Single PDF

```bash
curl -X POST http://localhost:8000/process-pdf/ \
  -H "Content-Type: application/json" \
  -d '{"pdf_path": "/path/to/your/file.pdf"}'
```

## Troubleshooting

### Server Not Running

If you see "FastAPI server is not running!", make sure:
1. You started `python main.py` in a separate terminal
2. Port 8000 is not blocked
3. Check for errors in the server logs

### No PDFs Found

If you see "No PDF files found", ensure:
1. PDF files are in the correct directory
2. Files have `.pdf` extension
3. You have read permissions

### Connection Errors

If processing fails:
1. Check your GOOGLE_API_KEY is set correctly
2. Verify Helix DB is running (`helix status`)
3. Check server logs for detailed errors

### Timeouts

For large PDFs:
- Increase timeout in `batch_process_pdfs.py` (default: 120 seconds)
- Process fewer PDFs at a time

## Advanced Usage

### Customize Batch Size

Edit `batch_process_pdfs.py`:

```python
BATCH_SIZE = 10  # Process 10 at a time
DELAY_BETWEEN_REQUESTS = 2  # Wait 2 seconds between requests
```

### Filter PDF Files

Modify the `get_pdf_files()` function to filter by name pattern:

```python
pdf_files = [f for f in pdf_dir.glob("*.pdf") if "lecture" in f.name.lower()]
```

## Integration with Helix DB

All data is stored in your Helix DB instance. The structure:

- **PDF Nodes**: Store title, summary, filename, upload_date
- **Relationship Edges**: Connect related PDFs with type and confidence score

Query the graph using Helix queries (see `helix/db/queries.hx`)

## Next Steps

After batch processing, you can:
1. Visualize the PDF graph in the frontend
2. Navigate connections via the web interface
3. Add more PDFs (they'll automatically connect to existing ones)
4. Export the graph data
