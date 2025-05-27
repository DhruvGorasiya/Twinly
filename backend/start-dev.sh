#!/bin/bash

# Start Cloud SQL Proxy if not running
if ! pgrep -x "cloud-sql-proxy" > /dev/null; then
    echo "Starting Cloud SQL proxy..."
    cloud-sql-proxy twinly-459118:us-central1:twinly \
        --credentials-file=./keys/cloudsql-proxy.json \
        --port=5432 &
    sleep 5
else
    echo "Cloud SQL proxy is already running"
fi

# Start FastAPI locally on port 8000
echo "Starting FastAPI in dev mode..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload