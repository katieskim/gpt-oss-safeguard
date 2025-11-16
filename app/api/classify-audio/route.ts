import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// OpenRouter client for GPT-4 classification
const openaiGPT = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Influencer Content Classifier - Audio",
  },
});

const CLASSIFICATION_GUIDELINES = `
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
`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    if (!process.env.HATHORA_API_KEY) {
      return NextResponse.json(
        { error: "Hathora API key not configured" },
        { status: 500 }
      );
    }

    // Step 1: Transcribe audio using Hathora's speech-to-text API
    let transcription = "";
    
    try {
      // Prepare form data for Hathora API
      const hathoraFormData = new FormData();
      hathoraFormData.append("model", "parakeet");
      hathoraFormData.append("file", audioFile);

      // Call Hathora speech-to-text API
      const hathoraResponse = await fetch("https://api.hathora.dev/speech-to-text/v1/convert", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HATHORA_API_KEY}`,
        },
        body: hathoraFormData,
      });

      if (!hathoraResponse.ok) {
        const errorText = await hathoraResponse.text();
        console.error("Hathora API error:", errorText);
        throw new Error(`Hathora API returned ${hathoraResponse.status}: ${errorText}`);
      }

      const hathoraData = await hathoraResponse.json();
      transcription = hathoraData.text || hathoraData.transcription || "";

      if (!transcription) {
        console.error("No transcription in Hathora response:", hathoraData);
        throw new Error("No transcription text returned from Hathora");
      }
    } catch (hathoraError: any) {
      console.error("Hathora transcription error:", hathoraError);
      return NextResponse.json({
        error: "Audio transcription failed",
        details: hathoraError.message || "Hathora speech-to-text API error",
        rating: "I-PG",
        riskLevel: "Low",
        summary: "Unable to transcribe audio. Please check Hathora API configuration.",
        factors: ["Transcription service error", "Please verify HATHORA_API_KEY is set correctly"],
        recommendation: "Check Hathora API key in .env.local",
        transcription: "Error: No transcription available",
      }, { status: 500 });
    }

    if (!transcription || transcription.trim().length === 0) {
      return NextResponse.json({
        rating: "G",
        reasons: ["No speech detected in audio file"],
        scores: {
          violence: 0,
          sexual_content: 0,
          language: 0,
          drugs: 0,
          self_harm: 0,
        },
        transcription: "",
        riskLevel: "Low",
      });
    }

    // Step 2: Classify the transcribed content using gpt-oss-safeguard-20b
    const completion = await openaiGPT.chat.completions.create({
      model: "openai/gpt-oss-safeguard-20b",
      messages: [
        {
          role: "system",
          content: CLASSIFICATION_GUIDELINES,
        },
        {
          role: "user",
          content: transcription,
        },
      ],
      // @ts-ignore - OpenRouter supports reasoning in extra_body
      extra_body: {
        reasoning: { enabled: true }
      },
      temperature: 0.3,
    });

    const rawContent = completion.choices[0].message.content || "{}";
    
    // Strip markdown code blocks if present
    const cleanedContent = rawContent
      .replace(/^```(?:json)?\s*|\s*```$/gm, "")
      .trim();

    let result;
    try {
      result = JSON.parse(cleanedContent);
    } catch (e) {
      // Fallback if parsing fails
      result = {
        rating: "PG-13",
        reasons: ["Classification failed - conservative rating applied"],
        scores: {
          violence: 1,
          sexual_content: 1,
          language: 1,
          drugs: 1,
          self_harm: 1,
        },
        error: true,
      };
    }

    // Map rating to risk level
    const riskLevelMap: { [key: string]: string } = {
      "G": "Low",
      "PG": "Low",
      "PG-13": "Medium",
      "R": "High",
    };

    // Return classification result with transcription
    return NextResponse.json({
      ...result,
      transcription,
      riskLevel: riskLevelMap[result.rating] || "Medium",
      model: "hathora-parakeet + gpt-oss-safeguard-20b",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Audio classification error:", error);

    // Handle specific errors
    if (error?.status === 401) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to classify audio",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

