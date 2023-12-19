import boto3
import os
from botocore.exceptions import NoCredentialsError
from dotenv import load_dotenv

load_dotenv()
# Configuration for S3
S3_ENDPOINT_URL = os.getenv("S3_ENDPOINT_URL", "http://localhost:9000")  # Update this
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY_ID", None)
S3_SECRET_KEY = os.getenv("S3_SECRET_ACCESS_KEY", None)
S3_BUCKET = os.getenv("S3_BUCKET", None)

print(S3_ACCESS_KEY)

s3_client = boto3.client(
    's3',
    endpoint_url=S3_ENDPOINT_URL,
    aws_access_key_id=S3_ACCESS_KEY,
    aws_secret_access_key=S3_SECRET_KEY
)