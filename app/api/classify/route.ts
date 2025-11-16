import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Influencer Content Classifier",
  },
});

// Classification guidelines from content.md
const CLASSIFICATION_GUIDELINES = `
You are an expert content moderator using MPAA-style rating system for influencer content.

Rating Categories:
- I-G (General Audience): No profanity, no sexual content, no violence, family-friendly
- I-PG (Parental Guidance): Mild profanity, casual fashion, mild themes
- I-PG13 (Parents Strongly Cautioned): Profanity, suggestive content, swimwear, partying, innuendo
- I-R (Restricted): Explicit profanity, highly sexualized content, substance use, controversial
- I-NC17 (Adults Only): Nudity, explicit sexual content, OnlyFans, adult entertainment

Analyze the influencer description and return JSON with:
{
  "rating": "I-G" | "I-PG" | "I-PG13" | "I-R" | "I-NC17",
  "riskLevel": "Low" | "Medium" | "High" | "Critical",
  "summary": "Brief explanation of rating",
  "factors": ["factor1", "factor2", ...],
  "thinking": ["step1", "step2", ...],
  "recommendation": "Partnership recommendation",
  "confidence": 0.0-1.0
}

Be conservative: when uncertain, choose the more restrictive rating.
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, handle, platform } = body;

    if (!description || !description.trim()) {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    // Check API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Use GPT-4 for detailed classification via OpenRouter
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: CLASSIFICATION_GUIDELINES,
        },
        {
          role: "user",
          content: `Classify this influencer:
Handle: ${handle || "Unknown"}
Platform: ${platform || "Unknown"}
Description: ${description}

Provide detailed analysis with step-by-step thinking process. Include specific keywords or phrases that influenced your decision.`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    // Return classification result
    return NextResponse.json({
      ...result,
      model: "gpt-4-turbo",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Classification error:", error);

    // Handle specific OpenAI errors
    if (error?.status === 401) {
      return NextResponse.json(
        { error: "Invalid OpenAI API key" },
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
        error: "Failed to classify content",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

