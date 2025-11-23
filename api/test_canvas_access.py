#!/usr/bin/env python3
"""
Diagnostic script to test Canvas API access and identify permission issues.
"""

import requests
import json

CANVAS_DOMAIN = "canvas.ucsd.edu"
ACCESS_TOKEN = "13171~QY74ZT8uDPKXWTWf4HZ4A6H7UZKFwGrHmY7LMQaFhA8LUAB2z9QPnKknDceyGPUR"
BASE_URL = f"https://{CANVAS_DOMAIN}/api/v1"

HEADERS = {
    "Authorization": f"Bearer {ACCESS_TOKEN}"
}


def test_user_profile():
    """Test basic API access by fetching user profile."""
    print("\n1. Testing user profile access...")
    url = f"{BASE_URL}/users/self/profile"
    try:
        response = requests.get(url, headers=HEADERS)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Success! User: {data.get('name', 'N/A')}")
            return True
        else:
            print(f"   ✗ Failed: {response.text}")
            return False
    except Exception as e:
        print(f"   ✗ Error: {e}")
        return False


def test_courses_list():
    """Test courses endpoint."""
    print("\n2. Testing courses list access...")
    url = f"{BASE_URL}/courses"
    params = {"enrollment_state": "active", "per_page": 5}
    try:
        response = requests.get(url, headers=HEADERS, params=params)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            courses = response.json()
            print(f"   ✓ Success! Found {len(courses)} courses")
            for course in courses[:3]:
                print(f"      - {course.get('name', 'N/A')} (ID: {course.get('id')})")
            return courses
        else:
            print(f"   ✗ Failed: {response.text}")
            return []
    except Exception as e:
        print(f"   ✗ Error: {e}")
        return []


def test_course_files(course_id):
    """Test file access for a specific course."""
    print(f"\n3. Testing file access for course {course_id}...")
    url = f"{BASE_URL}/courses/{course_id}/files"
    params = {"per_page": 5}
    try:
        response = requests.get(url, headers=HEADERS, params=params)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            files = response.json()
            print(f"   ✓ Success! Found {len(files)} files")
            return True
        elif response.status_code == 403:
            print(f"   ✗ 403 Forbidden - Token lacks permission to access files")
            print(f"   Response: {response.text}")
            return False
        elif response.status_code == 401:
            print(f"   ✗ 401 Unauthorized - Token is invalid or expired")
            return False
        else:
            print(f"   ✗ Failed: {response.text}")
            return False
    except Exception as e:
        print(f"   ✗ Error: {e}")
        return False


def test_course_tabs(course_id):
    """Test course tabs to see what's available."""
    print(f"\n4. Testing course tabs for course {course_id}...")
    url = f"{BASE_URL}/courses/{course_id}/tabs"
    try:
        response = requests.get(url, headers=HEADERS)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            tabs = response.json()
            print(f"   ✓ Available tabs:")
            for tab in tabs:
                visibility = "visible" if tab.get('hidden') is False else "hidden"
                print(f"      - {tab.get('label', 'N/A')} ({visibility})")
            return True
        else:
            print(f"   ✗ Failed: {response.text}")
            return False
    except Exception as e:
        print(f"   ✗ Error: {e}")
        return False


def main():
    print("=" * 60)
    print("Canvas API Access Diagnostic Tool")
    print("=" * 60)

    if not test_user_profile():
        print("\n❌ Basic API access failed. Check your token.")
        return

    courses = test_courses_list()
    if not courses:
        print("\n❌ Cannot access courses. Check your token permissions.")
        return

    if courses:
        course_id = courses[0].get('id')
        course_name = courses[0].get('name', 'N/A')
        print(f"\n{'=' * 60}")
        print(f"Testing with first course: {course_name}")
        print(f"{'=' * 60}")

        test_course_tabs(course_id)
        test_course_files(course_id)

    print("\n" + "=" * 60)
    print("Diagnostic complete!")
    print("\nIf file access failed with 403:")
    print("1. Go to Canvas → Account → Settings → Approved Integrations")
    print("2. Delete the old token")
    print("3. Create a new token with full permissions")
    print("4. Update ACCESS_TOKEN in the script")
    print("=" * 60)


if __name__ == "__main__":
    main()
