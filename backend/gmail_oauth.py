import os
import pickle
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

class GmailAPI:
    def __init__(self):
        self.SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']
        self.service = None

    def authenticate(self):
        """Handles the OAuth2 authentication flow."""
        creds = None
        
        # The file token.pickle stores the user's access and refresh tokens
        if os.path.exists('token.pickle'):
            with open('token.pickle', 'rb') as token:
                creds = pickle.load(token)
        
        # If there are no (valid) credentials available, let the user log in
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    'credentials.json', 
                    self.SCOPES,
                    redirect_uri='http://localhost:8080/'  # Explicitly set redirect URI
                )
                creds = flow.run_local_server(
                    port=8080,
                    success_message='Authentication successful! You can close this window.',
                    open_browser=True
                )
            
            # Save the credentials for the next run
            with open('token.pickle', 'wb') as token:
                pickle.dump(creds, token)

        # Build the Gmail service
        self.service = build('gmail', 'v1', credentials=creds)
        return self.service

    def get_email_list(self, max_results=10):
        """Get a list of recent emails."""
        if not self.service:
            self.authenticate()
        
        results = self.service.users().messages().list(
            userId='me', maxResults=max_results).execute()
        return results.get('messages', [])

    def get_email_content(self, msg_id):
        """Get the content of a specific email."""
        if not self.service:
            self.authenticate()
        
        message = self.service.users().messages().get(
            userId='me', id=msg_id, format='full').execute()
        return message

def main():
    # Initialize the Gmail API client
    gmail_client = GmailAPI()
    
    # Authenticate and get service
    service = gmail_client.authenticate()
    
    # Get recent emails
    emails = gmail_client.get_email_list(max_results=5)
    
    # Print email subjects
    for email in emails:
        msg = gmail_client.get_email_content(email['id'])
        print(f"Email ID: {msg['id']}")
        print("Headers:")
        for header in msg['payload']['headers']:
            if header['name'] in ['Subject', 'From', 'Date']:
                print(f"{header['name']}: {header['value']}")
        print("-------------------")

if __name__ == '__main__':
    main() 