#!/bin/bash

# Check if cloud-sql-proxy is already running
if ! pgrep -x "cloud-sql-proxy" > /dev/null; then
    echo "Starting Cloud SQL proxy..."
    cloud-sql-proxy twinly-459118:us-central1:twinly \
        --credentials-file=/Users/dhruvgorasiya/keys/cloudsql-proxy.json \
        --port=5432 &
    
    # Wait for the proxy to start
    sleep 5
else
    echo "Cloud SQL proxy is already running"
fi

# Start the FastAPI application
echo "Starting FastAPI application..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload