import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Influencer Content Classifier - Audio",
  },
});

const CLASSIFICATION_GUIDELINES = `
You are an expert content moderator analyzing audio transcriptions using MPAA-style rating system.

Rating Categories:
- I-G (General Audience): No profanity, no sexual content, no violence, family-friendly
- I-PG (Parental Guidance): Mild profanity, casual themes
- I-PG13 (Parents Strongly Cautioned): Profanity, suggestive content, mature themes
- I-R (Restricted): Explicit profanity, highly sexual or violent content, substance references
- I-NC17 (Adults Only): Extreme explicit content, graphic sexual or violent language

Analyze the transcription and return JSON with:
{
  "rating": "I-G" | "I-PG" | "I-PG13" | "I-R" | "I-NC17",
  "riskLevel": "Low" | "Medium" | "High" | "Critical",
  "summary": "Brief explanation of rating",
  "factors": ["factor1", "factor2", ...],
  "recommendation": "Partnership recommendation",
  "confidence": 0.0-1.0
}

Be conservative: when uncertain, choose the more restrictive rating.
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

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Step 1: Transcribe audio using Whisper API
    const transcriptionResponse = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });

    const transcription = transcriptionResponse.text;

    if (!transcription || transcription.trim().length === 0) {
      return NextResponse.json({
        rating: "I-G",
        riskLevel: "Low",
        summary: "No speech detected in audio file.",
        factors: ["No transcribable content found"],
        recommendation: "Unable to classify - no content detected",
        transcription: "",
        confidence: 0.0,
      });
    }

    // Step 2: Classify the transcribed content
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: CLASSIFICATION_GUIDELINES,
        },
        {
          role: "user",
          content: `Classify this audio transcription:\n\n"${transcription}"\n\nProvide detailed analysis based on language, themes, and content maturity.`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    // Return classification result with transcription
    return NextResponse.json({
      ...result,
      transcription,
      model: "whisper-1 + gpt-4-turbo",
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

