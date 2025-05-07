# FastAPI Backend

A modern, fast, and secure FastAPI backend with PostgreSQL database integration.

## Features

- FastAPI framework with automatic API documentation
- PostgreSQL database with SQLAlchemy ORM
- JWT authentication
- User management system
- CORS middleware
- Environment-based configuration

## Prerequisites

- Python 3.8+
- PostgreSQL
- pip (Python package manager)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up the database:
- Create a PostgreSQL database
- Update the database configuration in `app/core/config.py`

5. Run the application:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── auth.py
│   │       │   └── users.py
│   │       └── api.py
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── db/
│   │   └── session.py
│   └── models/
│       ├── base.py
│       └── user.py
├── main.py
├── requirements.txt
└── README.md
```

## API Endpoints

### Authentication
- POST `/api/v1/auth/register` - Register a new user
- POST `/api/v1/auth/token` - Login and get access token

### Users
- GET `/api/v1/users/me` - Get current user
- GET `/api/v1/users/{user_id}` - Get user by ID
- GET `/api/v1/users/` - List all users

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- CORS protection
- Environment-based configuration

## Development

To run the application in development mode with auto-reload:
```bash
uvicorn main:app --reload
```

## Production

For production deployment:
1. Update the configuration in `app/core/config.py`
2. Set proper environment variables
3. Use a production-grade ASGI server like Gunicorn
4. Set up proper database backups
5. Configure proper logging 