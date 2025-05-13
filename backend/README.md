# Gmail OAuth Integration

This project demonstrates how to authenticate with Gmail using OAuth2 and access Gmail data using the Gmail API.

## Setup Instructions

1. **Set up Google Cloud Project:**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Gmail API for your project
   - Go to the Credentials page
   - Create OAuth 2.0 Client ID credentials
   - Download the client configuration file and save it as `credentials.json` in the project directory

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Application:**
   ```bash
   python gmail_oauth.py
   ```
   - On first run, it will open a browser window asking you to authorize the application
   - After authorization, it will save the credentials in `token.pickle` for future use

## Features

- OAuth2 authentication with Gmail
- Fetch recent emails
- Read email content and metadata
- Supports both reading and sending emails (based on configured scopes)

## Security Notes

- Keep your `credentials.json` and `token.pickle` files secure
- Never commit these files to version control
- Add them to your `.gitignore` file

## Scopes Used

- `https://www.googleapis.com/auth/gmail.readonly` - For reading emails
- `https://www.googleapis.com/auth/gmail.send` - For sending emails 