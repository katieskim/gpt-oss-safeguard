import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "",
    baseURL: process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:3000",
      "X-Title": "Influencer Content Classifier",
    },
  });
}

const CLASSIFICATION_GUIDELINES = `
You are an expert content moderator using MPAA-style rating system for influencer content.

Rating Categories:
- I-G (General Audience): No profanity, no sexual content, no violence, family-friendly
- I-PG (Parental Guidance): Mild profanity, casual fashion, mild themes
- I-PG13 (Parents Strongly Cautioned): Profanity, suggestive content, swimwear, partying, innuendo
- I-R (Restricted): Explicit profanity, highly sexualized content, substance use, controversial
- I-NC17 (Adults Only): Nudity, explicit sexual content, OnlyFans, adult entertainment

Return JSON with rating, riskLevel, summary, factors (array), thinking (array), recommendation, confidence.
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { influencers } = body;

    if (!influencers || !Array.isArray(influencers)) {
      return NextResponse.json(
        { error: "Influencers array is required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Process each influencer
    const results = [];

    const openai = getOpenAIClient();
    
    for (const influencer of influencers) {
      const { handle, platform, description } = influencer;

      try {
        // Classification with GPT-4
        const completion = await openai.chat.completions.create({
          model: "openai/gpt-4-turbo",
          messages: [
            {
              role: "system",
              content: CLASSIFICATION_GUIDELINES,
            },
            {
              role: "user",
              content: `Classify: ${handle} on ${platform}\nDescription: ${description}`,
            },
          ],
          response_format: { type: "json_object" },
          temperature: 0.3,
        });

        const result = JSON.parse(
          completion.choices[0].message.content || "{}"
        );

        results.push({
          handle,
          platform,
          description,
          ...result,
        });
      } catch (error) {
        // If one fails, continue with others
        results.push({
          handle,
          platform,
          description,
          error: "Classification failed",
        });
      }
    }

    return NextResponse.json({
      results,
      total: influencers.length,
      processed: results.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Batch classification error:", error);
    return NextResponse.json(
      {
        error: "Failed to process batch classification",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

