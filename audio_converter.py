"""
Audio Content Classifier
This script transcribes audio using Hathora's API and then classifies 
the content using OpenAI's content classification model.
"""

import os
import json
import re
from hathora import Hathora, HathoraError, APIError, AuthenticationError
from openai import OpenAI
from dotenv import load_dotenv


# Initialize clients
def initialize_clients():
    """Initialize Hathora and OpenAI clients"""
    hathora_api_key = os.getenv("HATHORA_API_KEY")
    hathora_client = Hathora(api_key=hathora_api_key, timeout=30)
    
    openai_client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=os.getenv("OPENAI_API_KEY"),
    )
    
    return hathora_client, openai_client


# Content classification policy
POLICY = """
You are a content classifier that assigns movie-style ratings to user content.

Your job: read the transcript of a piece of spoken audio and rate it as one of:
- "G"
- "PG"
- "PG-13"
- "R"

Base your decision on:
- Violence and threats
- Sexual content and nudity
- Profanity and slurs
- Drug/alcohol use
- Self-harm or suicide

### Guidelines (simplified)

G:
- No swearing beyond mild ("heck", "darn").
- No sexual content.
- No real-world violence or threats.
- No drugs, self-harm, or graphic content.

PG:
- Very mild language ("crap", "damn") but infrequent.
- Mild, non-graphic violence or threat.
- Very mild references to romance or kissing.
- No explicit sexual content.
- No explicit self-harm or hard drugs.

PG-13:
- Moderate swearing, may include a small number of strong words.
- Non-graphic but clear violence or threats.
- Some sexual references or innuendo, but not explicit.
- Mentions of drugs or alcohol use.
- Non-graphic self-harm references.

R:
- Frequent strong profanity (e.g., repeated f-words).
- Graphic or intense violence or threats.
- Explicit sexual content or detailed sexual descriptions.
- Explicit drug use.
- Graphic self-harm/suicide content or detailed plans.

### Output format

You MUST respond with ONLY a single JSON object, no markdown, no backticks, no extra text.

Use this exact shape:

{
  "rating": "G" | "PG" | "PG-13" | "R",
  "reasons": [
    "short bullet-style reason 1",
    "short reason 2"
  ],
  "scores": {
    "violence": 0-3,
    "sexual_content": 0-3,
    "language": 0-3,
    "drugs": 0-3,
    "self_harm": 0-3
  }
}

Where scores mean:
- 0 = none
- 1 = mild
- 2 = moderate
- 3 = strong/explicit

Always choose the HIGHEST severity among categories when deciding the final rating.

Examples:

Content: "Let's watch a movie and kiss a bit."
Answer:
{"rating": "PG", "reasons": ["Mild romantic content"], "scores": {"violence":0,"sexual_content":1,"language":0,"drugs":0,"self_harm":0}}

Content: "I'm going to f***ing kill you tonight."
Answer:
{"rating": "R", "reasons": ["Strong profanity", "Explicit threat of violence"], "scores": {"violence":3,"sexual_content":0,"language":3,"drugs":0,"self_harm":0}}

Content: [TRANSCRIPT]
Answer:
"""


def transcribe_audio(hathora_client, audio_file_path, model="parakeet"):
    """
    Transcribe audio file using Hathora API
    
    Args:
        hathora_client: Initialized Hathora client
        audio_file_path: Path to audio file
        model: Model name for transcription (default: "parakeet")
        
    Returns:
        str: Transcribed text
    """
    try:
        stt_response = hathora_client.speech_to_text.convert(
            model,
            audio_file_path
        )
        return stt_response.text
        
    except AuthenticationError as e:
        raise
    except APIError as e:
        raise
    except HathoraError as e:
        raise
    except FileNotFoundError as e:
        raise


def classify_content(openai_client, content, max_retries=3):
    """
    Classify content with guardrails and error handling.
    
    Args:
        openai_client: Initialized OpenAI client
        content: The content to classify
        max_retries: Maximum number of retry attempts
        
    Returns:
        dict: Classification result with rating, reasons, and scores
    """
    valid_ratings = ["G", "PG", "PG-13", "R"]
    required_score_keys = ["violence", "sexual_content", "language", "drugs", "self_harm"]
    
    for attempt in range(max_retries):
        try:
            # Make API call
            response = openai_client.chat.completions.create(
                model="openai/gpt-oss-safeguard-20b",
                messages=[
                    {"role": "system", "content": POLICY},
                    {"role": "user", "content": content}
                ],
                extra_body={"reasoning": {"enabled": True}},
                timeout=30
            )
            
            raw_content = response.choices[0].message.content
            
            if not raw_content:
                raise ValueError("Empty response from API")
            
            # Strip markdown code blocks if present
            cleaned_content = re.sub(r'^```(?:json)?\s*|\s*```$', '', raw_content.strip(), flags=re.MULTILINE)
            cleaned_content = cleaned_content.strip()
            
            # Parse JSON
            result = json.loads(cleaned_content)
            
            # Validate structure
            if not isinstance(result, dict):
                raise ValueError("Response is not a JSON object")
            
            # Validate required fields
            if "rating" not in result:
                raise ValueError("Missing 'rating' field")
            if "reasons" not in result:
                raise ValueError("Missing 'reasons' field")
            if "scores" not in result:
                raise ValueError("Missing 'scores' field")
            
            # Validate rating value
            if result["rating"] not in valid_ratings:
                raise ValueError(f"Invalid rating: {result['rating']}. Must be one of {valid_ratings}")
            
            # Validate reasons
            if not isinstance(result["reasons"], list):
                raise ValueError("'reasons' must be a list")
            if len(result["reasons"]) == 0:
                raise ValueError("'reasons' cannot be empty")
            
            # Validate scores
            if not isinstance(result["scores"], dict):
                raise ValueError("'scores' must be an object")
            
            missing_keys = set(required_score_keys) - set(result["scores"].keys())
            if missing_keys:
                raise ValueError(f"Missing score keys: {missing_keys}")
            
            # Validate score values
            for key, value in result["scores"].items():
                if not isinstance(value, (int, float)):
                    raise ValueError(f"Score '{key}' must be a number, got {type(value)}")
                if not (0 <= value <= 3):
                    raise ValueError(f"Score '{key}' must be between 0 and 3, got {value}")
            
            # Success!
            return result
            
        except json.JSONDecodeError as e:
            if attempt == max_retries - 1:
                return create_fallback_response(content, error=str(e))
            continue
            
        except ValueError as e:
            if attempt == max_retries - 1:
                return create_fallback_response(content, error=str(e))
            continue
            
        except Exception as e:
            if attempt == max_retries - 1:
                return create_fallback_response(content, error=str(e))
            continue
    
    # Should never reach here, but just in case
    return create_fallback_response(content, error="Max retries exceeded")


def create_fallback_response(content, error=None):
    """
    Create a conservative fallback response when classification fails.
    
    Args:
        content: The original content
        error: Optional error message
        
    Returns:
        dict: Fallback classification (defaults to PG-13 for safety)
    """
    return {
        "rating": "PG-13",
        "reasons": [
            "Classification failed - conservative rating applied",
            f"Error: {error}" if error else "Unable to classify content"
        ],
        "scores": {
            "violence": 1,
            "sexual_content": 1,
            "language": 1,
            "drugs": 1,
            "self_harm": 1
        },
        "error": True
    }


def main():
    """Main function to transcribe and classify audio content"""
    # Audio file to process
    audio_file = "Recording (2).m4a"
    
    try:
        # Initialize clients
        hathora_client, openai_client = initialize_clients()
        
        # Step 1: Transcribe audio
        transcribed_text = transcribe_audio(hathora_client, audio_file)
        
        # Step 2: Classify content
        classification_result = classify_content(openai_client, transcribed_text)
        
        # Output only the final JSON
        print(json.dumps(classification_result, indent=2))
        
        return {
            "transcription": transcribed_text,
            "classification": classification_result
        }
        
    except Exception as e:
        return None


if __name__ == "__main__":
    main()
