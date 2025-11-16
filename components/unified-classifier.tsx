"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AudioUploadCard } from "@/components/ui/audio-upload-card";
import { cn } from "@/lib/utils";
import {
  Loader2,
  FileText,
  Mic,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface ClassificationResult {
  rating: string;
  riskLevel: string;
  summary: string;
  factors: string[];
  recommendation: string;
  transcription?: string;
  confidence?: number;
}

export function UnifiedClassifier() {
  const [textValue, setTextValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [activeTab, setActiveTab] = useState("text");

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

  const getRiskIcon = (riskLevel: string) => {
    if (riskLevel === "Low") return <ShieldCheck className="w-4 h-4" />;
    if (riskLevel === "Medium") return <AlertTriangle className="w-4 h-4" />;
    return <ShieldAlert className="w-4 h-4" />;
  };

  const handleTextClassify = async () => {
    if (!textValue.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: textValue,
          handle: "@influencer",
          platform: "Social Media",
        }),
      });

      if (!response.ok) throw new Error("Classification failed");

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Classification error:", error);
      setResult({
        rating: "I-PG",
        riskLevel: "Low",
        summary: "Unable to classify content. Please check your API configuration.",
        factors: ["API error occurred", "Please verify OpenAI API key is set"],
        recommendation: "Please configure OpenAI API key in .env.local file",
      });
    }

    setLoading(false);
  };

  const handleAudioUpload = async (file: File) => {
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("audio", file);

      const response = await fetch("/api/classify-audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Classification failed");

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Audio classification error:", error);
      setResult({
        rating: "I-PG",
        riskLevel: "Low",
        summary: "Unable to classify audio. Please check your configuration.",
        factors: ["API error occurred", "Please verify API keys are set"],
        recommendation: "Check API configuration",
      });
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (textValue.trim() && !loading) {
        handleTextClassify();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-400">
              AI-Powered Content Analysis
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Influencer Content Rating Agent
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Analyze influencer content through text description or audio upload.
            Get instant MPAA-style ratings with detailed risk assessment.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
                  <TabsTrigger
                    value="text"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Text Input
                  </TabsTrigger>
                  <TabsTrigger
                    value="audio"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Audio Upload
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Describe the influencer's content
                    </label>
                    <Textarea
                      value={textValue}
                      onChange={(e) => setTextValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Example: Fashion influencer posting swimwear content, travel photos, and lifestyle vlogs. Occasional mild profanity in captions. 250K Instagram followers..."
                      className="min-h-[200px] bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  <button
                    onClick={handleTextClassify}
                    disabled={loading || !textValue.trim()}
                    className={cn(
                      "w-full px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
                      textValue.trim() && !loading
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    )}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Classify Content
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-slate-500 text-center">
                    Press Enter to submit • Shift+Enter for new line
                  </p>
                </TabsContent>

                <TabsContent value="audio" className="mt-6">
                  <div className="space-y-4">
                    <AudioUploadCard
                      title="Upload Audio File"
                      description="Drop in audio recordings for automatic transcription and content analysis"
                      onFileUpload={handleAudioUpload}
                    />
                    <p className="text-xs text-slate-500 text-center">
                      Supports MP3, WAV, M4A, and other audio formats
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Info Card */}
            <Card className="bg-gradient-to-br from-purple-900/20 to-slate-900/50 border-purple-500/20 p-6">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">
                    How it works
                  </h3>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li>• AI analyzes content using MPAA-style guidelines</li>
                    <li>• Audio files are transcribed then classified</li>
                    <li>• Results include rating, risk level, and recommendations</li>
                    <li>• Classifications are instant and exportable</li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-slate-900/50 border-slate-800 p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                <h3 className="text-sm font-medium text-slate-300">
                  Classification Result
                </h3>
              </div>

              <AnimatePresence mode="wait">
                {!result && !loading && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-[500px] text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                      {activeTab === "text" ? (
                        <FileText className="w-10 h-10 text-slate-600" />
                      ) : (
                        <Mic className="w-10 h-10 text-slate-600" />
                      )}
                    </div>
                    <p className="text-sm text-slate-500">
                      {activeTab === "text"
                        ? "Enter content description to begin analysis"
                        : "Upload an audio file to begin analysis"}
                    </p>
                  </motion.div>
                )}

                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center h-[500px]"
                  >
                    <Loader2 className="w-16 h-16 animate-spin text-purple-500 mb-4" />
                    <p className="text-sm text-slate-400">
                      {activeTab === "audio"
                        ? "Transcribing and analyzing audio..."
                        : "Analyzing content..."}
                    </p>
                    <p className="text-xs text-slate-600 mt-2">
                      This may take a moment
                    </p>
                  </motion.div>
                )}

                {result && !loading && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    {/* Rating & Risk */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 mb-2">
                          Content Rating
                        </p>
                        <Badge
                          className={`${getRatingColor(
                            result.rating
                          )} text-2xl px-4 py-1 font-bold`}
                        >
                          {result.rating}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500 mb-2">
                          Risk Level
                        </p>
                        <div
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
                            result.riskLevel === "Low" &&
                              "bg-emerald-500/10 text-emerald-500",
                            result.riskLevel === "Medium" &&
                              "bg-amber-500/10 text-amber-500",
                            result.riskLevel === "High" &&
                              "bg-orange-500/10 text-orange-500",
                            result.riskLevel === "Critical" &&
                              "bg-red-500/10 text-red-500"
                          )}
                        >
                          {getRiskIcon(result.riskLevel)}
                          {result.riskLevel}
                        </div>
                      </div>
                    </div>

                    {/* Transcription (if audio) */}
                    {result.transcription && (
                      <div>
                        <p className="text-xs text-slate-500 mb-2">
                          Transcription
                        </p>
                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {result.transcription}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    <div>
                      <p className="text-xs text-slate-500 mb-2">Summary</p>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {result.summary}
                      </p>
                    </div>

                    {/* Key Factors */}
                    <div>
                      <p className="text-xs text-slate-500 mb-3">
                        Key Factors
                      </p>
                      <ul className="space-y-2">
                        {result.factors.map((factor, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-2 text-sm text-slate-400"
                          >
                            <span className="text-purple-500 mt-1 flex-shrink-0">
                              •
                            </span>
                            <span>{factor}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendation */}
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

                    {/* Confidence (if available) */}
                    {result.confidence && (
                      <div className="text-xs text-slate-600">
                        Confidence: {(result.confidence * 100).toFixed(0)}%
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

