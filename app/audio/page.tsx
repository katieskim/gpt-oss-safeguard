"use client";

import { useState } from "react";
import { AudioUploadCard } from "@/components/ui/audio-upload-card";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Loader2,
  FileAudio,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

interface ClassificationResult {
  rating: string;
  riskLevel: string;
  summary: string;
  factors: string[];
  recommendation: string;
  transcription?: string;
}

export default function AudioRaterPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);

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

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("audio", file);

      const response = await fetch("/api/classify-audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Classification failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Audio classification error:", error);
      setResult({
        rating: "I-PG",
        riskLevel: "Low",
        summary: "Unable to classify audio. Please check your configuration.",
        factors: ["API error occurred", "Please verify API keys are set"],
        recommendation: "Please check API configuration",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
            <FileAudio className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-500">
              AI-Powered Audio Analysis
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Audio Content Rating Agent
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Upload audio content for automatic transcription and MPAA-style
            content classification
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <AudioUploadCard
              title="Upload Audio File"
              description="Support for MP3, WAV, M4A, and other audio formats"
              onFileUpload={handleFileUpload}
            />

            {uploadedFile && (
              <Card className="bg-slate-900 border-slate-800 p-4">
                <div className="flex items-center gap-3">
                  <FileAudio className="w-5 h-5 text-purple-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileAudio className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-medium text-slate-300">
                Classification Result
              </h3>
            </div>

            {!result && !loading && (
              <div className="flex flex-col items-center justify-center h-[400px] text-center">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                  <FileAudio className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-sm text-slate-500">
                  Upload an audio file to begin classification
                </p>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center h-[400px]">
                <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
                <p className="text-sm text-slate-400">
                  Transcribing and analyzing audio...
                </p>
                <p className="text-xs text-slate-600 mt-2">
                  This may take a moment
                </p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Content Rating
                    </p>
                    <Badge
                      className={`${getRatingColor(result.rating)} text-xl px-4 py-1 font-bold`}
                    >
                      {result.rating}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 mb-1">Risk Level</p>
                    <div
                      className={cn(
                        "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
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

                {result.transcription && (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">
                      Transcription
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg">
                      {result.transcription}
                    </p>
                  </div>
                )}

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
                        <span className="text-purple-500 mt-1">•</span>
                        <span>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-slate-800 pt-4">
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

