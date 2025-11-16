"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExampleCase {
  handle: string;
  rating: string;
  color: string;
  contentStyle: string;
  reasoning: string;
  detailedAnalysis: string;
}

export function ExampleUseCases() {
  const [expandedCase, setExpandedCase] = useState<number | null>(null);

  const examples: ExampleCase[] = [
    {
      handle: "@healthy_chef_mom",
      rating: "I-G",
      color: "bg-emerald-500 text-emerald-950",
      contentStyle: "Family cooking tutorials and healthy meal prep",
      reasoning:
        "Content is universally appropriate with educational focus on nutrition and family wellness. No mature themes or controversial content.",
      detailedAnalysis:
        "All posts feature family-friendly cooking demonstrations, nutritional education, and positive messaging. Language is clean and encouraging. Visual content shows meal preparation and finished dishes without any mature elements. Engagement with followers is supportive and educational.",
    },
    {
      handle: "@travel_lifestyle_blogger",
      rating: "I-PG",
      color: "bg-sky-500 text-sky-950",
      contentStyle: "Travel vlogs with casual lifestyle content",
      reasoning:
        "Mostly safe content with occasional references to nightlife and social drinking. Mild casual language used in some posts.",
      detailedAnalysis:
        "Content primarily focuses on travel destinations, cultural experiences, and lifestyle tips. Occasional posts show evening dining with wine or cocktails. Language includes mild expressions but nothing explicit. Fashion choices are casual and appropriate, though some form-fitting clothing appears in beach/pool settings.",
    },
    {
      handle: "@fitness_model_jay",
      rating: "I-PG13",
      color: "bg-amber-500 text-amber-950",
      contentStyle: "Fitness modeling with physique emphasis and party content",
      reasoning:
        "Contains suggestive fitness poses, shirtless content, swimwear modeling, and regular nightlife/partying imagery. Captions often include innuendo.",
      detailedAnalysis:
        "Profile heavily features aestheticized physique content including shirtless gym photos and swimwear shots. Regular posts from nightclubs and pool parties showing social drinking. Captions frequently use double meanings and flirtatious language. While not explicit, the content is clearly targeted at adult audiences and emphasizes physical attractiveness.",
    },
    {
      handle: "@comedy_uncensored",
      rating: "I-R",
      color: "bg-orange-500 text-orange-950",
      contentStyle: "Adult comedy with explicit language and controversial topics",
      reasoning:
        "Frequent explicit profanity, sexual humor, and controversial political commentary. Content designed to provoke and shock.",
      detailedAnalysis:
        "Content consists of stand-up clips and skits featuring explicit language throughout. Topics frequently include sexual situations, drug references, and divisive political opinions. Humor style is intentionally provocative and boundary-pushing. Comments section often contains heated debates. Not suitable for minors or risk-averse brand partnerships.",
    },
    {
      handle: "@glamour_model_exclusive",
      rating: "I-NC17",
      color: "bg-red-700 text-red-50",
      contentStyle: "Adult modeling with subscription service promotion",
      reasoning:
        "Profile promotes adult subscription service with explicit content. Posts feature highly sexualized poses and partial nudity.",
      detailedAnalysis:
        "Bio contains link to adult subscription platform. Public posts show suggestive poses in lingerie with strategic coverage. Captions explicitly reference 'exclusive content' available through paid subscription. Content is clearly intended for adult audiences and designed to drive traffic to explicit material. Not appropriate for any general market partnership.",
    },
  ];

  const toggleExpanded = (index: number) => {
    setExpandedCase(expandedCase === index ? null : index);
  };

  return (
    <section className="py-16 bg-slate-950/50 border-y border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold">Example Use Cases</h2>
            <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Real-world examples demonstrating how the classification system is applied.
              These cases help establish internal alignment on edge cases and rating
              decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {examples.map((example, index) => (
              <Card
                key={index}
                className="bg-slate-900/50 border-slate-800 hover:bg-slate-900/70 transition-all"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-lg">{example.handle}</CardTitle>
                    <Badge className={`${example.color} shrink-0`}>
                      {example.rating}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 mt-2">{example.contentStyle}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Classification Reasoning</p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {example.reasoning}
                    </p>
                  </div>

                  {expandedCase === index && (
                    <div className="pt-4 border-t border-slate-800">
                      <p className="text-xs text-slate-500 mb-2">Detailed Analysis</p>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {example.detailedAnalysis}
                      </p>
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(index)}
                    className="w-full text-xs"
                  >
                    {expandedCase === index ? (
                      <>
                        <ChevronUp className="h-3 w-3 mr-1" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3 mr-1" />
                        View Detailed Analysis
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
