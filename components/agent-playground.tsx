"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles } from "lucide-react";

interface ClassificationResult {
  rating: string;
  summary: string;
  factors: string[];
  rawOutput: string;
}

export function AgentPlayground() {
  const [profileDescription, setProfileDescription] = useState("");
  const [platform, setPlatform] = useState("");
  const [followerCount, setFollowerCount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  const getRatingColor = (rating: string) => {
    const colors: Record<string, string> = {
      "I-G": "bg-emerald-500 text-emerald-950",
      "I-PG": "bg-sky-500 text-sky-950",
      "I-PG13": "bg-amber-500 text-amber-950",
      "I-R": "bg-orange-500 text-orange-950",
      "I-NC17": "bg-red-700 text-red-50",
    };
    return colors[rating] || "bg-slate-500 text-slate-950";
  };

  const classifyInfluencer = async () => {
    if (!profileDescription.trim()) {
      return;
    }

    setLoading(true);
    setResult(null);

    // Simulate API call with mock classification logic
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock classification logic based on keywords
    const lowerDesc = profileDescription.toLowerCase();
    let rating = "I-G";
    let summary = "";
    let factors: string[] = [];

    if (
      lowerDesc.includes("explicit") ||
      lowerDesc.includes("nude") ||
      lowerDesc.includes("onlyfans") ||
      lowerDesc.includes("adult")
    ) {
      rating = "I-NC17";
      summary =
        "Content includes explicit adult material or adult subscription services. Not suitable for general partnerships.";
      factors = [
        "Explicit adult content or nudity detected",
        "Adult subscription service promotion",
        "Content created for adult arousal",
      ];
    } else if (
      lowerDesc.includes("provocative") ||
      lowerDesc.includes("explicit language") ||
      lowerDesc.includes("substance") ||
      lowerDesc.includes("controversy")
    ) {
      rating = "I-R";
      summary =
        "Content contains strong mature themes with high reputational risk. Not suitable for minors.";
      factors = [
        "Explicit or frequent profanity",
        "Highly sexualized or provocative content",
        "Strong controversial or divisive themes",
      ];
    } else if (
      lowerDesc.includes("swimwear") ||
      lowerDesc.includes("partying") ||
      lowerDesc.includes("nightlife") ||
      lowerDesc.includes("innuendo") ||
      lowerDesc.includes("suggestive")
    ) {
      rating = "I-PG13";
      summary =
        "Content includes moderately mature themes. Requires additional review for younger audiences.";
      factors = [
        "Suggestive poses or revealing fashion",
        "Mature humor and innuendo",
        "Partying and nightlife imagery",
      ];
    } else if (
      lowerDesc.includes("fashion") ||
      lowerDesc.includes("lifestyle") ||
      lowerDesc.includes("dating") ||
      lowerDesc.includes("mild")
    ) {
      rating = "I-PG";
      summary =
        "Content is mostly safe with mild mature elements. Suitable for most audiences.";
      factors = [
        "Mild profanity or mature references",
        "Casual fashion and lifestyle content",
        "Respectful discussion of relationships",
      ];
    } else {
      rating = "I-G";
      summary =
        "Content is universally appropriate for all audiences. No mature or controversial material detected.";
      factors = [
        "Family-friendly presentation",
        "Educational or positive content",
        "No profanity or mature themes",
      ];
    }

    const mockResult: ClassificationResult = {
      rating,
      summary,
      factors,
      rawOutput: JSON.stringify(
        {
          classification: rating,
          confidence: 0.92,
          analysis: {
            languageScore: 0.85,
            imageryScore: 0.88,
            themeScore: 0.95,
          },
          platform: platform || "Unknown",
          followerCount: followerCount || "Not specified",
          timestamp: new Date().toISOString(),
        },
        null,
        2
      ),
    };

    setResult(mockResult);
    setLoading(false);
  };

  return (
    <section id="agent-playground" className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 mx-auto">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-500">AI Classifier</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold">
              Classifying Agent Playground
            </h2>
            <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Test the AI classification agent with influencer profile descriptions. The
              agent will analyze the content and assign an appropriate rating based on the
              guidelines.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Input Panel */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">Input Influencer Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Profile Description *
                  </label>
                  <Textarea
                    placeholder="Describe the influencer's content, posting style, themes, imagery, language use, and typical posts. Include platform handles, content types, and any relevant context..."
                    className="min-h-[200px] bg-slate-800/50 border-slate-700"
                    value={profileDescription}
                    onChange={(e) => setProfileDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">
                      Platform
                    </label>
                    <Input
                      placeholder="Instagram, TikTok..."
                      className="bg-slate-800/50 border-slate-700"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">
                      Follower Count
                    </label>
                    <Input
                      placeholder="100K, 1M..."
                      className="bg-slate-800/50 border-slate-700"
                      value={followerCount}
                      onChange={(e) => setFollowerCount(e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  onClick={classifyInfluencer}
                  disabled={loading || !profileDescription.trim()}
                  className="w-full bg-slate-100 text-slate-900 hover:bg-slate-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Classifying...
                    </>
                  ) : (
                    "Classify Influencer"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Output Panel */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-lg">Classification Result</CardTitle>
              </CardHeader>
              <CardContent>
                {!result && !loading && (
                  <div className="flex items-center justify-center h-[300px] text-slate-500 text-sm">
                    Enter a profile description and click "Classify Influencer" to see
                    results
                  </div>
                )}

                {loading && (
                  <div className="flex flex-col items-center justify-center h-[300px] gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                    <p className="text-sm text-slate-400">
                      Analyzing content and applying guidelines...
                    </p>
                  </div>
                )}

                {result && !loading && (
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Rating</p>
                      <Badge className={`${getRatingColor(result.rating)} text-lg px-4 py-1`}>
                        {result.rating}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-2">Summary</p>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {result.summary}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-2">Key Factors</p>
                      <ul className="space-y-2">
                        {result.factors.map((factor, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-slate-400"
                          >
                            <span className="text-slate-600 mt-1">•</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-slate-800">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowRaw(!showRaw)}
                        className="text-xs"
                      >
                        {showRaw ? "Hide" : "Show"} Raw Agent Output
                      </Button>
                      {showRaw && (
                        <pre className="mt-3 p-3 bg-slate-950 rounded-md text-xs text-slate-400 overflow-x-auto">
                          {result.rawOutput}
                        </pre>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
