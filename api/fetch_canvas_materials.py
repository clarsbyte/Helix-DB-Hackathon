#!/usr/bin/env python3
"""
Simple script to fetch relevant attachments and documents from Canvas courses.
"""

import requests
import json
import os
import re
from pathlib import Path

# Canvas Configuration
CANVAS_DOMAIN = "canvas.ucsd.edu"  # UCSD Canvas domain
ACCESS_TOKEN = "13171~QY74ZT8uDPKXWTWf4HZ4A6H7UZKFwGrHmY7LMQaFhA8LUAB2z9QPnKknDceyGPUR"
BASE_URL = f"https://{CANVAS_DOMAIN}/api/v1"

# Headers for API requests
HEADERS = {
    "Authorization": f"Bearer {ACCESS_TOKEN}"
}


def get_courses():
    """Fetch all active courses for the current user."""
    url = f"{BASE_URL}/courses"
    params = {
        "enrollment_state": "active",
        "per_page": 100
    }

    response = requests.get(url, headers=HEADERS, params=params)
    response.raise_for_status()
    return response.json()


def get_course_files(course_id):
    """Fetch all files for a specific course."""
    url = f"{BASE_URL}/courses/{course_id}/files"
    params = {
        "per_page": 100
    }

    all_files = []
    while url:
        response = requests.get(url, headers=HEADERS, params=params)
        response.raise_for_status()
        all_files.extend(response.json())

        # Check for pagination
        if 'next' in response.links:
            url = response.links['next']['url']
        else:
            url = None

    return all_files


def get_course_folders(course_id):
    """Fetch all folders for a specific course."""
    url = f"{BASE_URL}/courses/{course_id}/folders"
    params = {
        "per_page": 100
    }

    response = requests.get(url, headers=HEADERS, params=params)
    response.raise_for_status()
    return response.json()


def download_file(file_info, download_dir):
    """Download a file from Canvas."""
    file_url = file_info.get('url')
    file_name = file_info.get('display_name', 'unknown')

    if not file_url:
        print(f"  ⚠️  No URL for file: {file_name}")
        return False

    try:
        response = requests.get(file_url, headers=HEADERS, stream=True)
        response.raise_for_status()

        file_path = os.path.join(download_dir, file_name)
        with open(file_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)

        print(f"  ✓ Downloaded: {file_name}")
        return True
    except Exception as e:
        print(f"  ✗ Failed to download {file_name}: {str(e)}")
        return False


def sanitize_filename(filename):
    """Remove invalid characters from filename for Windows/Unix compatibility."""
    # Replace invalid characters with underscore
    invalid_chars = r'[<>:"/\\|?*]'
    sanitized = re.sub(invalid_chars, '_', filename)
    # Remove any trailing dots or spaces
    sanitized = sanitized.rstrip('. ')
    return sanitized


def main():
    """Main function to fetch and organize Canvas materials."""
    print("=" * 60)
    print("Canvas Materials Fetcher")
    print("=" * 60)

    # Create downloads directory
    downloads_dir = Path("canvas_materials")
    downloads_dir.mkdir(exist_ok=True)

    try:
        # Fetch courses
        print("\n📚 Fetching your courses...")
        courses = get_courses()
        print(f"Found {len(courses)} active courses\n")

        # Display courses and let user select
        for idx, course in enumerate(courses, 1):
            course_name = course.get('name', 'Unknown Course')
            course_code = course.get('course_code', 'N/A')
            print(f"{idx}. {course_name} ({course_code})")

        # For now, fetch materials from all courses
        # You can modify this to select specific courses
        print("\n" + "=" * 60)

        for course in courses:
            course_id = course['id']
            course_name = course.get('name', f'Course_{course_id}')
            print(f"\n📖 Processing: {course_name}")

            # Create course-specific directory with sanitized name
            sanitized_name = sanitize_filename(course_name)
            course_dir = downloads_dir / sanitized_name
            course_dir.mkdir(exist_ok=True)

            # Fetch files
            print(f"  📎 Fetching files...")
            files = get_course_files(course_id)
            print(f"  Found {len(files)} files")

            # Save file metadata
            metadata_file = course_dir / "files_metadata.json"
            with open(metadata_file, 'w') as f:
                json.dump(files, f, indent=2)
            print(f"  ✓ Saved metadata to: {metadata_file}")

            # Optionally download files (uncomment to enable)
            # print(f"  📥 Downloading files...")
            # for file_info in files:
            #     download_file(file_info, course_dir)

            # Fetch folders
            try:
                print(f"  📁 Fetching folders...")
                folders = get_course_folders(course_id)
                print(f"  Found {len(folders)} folders")

                # Save folder metadata
                folders_file = course_dir / "folders_metadata.json"
                with open(folders_file, 'w') as f:
                    json.dump(folders, f, indent=2)
                print(f"  ✓ Saved folder info to: {folders_file}")
            except Exception as e:
                print(f"  ⚠️  Could not fetch folders: {str(e)}")

        print("\n" + "=" * 60)
        print(f"✅ Complete! Materials saved to: {downloads_dir.absolute()}")
        print("=" * 60)

    except requests.exceptions.HTTPError as e:
        print(f"\n❌ HTTP Error: {e}")
        print("Please check your access token and Canvas domain.")
    except Exception as e:
        print(f"\n❌ Error: {e}")


if __name__ == "__main__":
    main()
