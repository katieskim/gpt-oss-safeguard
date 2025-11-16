"""
Hathora Voice to Text Example
This script transcribes an M4A audio file to text using Hathora's API
"""

import os
from hathora import Hathora, HathoraError, APIError, AuthenticationError
from dotenv import load_dotenv

def main():
    # Initialize the Hathora client
    load_dotenv()
    api_key = os.getenv("HATHORA_API_KEY")
    client = Hathora(api_key=api_key, timeout=30)
    
    try:
        # Speech-to-Text (Transcription)
        print("=== Transcribing Audio ===")
        stt_response = client.speech_to_text.convert(
            "parakeet",  # Model name
            "Recording.m4a"  # Audio file to transcribe
        )
        print(f"\nTranscription:\n{stt_response.text}")
        
    except AuthenticationError as e:
        print(f"Authentication failed: {e}")
        print("Please set your HATHORA_API_KEY environment variable")
    except APIError as e:
        print(f"API error (status {e.status_code}): {e.message}")
    except HathoraError as e:
        print(f"Hathora SDK error: {e}")
    except FileNotFoundError as e:
        print(f"File not found: {e}")
        print("Make sure Recording.m4a exists in the current directory")


if __name__ == "__main__":
    main()
