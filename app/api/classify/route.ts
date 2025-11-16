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

// Classification guidelines for influencer content
const CLASSIFICATION_GUIDELINES = `
You are a content classifier that assigns movie-style ratings to influencer content.

Your job: read the description of an influencer's content and rate it as one of:
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
- Family-friendly, educational content.

PG:
- Very mild language ("crap", "damn") but infrequent.
- Mild, non-graphic violence or threat.
- Very mild references to romance or kissing.
- Casual fashion, lifestyle content.
- No explicit sexual content.
- No explicit self-harm or hard drugs.

PG-13:
- Moderate swearing, may include a small number of strong words.
- Non-graphic but clear violence or threats.
- Some sexual references, innuendo, or suggestive poses.
- Swimwear modeling, party content.
- Mentions of drugs or alcohol use.
- Non-graphic self-harm references.

R:
- Frequent strong profanity (e.g., repeated f-words).
- Graphic or intense violence or threats.
- Explicit sexual content, nudity, or detailed sexual descriptions.
- Adult entertainment, OnlyFans content.
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
  },
  "recommendation": "Brief partnership recommendation"
}

Where scores mean:
- 0 = none
- 1 = mild
- 2 = moderate
- 3 = strong/explicit

Always choose the HIGHEST severity among categories when deciding the final rating.
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

    // Use gpt-oss-safeguard-20b for content classification via OpenRouter
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-safeguard-20b",
      messages: [
        {
          role: "system",
          content: CLASSIFICATION_GUIDELINES,
        },
        {
          role: "user",
          content: `Influencer: ${handle || "Unknown"} (${platform || "Unknown"})
Content Description: ${description}`,
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
        recommendation: "Unable to classify - manual review recommended",
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

    // Create thinking process from scores
    const thinking = [
      `Analyzing influencer: ${handle || "Unknown"} on ${platform || "Unknown"}`,
      `Content rating: ${result.rating}`,
      ...result.reasons || [],
      `Risk level: ${riskLevelMap[result.rating] || "Medium"}`,
    ];

    // Return classification result
    return NextResponse.json({
      ...result,
      riskLevel: riskLevelMap[result.rating] || "Medium",
      thinking,
      factors: result.reasons || [],
      summary: result.reasons?.[0] || "Content classified",
      model: "gpt-oss-safeguard-20b",
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

