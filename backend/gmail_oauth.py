import os
import pickle
import base64
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from bs4 import BeautifulSoup
import html2text
from datetime import datetime
import email.utils

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
                    redirect_uri='http://localhost:8080/'
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

    def get_starred_emails(self, max_results=10):
        """Get a list of starred emails."""
        if not self.service:
            self.authenticate()
        
        results = self.service.users().messages().list(
            userId='me',
            labelIds=['STARRED'],
            maxResults=max_results
        ).execute()
        return results.get('messages', [])

    def get_email_list(self, max_results=10, label='INBOX'):
        """
        Get a list of recent emails from a specific label/category.
        Labels can be: 'INBOX', 'SPAM', 'CATEGORY_SOCIAL', 'CATEGORY_PROMOTIONS', 'CATEGORY_UPDATES', etc.
        """
        if not self.service:
            self.authenticate()
        
        results = self.service.users().messages().list(
            userId='me',
            labelIds=[label],
            maxResults=max_results
        ).execute()
        return results.get('messages', [])

    def get_available_labels(self):
        """Get all available labels in the Gmail account."""
        if not self.service:
            self.authenticate()
        
        results = self.service.users().labels().list(userId='me').execute()
        return results.get('labels', [])

    def decode_body(self, data):
        """Decode base64url encoded string"""
        if data:
            return base64.urlsafe_b64decode(data.encode('UTF-8')).decode('UTF-8')
        return ""

    def get_email_content(self, msg_id):
        """Get detailed content of a specific email."""
        if not self.service:
            self.authenticate()
        
        message = self.service.users().messages().get(
            userId='me', id=msg_id, format='full').execute()
        
        email_data = {
            'id': message['id'],
            'thread_id': message['threadId'],
            'labels': message['labelIds'],
            'headers': {},
            'body': {
                'plain': '',
                'html': ''
            },
            'attachments': [],
            'metadata': {
                'date': None,
                'size': message['sizeEstimate']
            }
        }

        # Process headers
        for header in message['payload']['headers']:
            email_data['headers'][header['name']] = header['value']
            if header['name'] == 'Date':
                # Convert email date to readable format
                parsed_date = email.utils.parsedate_to_datetime(header['value'])
                email_data['metadata']['date'] = parsed_date.strftime("%Y-%m-%d %H:%M:%S")

        def process_parts(parts, email_data, message_id):
            """Recursively process message parts"""
            for part in parts:
                mimeType = part.get('mimeType', '')
                
                if mimeType == 'text/plain':
                    data = part.get('body', {}).get('data', '')
                    if data:
                        email_data['body']['plain'] += self.decode_body(data)
                
                elif mimeType == 'text/html':
                    data = part.get('body', {}).get('data', '')
                    if data:
                        email_data['body']['html'] += self.decode_body(data)
                
                elif 'multipart' in mimeType:
                    if 'parts' in part:
                        process_parts(part['parts'], email_data, message_id)
                
                elif part.get('filename'):
                    # Handle attachment
                    attachment = {
                        'id': part['body'].get('attachmentId'),
                        'filename': part['filename'],
                        'mimeType': part['mimeType'],
                        'size': part['body'].get('size', 0)
                    }
                    email_data['attachments'].append(attachment)

        # Process payload
        if 'parts' in message['payload']:
            process_parts(message['payload']['parts'], email_data, message['id'])
        else:
            # Handle single part messages
            data = message['payload'].get('body', {}).get('data', '')
            if data:
                if message['payload'].get('mimeType') == 'text/plain':
                    email_data['body']['plain'] = self.decode_body(data)
                elif message['payload'].get('mimeType') == 'text/html':
                    email_data['body']['html'] = self.decode_body(data)

        return email_data

    def search_emails(self, query, max_results=10):
        """
        Search emails using Gmail search operators.
        
        Some example queries:
        - "from:someone@example.com" - Emails from a specific sender
        - "subject:meeting" - Emails with 'meeting' in subject
        - "after:2024/01/01" - Emails after date
        - "before:2024/03/01" - Emails before date
        - "has:attachment" - Emails with attachments
        - "is:starred" - Starred emails
        - "in:anywhere" - Search in all emails including spam and trash
        - "newer_than:2d" - Emails newer than 2 days
        - "older_than:1w" - Emails older than 1 week
        """
        if not self.service:
            self.authenticate()
        
        try:
            results = self.service.users().messages().list(
                userId='me',
                q=query,
                maxResults=max_results
            ).execute()
            
            messages = results.get('messages', [])
            return messages
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return []

def format_email_size(size_bytes):
    """Convert bytes to human readable format"""
    for unit in ['B', 'KB', 'MB']:
        if size_bytes < 1024:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024
    return f"{size_bytes:.1f} GB"

def main():
    # Initialize the Gmail API client
    gmail_client = GmailAPI()
    
    print("\nAuthenticating with Gmail...")
    print("=" * 50)
    
    # Authenticate and get service
    service = gmail_client.authenticate()
    
    print("\nFetching starred messages...")
    print("=" * 50)
    
    # Get starred emails
    emails = gmail_client.get_starred_emails(max_results=10)
    
    if not emails:
        print("No starred messages found.")
        return
    
    print(f"\nFound {len(emails)} starred messages:")
    print("=" * 50)
    
    for email_meta in emails:
        email_data = gmail_client.get_email_content(email_meta['id'])
        
        # Print email details
        print("\n📧 Email Details:")
        print(f"Date: {email_data['metadata']['date']}")
        print(f"From: {email_data.get('headers', {}).get('From', 'N/A')}")
        print(f"Subject: {email_data.get('headers', {}).get('Subject', 'N/A')}")
        
        # Print snippet of content
        if email_data['body']['plain']:
            content = email_data['body']['plain'][:200]
        elif email_data['body']['html']:
            h = html2text.HTML2Text()
            h.ignore_links = True
            content = h.handle(email_data['body']['html'])[:200]
        else:
            content = "No content available"
        
        print("\nPreview:")
        print(f"{content}...")
        print("-" * 50)
    
    # Option to view full email
    while True:
        view_full = input("\nEnter email number to view full content (1 to {}) or 'q' to quit: ".format(len(emails)))
        if view_full.lower() == 'q':
            break
        try:
            idx = int(view_full) - 1
            if 0 <= idx < len(emails):
                email_data = gmail_client.get_email_content(emails[idx]['id'])
                
                print("\n" + "="*80)
                print("FULL EMAIL CONTENT")
                print("="*80)
                
                print("\n📧 BASIC INFORMATION:")
                print(f"Message ID: {email_data['id']}")
                print(f"Thread ID: {email_data['thread_id']}")
                print(f"Size: {format_email_size(email_data['metadata']['size'])}")
                print(f"Date: {email_data['metadata']['date']}")
                
                print("\n🏷️ LABELS:")
                print(", ".join(email_data['labels']))
                
                print("\n📝 HEADERS:")
                important_headers = ['From', 'To', 'Subject', 'Cc', 'Bcc']
                for header in important_headers:
                    if header in email_data['headers']:
                        print(f"{header}: {email_data['headers'][header]}")
                
                print("\n📄 CONTENT:")
                if email_data['body']['plain']:
                    print("\nPlain Text Content:")
                    print("-" * 40)
                    print(email_data['body']['plain'])
                elif email_data['body']['html']:
                    h = html2text.HTML2Text()
                    h.ignore_links = False
                    plain_text = h.handle(email_data['body']['html'])
                    print("\nConverted HTML Content:")
                    print("-" * 40)
                    print(plain_text)
                
                if email_data['attachments']:
                    print("\n📎 ATTACHMENTS:")
                    for idx, attachment in enumerate(email_data['attachments'], 1):
                        print(f"\nAttachment {idx}:")
                        print(f"Filename: {attachment['filename']}")
                        print(f"Type: {attachment['mimeType']}")
                        print(f"Size: {format_email_size(attachment['size'])}")
            else:
                print("Invalid email number!")
        except ValueError:
            print("Invalid input!")

if __name__ == '__main__':
    main() 