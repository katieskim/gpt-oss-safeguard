"use client";

import { useState } from "react";
import { FileUpload, TemplateDownload } from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Brain,
  AlertTriangle,
  ShieldCheck,
  Download,
} from "lucide-react";

interface Step {
  id: number;
  name: string;
  status: "complete" | "current" | "upcoming";
}

interface InfluencerRecord {
  handle: string;
  platform: string;
  description: string;
  rating?: string;
  riskLevel?: string;
  thinking?: string[];
  recommendation?: string;
}

export function BatchClassifier() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<InfluencerRecord[]>([]);
  const [showThinking, setShowThinking] = useState<Record<number, boolean>>({});
  const [expandedHelp, setExpandedHelp] = useState(false);

  const steps: Step[] = [
    {
      id: 1,
      name: "Informations",
      status: currentStep > 1 ? "complete" : currentStep === 1 ? "current" : "upcoming",
    },
    {
      id: 2,
      name: "Upload file",
      status: currentStep > 2 ? "complete" : currentStep === 2 ? "current" : "upcoming",
    },
    {
      id: 3,
      name: "Summary",
      status: currentStep === 3 ? "current" : "upcoming",
    },
  ];

  const handleDownloadTemplate = () => {
    // Create CSV template
    const csvContent = `Handle,Platform,Description
@fitness_pro,Instagram,Fitness content with gym workouts and protein shakes
@lifestyle_vlogger,TikTok,Fashion hauls and cafe visits with occasional wine
@party_promoter,Instagram,Nightclub events with cocktails and suggestive poses
@family_cooking,YouTube,Cooking tutorials and kid-friendly recipes
@model_18plus,Instagram,OnlyFans promotion with lingerie content`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "influencer_classification_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
  };

  const handleClearFile = () => {
    setUploadedFile(null);
  };

  const parseCSV = async (file: File): Promise<InfluencerRecord[]> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split("\n").filter((line) => line.trim());
        const headers = lines[0].split(",").map((h) => h.trim());

        const records: InfluencerRecord[] = lines.slice(1).map((line) => {
          const values = line.split(",").map((v) => v.trim());
          return {
            handle: values[0] || "",
            platform: values[1] || "",
            description: values[2] || "",
          };
        });

        resolve(records);
      };
      reader.readAsText(file);
    });
  };

  const classifyInfluencer = async (record: InfluencerRecord): Promise<InfluencerRecord> => {
    try {
      const response = await fetch("/api/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: record.description,
          handle: record.handle,
          platform: record.platform,
        }),
      });

      if (!response.ok) {
        throw new Error("Classification failed");
      }

      const data = await response.json();

      return {
        ...record,
        rating: data.rating,
        riskLevel: data.riskLevel,
        thinking: data.thinking || [
          `Analyzing influencer: ${record.handle} on ${record.platform}`,
          `Examined content description`,
          `Assigned rating: ${data.rating}`,
          `Risk level: ${data.riskLevel}`,
        ],
        recommendation: data.recommendation,
      };
    } catch (error) {
      // Fallback to basic classification on error
      return {
        ...record,
        rating: "I-PG",
        riskLevel: "Low",
        thinking: [
          "⚠️ API Error: Using fallback classification",
          "Please verify OpenAI API key configuration",
        ],
        recommendation: "Unable to classify. Please check API configuration.",
      };
    }
  };

  const handleProcessFile = async () => {
    if (!uploadedFile) return;

    setProcessing(true);
    setCurrentStep(3);

    // Parse CSV
    const records = await parseCSV(uploadedFile);

    // Simulate processing with delay to show thinking
    const processedResults: InfluencerRecord[] = [];

    for (let i = 0; i < records.length; i++) {
      const classified = await classifyInfluencer(records[i]);
      processedResults.push(classified);
      setResults([...processedResults]);
      // Small delay to show progress
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setProcessing(false);
  };

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
    return <AlertTriangle className="w-4 h-4" />;
  };

  const handleExportResults = () => {
    const csvContent = `Handle,Platform,Rating,Risk Level,Recommendation\n${results
      .map(
        (r) =>
          `${r.handle},${r.platform},${r.rating},${r.riskLevel},"${r.recommendation}"`
      )
      .join("\n")}`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `classification_results_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
                if (currentStep === 3) setResults([]);
              }
            }}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          {/* Step Progress */}
          <div className="flex items-center gap-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium transition-colors",
                    step.status === "complete" &&
                      "bg-slate-100 text-slate-900",
                    step.status === "current" &&
                      "bg-slate-900 border-2 border-slate-100 text-slate-100",
                    step.status === "upcoming" &&
                      "bg-slate-800 text-slate-500"
                  )}
                >
                  {step.status === "complete" ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    step.status === "upcoming"
                      ? "text-slate-500"
                      : "text-slate-100"
                  )}
                >
                  {step.name}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentStep(currentStep - 1);
                  if (currentStep === 3) setResults([]);
                }}
              >
                Back
              </Button>
            )}
            {currentStep < 3 && (
              <Button
                onClick={() => {
                  if (currentStep === 1) setCurrentStep(2);
                  if (currentStep === 2 && uploadedFile) handleProcessFile();
                }}
                disabled={currentStep === 2 && !uploadedFile}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next
              </Button>
            )}
          </div>
        </div>

        {/* Step 1: Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h1 className="text-3xl font-bold text-white">
                Batch Influencer Classification
              </h1>
              <p className="text-slate-400">
                Upload a CSV file with influencer data for automated content rating
              </p>
            </div>

            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                How to prepare your file
              </h3>
              <div className="space-y-3 text-sm text-slate-300">
                <p>1. Download the template CSV file below</p>
                <p>2. Fill in influencer information (Handle, Platform, Description)</p>
                <p>3. Upload the completed file in the next step</p>
                <p>4. Review automated classifications and export results</p>
              </div>
            </Card>
          </div>
        )}

        {/* Step 2: Upload */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <FileUpload
              onFileSelect={handleFileSelect}
              acceptedFormats=".csv,.xlsx"
              maxSize={50}
              currentFile={uploadedFile}
              onClear={handleClearFile}
            />

            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-300">
                Template file to download
              </p>
              <TemplateDownload
                fileName="Template Classification"
                fileSize="4.49 KB"
                fileType="CSV"
                onDownload={handleDownloadTemplate}
              />

              <div className="border border-slate-800 rounded-lg">
                <button
                  onClick={() => setExpandedHelp(!expandedHelp)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-white">
                      How to create a custom classification
                    </span>
                  </div>
                  {expandedHelp ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {expandedHelp && (
                  <div className="p-4 border-t border-slate-800 bg-slate-900/30">
                    <div className="space-y-3 text-sm text-slate-300">
                      <p className="font-medium text-white">CSV File Format:</p>
                      <p>
                        Your CSV should have 3 columns: <strong>Handle</strong>,{" "}
                        <strong>Platform</strong>, <strong>Description</strong>
                      </p>
                      <div className="bg-slate-950 p-3 rounded font-mono text-xs">
                        Handle,Platform,Description
                        <br />
                        @username,Instagram,Content description here...
                      </div>
                      <p>
                        The AI will analyze each influencer&apos;s description and
                        assign an appropriate content rating based on MPAA-style
                        guidelines.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Summary */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Classification Results
              </h2>
              {results.length > 0 && !processing && (
                <Button
                  onClick={handleExportResults}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Results
                </Button>
              )}
            </div>

            {processing && results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
                <p className="text-slate-300">Processing file...</p>
              </div>
            )}

            <div className="space-y-4">
              {results.map((result, index) => (
                <Card
                  key={index}
                  className="bg-slate-900 border-slate-800 p-6"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-white">
                          {result.handle}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {result.platform}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs text-slate-500 mb-1">
                            Risk Level
                          </p>
                          <div
                            className={cn(
                              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                              result.riskLevel === "Low" &&
                                "bg-emerald-500/10 text-emerald-500",
                              result.riskLevel === "High" &&
                                "bg-orange-500/10 text-orange-500",
                              result.riskLevel === "Critical" &&
                                "bg-red-500/10 text-red-500"
                            )}
                          >
                            {getRiskIcon(result.riskLevel!)}
                            {result.riskLevel}
                          </div>
                        </div>
                        <Badge
                          className={`${getRatingColor(
                            result.rating!
                          )} text-lg px-3 py-1`}
                        >
                          {result.rating}
                        </Badge>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-300">
                      {result.description}
                    </p>

                    {/* AI Thinking Process */}
                    <div className="border-t border-slate-800 pt-4">
                      <button
                        onClick={() =>
                          setShowThinking({
                            ...showThinking,
                            [index]: !showThinking[index],
                          })
                        }
                        className="flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <Brain className="w-4 h-4" />
                        {showThinking[index] ? "Hide" : "Show"} AI Thinking
                        Process
                      </button>

                      {showThinking[index] && (
                        <div className="mt-4 space-y-2 bg-slate-950 p-4 rounded-lg border border-slate-800">
                          {result.thinking?.map((thought, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-xs font-mono"
                            >
                              <span className="text-slate-600">
                                {(i + 1).toString().padStart(2, "0")}
                              </span>
                              <span
                                className={cn(
                                  thought.includes("🔴")
                                    ? "text-red-400"
                                    : thought.includes("⚠️")
                                    ? "text-amber-400"
                                    : thought.includes("✓")
                                    ? "text-emerald-400"
                                    : "text-slate-400"
                                )}
                              >
                                {thought}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Recommendation */}
                    <div className="border-t border-slate-800 pt-4">
                      <p className="text-xs text-slate-500 mb-2">
                        Partnership Recommendation
                      </p>
                      <p
                        className={cn(
                          "text-sm font-medium",
                          result.riskLevel === "Low" && "text-emerald-400",
                          result.riskLevel === "High" && "text-orange-400",
                          result.riskLevel === "Critical" && "text-red-400"
                        )}
                      >
                        {result.recommendation}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}

              {processing && (
                <Card className="bg-slate-900/50 border-slate-800 p-6">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                    <span className="text-sm text-slate-300">
                      Processing next influencer...
                    </span>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

