"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AIVideoInput } from "@/components/ui/ai-video-input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Loader2,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Brain,
  Video,
  Mic,
} from "lucide-react";

interface ClassificationResult {
  rating: string;
  riskLevel: string;
  summary?: string;
  reasons?: string[];
  recommendation?: string;
  transcription?: string;
  scores?: {
    violence: number;
    sexual_content: number;
    language: number;
    drugs: number;
    self_harm: number;
  };
}

interface ThinkingStep {
  text: string;
  completed: boolean;
}

export function VideoClassifier() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const getRatingColor = (rating: string) => {
    const colors: Record<string, string> = {
      G: "bg-emerald-500 text-emerald-950",
      PG: "bg-sky-500 text-sky-950",
      "PG-13": "bg-amber-500 text-amber-950",
      R: "bg-red-600 text-red-50",
    };
    return colors[rating] || "bg-slate-500 text-slate-950";
  };

  const getRiskIcon = (riskLevel: string) => {
    if (riskLevel === "Low") return <ShieldCheck className="w-4 h-4" />;
    if (riskLevel === "Medium") return <AlertTriangle className="w-4 h-4" />;
    return <ShieldAlert className="w-4 h-4" />;
  };

  const simulateThinking = async () => {
    const steps = [
      "Processing video recording...",
      "Extracting audio track...",
      "Transcribing speech to text...",
      "Analyzing content for violence...",
      "Checking for inappropriate language...",
      "Evaluating sexual content...",
      "Assessing drug references...",
      "Calculating final rating...",
    ];

    setThinkingSteps(steps.map((text) => ({ text, completed: false })));

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 350 + Math.random() * 250));
      setThinkingSteps((prev) =>
        prev.map((step, idx) =>
          idx === i ? { ...step, completed: true } : step
        )
      );
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob, duration: number) => {
    setRecordingDuration(duration);
    setLoading(true);
    setResult(null);
    
    // Start thinking animation
    simulateThinking();

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "video-audio.webm");

      const response = await fetch("/api/classify-audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Classification failed");
      }

      const data = await response.json();
      
      // Wait for thinking animation to complete
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setResult(data);
    } catch (error) {
      console.error("Classification error:", error);
      setResult({
        rating: "PG",
        riskLevel: "Low",
        summary: "Unable to classify video audio. Please try again.",
        reasons: ["API error occurred", "Please check your camera/microphone access"],
        recommendation: "Please try recording again",
      });
    }

    setLoading(false);
    setThinkingSteps([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-300 font-medium">
              AI-Powered Video Audio Analysis
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Video Content Classifier
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Record video with your webcam while we analyze the audio content for
            classification. See yourself while speaking and get instant AI-powered
            content analysis.
          </p>
          <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              <span>Video Preview</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              <span>Audio Analysis</span>
            </div>
          </div>
        </motion.div>

        {/* Video Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-slate-900 border-slate-800 p-8">
            <AIVideoInput
              onRecordingComplete={handleRecordingComplete}
              disabled={loading}
              visualizerBars={60}
            />

            {/* Thinking Process */}
            <AnimatePresence>
              {loading && thinkingSteps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8 space-y-3"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-5 h-5 text-blue-400 animate-pulse" />
                    <p className="text-sm font-medium text-blue-300">
                      AI Thinking Process
                    </p>
                  </div>
                  {thinkingSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      {step.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Loader2 className="w-4 h-4 text-blue-400 animate-spin flex-shrink-0" />
                      )}
                      <span
                        className={cn(
                          "transition-colors",
                          step.completed
                            ? "text-slate-400"
                            : "text-blue-300 font-medium"
                        )}
                      >
                        {step.text}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
              {result && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 space-y-6"
                >
                  {/* Recording Info */}
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Video className="w-4 h-4" />
                    <span>
                      Recording duration: {Math.floor(recordingDuration / 60)}:
                      {(recordingDuration % 60).toString().padStart(2, "0")}
                    </span>
                    <span className="mx-2">•</span>
                    <Mic className="w-4 h-4" />
                    <span>Audio analyzed</span>
                  </div>

                  {/* Transcription */}
                  {result.transcription && (
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                      <p className="text-xs text-slate-500 mb-2">
                        Transcription
                      </p>
                      <p className="text-sm text-slate-300 italic">
                        "{result.transcription}"
                      </p>
                    </div>
                  )}

                  {/* Rating Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge
                        className={cn(
                          "text-lg px-4 py-2 font-bold",
                          getRatingColor(result.rating)
                        )}
                      >
                        {result.rating}
                      </Badge>
                      <div className="flex items-center gap-2">
                        {getRiskIcon(result.riskLevel)}
                        <span className="text-sm text-slate-400">
                          {result.riskLevel} Risk
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  {result.summary && (
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Summary</p>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {result.summary}
                      </p>
                    </div>
                  )}

                  {/* Reasons */}
                  {result.reasons && result.reasons.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-3">Reasons</p>
                      <ul className="space-y-2">
                        {result.reasons.map((reason, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-2 text-sm text-slate-400"
                          >
                            <span className="text-blue-500 mt-1 flex-shrink-0">
                              •
                            </span>
                            <span>{reason}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Scores */}
                  {result.scores && (
                    <div>
                      <p className="text-xs text-slate-500 mb-3">
                        Content Scores
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(result.scores).map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700"
                          >
                            <span className="text-xs text-slate-400 capitalize">
                              {key.replace("_", " ")}
                            </span>
                            <span
                              className={cn(
                                "text-sm font-semibold",
                                value === 0 && "text-emerald-400",
                                value === 1 && "text-sky-400",
                                value === 2 && "text-amber-400",
                                value === 3 && "text-red-400"
                              )}
                            >
                              {value}/3
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendation */}
                  {result.recommendation && (
                    <div className="border-t border-slate-800 pt-6">
                      <p className="text-xs text-slate-500 mb-2">
                        Partnership Recommendation
                      </p>
                      <p
                        className={cn(
                          "text-sm font-medium leading-relaxed",
                          result.riskLevel === "Low" && "text-emerald-400",
                          result.riskLevel === "Medium" && "text-amber-400",
                          (result.riskLevel === "High" ||
                            result.riskLevel === "Critical") &&
                            "text-red-400"
                        )}
                      >
                        {result.recommendation}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

