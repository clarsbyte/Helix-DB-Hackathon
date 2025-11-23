# Canvas Materials Fetcher

A simple Python script to pull relevant attachments and documents from your Canvas courses.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Update the Canvas domain in `fetch_canvas_materials.py`:
   - Change `CANVAS_DOMAIN` to your institution's Canvas domain (e.g., "uiowa.instructure.com")
   - The access token is already configured from your brainstorming.md

## Usage

Run the script:
```bash
python fetch_canvas_materials.py
```

The script will:
1. Fetch all your active courses
2. List each course with its name and code
3. For each course, fetch:
   - All files and save metadata to `files_metadata.json`
   - All folders and save metadata to `folders_metadata.json`
4. Save everything to `canvas_materials/` directory

## Downloading Files

By default, the script only saves file metadata (URLs, names, sizes, etc.) without downloading actual files. To enable file downloads:

1. Uncomment lines 117-119 in `fetch_canvas_materials.py`:
```python
print(f"  📥 Downloading files...")
for file_info in files:
    download_file(file_info, course_dir)
```

## Output Structure

```
canvas_materials/
├── Course Name 1/
│   ├── files_metadata.json
│   ├── folders_metadata.json
│   └── [downloaded files if enabled]
├── Course Name 2/
│   ├── files_metadata.json
│   └── folders_metadata.json
...
```

## Metadata Format

The `files_metadata.json` contains:
- `id`: File ID
- `display_name`: File name
- `url`: Download URL
- `size`: File size in bytes
- `content-type`: MIME type
- `created_at` / `updated_at`: Timestamps
- And more Canvas file properties

The `folders_metadata.json` contains folder structure information for organizing materials.
