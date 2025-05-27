# #!/bin/bash

# # Check if we're in production environment
# if [ "$ENVIRONMENT" = "production" ]; then
#     echo "Starting in production mode..."
    
#     # Start Cloud SQL proxy if INSTANCE_CONNECTION_NAME is set
#     if [ ! -z "$INSTANCE_CONNECTION_NAME" ]; then
#         echo "Starting Cloud SQL proxy..."
#         # In production, we don't need the credentials file
#         cloud_sql_proxy -instances=$INSTANCE_CONNECTION_NAME=tcp:5432 &
#         sleep 5
#     fi
    
#     # Start the FastAPI application
#     echo "Starting FastAPI application..."
#     uvicorn main:app --host 0.0.0.0 --port 8080
# else
#     echo "Starting in local mode..."
    
#     # Check if cloud-sql-proxy is already running
#     if ! pgrep -x "cloud-sql-proxy" > /dev/null; then
#         echo "Starting Cloud SQL proxy..."
#         # In local development, we use the credentials file
#         cloud-sql-proxy twinly-459118:us-central1:twinly \
#             --credentials-file=/Users/dhruvgorasiya/keys/cloudsql-proxy.json \
#             --port=5432 &
        
#         # Wait for the proxy to start
#         sleep 5
#     else
#         echo "Cloud SQL proxy is already running"
#     fi
    
#     # Start the FastAPI application with reload for local development
#     echo "Starting FastAPI application..."
#     uvicorn main:app --host 0.0.0.0 --port 8000 --reload
# fi