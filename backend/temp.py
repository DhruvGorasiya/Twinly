import os
from openai import OpenAI
from dotenv import load_dotenv
from typing import List, Dict

# Load environment variables
load_dotenv()

class Chatbot:
    def __init__(self):
        # Initialize OpenAI client with API key from environment variable
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.conversation_history: List[Dict] = []
        self.model = "gpt-3.5-turbo"  # You can change this to "gpt-4" if you have access

    def add_to_history(self, role: str, content: str):
        """Add a message to the conversation history."""
        self.conversation_history.append({"role": role, "content": content})

    def get_response(self, user_input: str) -> str:
        """
        Get a response from the chatbot based on user input.
        """
        try:
            # Add user input to conversation history
            self.add_to_history("user", user_input)

            # Get response from OpenAI
            response = self.client.chat.completions.create(
                model=self.model,
                messages=self.conversation_history,
                max_tokens=1000,
                temperature=0.7,
            )

            # Extract the response text
            bot_response = response.choices[0].message.content

            # Add bot response to conversation history
            self.add_to_history("assistant", bot_response)

            return bot_response

        except Exception as e:
            return f"An error occurred: {str(e)}"

    def clear_history(self):
        """Clear the conversation history."""
        self.conversation_history = []

def main():
    # Create a new chatbot instance
    chatbot = Chatbot()
    
    print("AI Chatbot initialized. Type 'quit' to exit, 'clear' to clear history.")
    print("=" * 50)

    while True:
        # Get user input
        user_input = input("\nYou: ").strip()

        # Check for exit command
        if user_input.lower() == 'quit':
            print("Goodbye!")
            break

        # Check for clear command
        if user_input.lower() == 'clear':
            chatbot.clear_history()
            print("Conversation history cleared.")
            continue

        # Get and print bot response
        response = chatbot.get_response(user_input)
        print("\nBot:", response)

if __name__ == "__main__":
    main()
