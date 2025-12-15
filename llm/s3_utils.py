"""
AWS S3 Utility Module for PDF Storage
Handles upload, download, delete, and presigned URL generation for PDFs in S3
"""

import boto3
import os
from botocore.exceptions import ClientError
from dotenv import load_dotenv

load_dotenv()

# S3 Configuration from environment variables
S3_BUCKET_NAME = os.getenv('AWS_S3_BUCKET_NAME')
AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')
S3_PRESIGNED_URL_EXPIRATION = int(os.getenv('S3_PRESIGNED_URL_EXPIRATION', 3600))  # 1 hour default

# Initialize S3 client
s3_client = boto3.client(
    's3',
    region_name=AWS_REGION,
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)


def upload_pdf_to_s3(file_content: bytes, filename: str, user_id: str) -> dict:
    """
    Upload a PDF file to S3 with user_id organization

    Args:
        file_content: Binary content of the PDF file
        filename: Original filename
        user_id: User ID for organization and metadata

    Returns:
        dict with s3_key, bucket_name, status
    """
    try:
        # Create S3 key: user_id/filename
        s3_key = f"{user_id}/{filename}"

        # Upload with metadata
        s3_client.put_object(
            Bucket=S3_BUCKET_NAME,
            Key=s3_key,
            Body=file_content,
            ContentType='application/pdf',
            Metadata={
                'user_id': user_id,
                'original_filename': filename
            },
            ServerSideEncryption='AES256'  # Encrypt at rest
        )

        print(f"DEBUG - Uploaded to S3: {s3_key}")

        return {
            'status': 'success',
            's3_key': s3_key,
            'bucket_name': S3_BUCKET_NAME
        }

    except ClientError as e:
        print(f"Error uploading to S3: {e}")
        return {
            'status': 'error',
            'error': str(e)
        }


def download_pdf_from_s3(s3_key: str) -> bytes:
    """
    Download a PDF file from S3

    Args:
        s3_key: S3 object key (e.g., "user123/file.pdf")

    Returns:
        bytes: PDF file content
    """
    try:
        response = s3_client.get_object(
            Bucket=S3_BUCKET_NAME,
            Key=s3_key
        )

        return response['Body'].read()

    except ClientError as e:
        print(f"Error downloading from S3: {e}")
        raise


def delete_pdf_from_s3(s3_key: str) -> bool:
    """
    Delete a PDF file from S3

    Args:
        s3_key: S3 object key to delete

    Returns:
        bool: True if successful, False otherwise
    """
    try:
        s3_client.delete_object(
            Bucket=S3_BUCKET_NAME,
            Key=s3_key
        )

        print(f"DEBUG - Deleted from S3: {s3_key}")
        return True

    except ClientError as e:
        print(f"Error deleting from S3: {e}")
        return False


def generate_presigned_url(s3_key: str, expiration: int = None) -> str:
    """
    Generate a presigned URL for temporary access to a PDF

    Args:
        s3_key: S3 object key
        expiration: URL expiration time in seconds (default from env)

    Returns:
        str: Presigned URL
    """
    try:
        if expiration is None:
            expiration = S3_PRESIGNED_URL_EXPIRATION

        url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': S3_BUCKET_NAME,
                'Key': s3_key
            },
            ExpiresIn=expiration
        )

        return url

    except ClientError as e:
        print(f"Error generating presigned URL: {e}")
        raise


def verify_s3_connection() -> bool:
    """
    Verify S3 connection and bucket access

    Returns:
        bool: True if connection successful
    """
    try:
        s3_client.head_bucket(Bucket=S3_BUCKET_NAME)
        print(f"DEBUG - S3 connection verified for bucket: {S3_BUCKET_NAME}")
        return True
    except ClientError as e:
        print(f"Error verifying S3 connection: {e}")
        return False
