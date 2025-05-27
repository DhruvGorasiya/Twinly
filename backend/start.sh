#!/bin/bash

# Print environment variables for debugging
echo "Environment variables:"
env | sort

# Get the port from environment variable, default to 8080
PORT=${PORT:-8080}
echo "Starting FastAPI application on port $PORT..."

# Start the application
exec uvicorn main:app --host 0.0.0.0 --port $PORT