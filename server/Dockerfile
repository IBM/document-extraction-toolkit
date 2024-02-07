# Use an official Alpine Linux image as the base image
FROM python:3.10-alpine

# Create a non-root user to run the application
RUN adduser -D watson

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file into the container
COPY requirements.txt requirements.txt

# Install system dependencies required for numpy
RUN apk add --no-cache git musl-dev gcc g++ gfortran libffi-dev

# Install Python dependencies as the non-root user
RUN pip install --no-cache-dir -r ./requirements.txt

COPY . /app

# Run the Python script as the non-root user
USER watson

ENV PYTHONPATH=.

# Command to start your Python application (modify as needed)
CMD ["procrastinate", "--app=procrastinateworker.worker.app", "worker"]