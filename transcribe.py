from openai import OpenAI
import json


# ----------------------------------------
# 1. Connect to your local Ollama server
# ----------------------------------------
# base_url = ollama's OpenAI-compatible API
client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",   # not used, but required by the client
)


# ----------------------------------------
# 2. Define a simple safety policy
# ----------------------------------------
RATING_POLICY = """
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

def rate_transcript(transcript: str) -> dict:
    completion = client.chat.completions.create(
        model="gpt-oss-safeguard:20b",
        messages=[
            {"role": "system", "content": RATING_POLICY},
            {"role": "user", "content": transcript},
        ],
        stream=False,
    )

    raw = completion.choices[0].message.content.strip()

    try:
        verdict = json.loads(raw)
    except json.JSONDecodeError:
        print("Model returned invalid JSON:")
        print(raw)
        raise

    return verdict


if __name__ == "__main__":
    sample_transcript = """
    Dude what the FUCK was that, that game was insane.
    I'm gonna kill you next round, I swear, you camped my spawn the entire time.
    Let's grab some beers after this.
    """

    result = rate_transcript(sample_transcript)
    print(json.dumps(result, indent=2))
    print("Final rating:", result["rating"])