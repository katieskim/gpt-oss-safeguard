"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Sparkles, ArrowRight, Mic } from "lucide-react";

export function HeroClassifier() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-500">
                Content Safety System
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
              Influencer Content Classifier
            </h1>

            <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
              A comprehensive MPAA-style content classification system for evaluating
              influencers. Standardize risk assessment and ensure brand safety across
              all social media partnerships.
            </p>

            <div className="flex flex-col gap-4 pt-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/chat">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 group"
                  >
                    <Sparkles className="h-4 w-4" />
                    Try AI Rating Agent
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/batch">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-slate-100 text-slate-900 hover:bg-slate-200 flex items-center gap-2"
                  >
                    Batch Upload
                  </Button>
                </Link>
                <Link href="/audio">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto flex items-center gap-2"
                  >
                    Audio Rater
                  </Button>
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/voice">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2"
                  >
                    <Mic className="h-4 w-4" />
                    Voice Recording
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection("agent-playground")}
                  className="w-full sm:w-auto"
                >
                  View Demo
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection("rating-guidelines")}
                  className="w-full sm:w-auto"
                >
                  Rating Guidelines
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Sample Card */}
          <div>
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">@fitness_lifestyle_pro</CardTitle>
                  <Badge className="bg-amber-500 text-amber-950 hover:bg-amber-500/90">
                    I-PG13
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-slate-400 mb-2">Classification Summary:</p>
                  <p className="text-sm leading-relaxed text-slate-300">
                    Content includes moderately mature themes with suggestive fitness
                    poses, swimwear modeling, and partying imagery. Frequent use of
                    innuendo in captions. Appropriate for adult audiences but requires
                    additional review for brand partnerships.
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Key Factors:</p>
                  <ul className="text-xs text-slate-400 mt-1 space-y-1 list-disc list-inside">
                    <li>Suggestive poses and revealing clothing</li>
                    <li>Mature humor and flirtatious captions</li>
                    <li>Nightlife and social drinking content</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
