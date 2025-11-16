"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    Instagram,
    Loader2,
    Sparkles,
    ShieldAlert,
    FileText,
    TrendingUp,
    ShieldCheck,
    AlertTriangle,
} from "lucide-react";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );
            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

interface ClassificationResult {
    rating: string;
    summary: string;
    factors: string[];
    recommendation: string;
    riskLevel: string;
}

export function InfluencerRatingAgent() {
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ClassificationResult | null>(null);
    
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 80,
        maxHeight: 200,
    });

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

    const classifyContent = async () => {
        if (!value.trim()) return;

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch("/api/classify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    description: value,
                    handle: "@influencer",
                    platform: "Social Media",
                }),
            });

            if (!response.ok) {
                throw new Error("Classification failed");
            }

            const data = await response.json();

            setResult({
                rating: data.rating,
                summary: data.summary,
                factors: data.factors || [],
                recommendation: data.recommendation,
                riskLevel: data.riskLevel,
            });
        } catch (error) {
            console.error("Classification error:", error);
            setResult({
                rating: "I-PG",
                summary: "Unable to classify content. Please check your API configuration.",
                factors: ["API error occurred", "Please verify OpenAI API key is set"],
                recommendation: "Please configure OpenAI API key in .env.local file",
                riskLevel: "Low",
            });
        }

        setLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !loading) {
                classifyContent();
            }
        }
    };

    const handleQuickAnalysis = (type: string) => {
        let prompt = "";
        switch (type) {
            case "instagram":
                prompt = "Instagram fitness influencer with 500K followers. Posts gym workouts, protein shake recipes, and motivational quotes. Uses form-fitting athletic wear. Professional tone.";
                break;
            case "lifestyle":
                prompt = "Lifestyle vlogger posting about fashion hauls, cafe visits, and weekend trips. Occasionally shows wine at dinner. Mild profanity in captions.";
                break;
            case "nightlife":
                prompt = "Nightlife promoter posting club events, cocktail photos, suggestive poses at parties, and DJ performances. Heavy drinking imagery.";
                break;
            case "family":
                prompt = "Family content creator posting cooking tutorials, parenting tips, and educational activities for kids. Wholesome and positive.";
                break;
            case "adult":
                prompt = "Model promoting OnlyFans subscription with provocative photos, lingerie content, and explicit captions.";
                break;
        }
        setValue(prompt);
        setTimeout(() => adjustHeight(), 0);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-5xl mx-auto p-6 space-y-8">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium text-purple-500">AI-Powered Classifier</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Influencer Content Rating Agent
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                    Describe an influencer&apos;s content and get an instant MPAA-style rating based on comprehensive safety guidelines.
                </p>
            </div>

            <div className="w-full grid lg:grid-cols-2 gap-6">
                {/* Input Panel */}
                <div className="space-y-4">
                    <div className="relative bg-slate-900 rounded-xl border border-slate-800 p-4">
                        <label className="text-sm font-medium text-slate-300 mb-2 block">
                            Describe the Influencer&apos;s Content
                        </label>
                        <Textarea
                            ref={textareaRef}
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                adjustHeight();
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Example: Fashion influencer posting swimwear content, travel photos, and lifestyle vlogs. Occasional mild profanity. 250K Instagram followers..."
                            className={cn(
                                "w-full px-4 py-3 resize-none bg-slate-800/50 border-slate-700",
                                "text-white text-sm focus:outline-none",
                                "focus-visible:ring-2 focus-visible:ring-purple-500",
                                "placeholder:text-slate-500 placeholder:text-sm min-h-[80px]"
                            )}
                        />

                        <div className="flex items-center justify-end gap-2 mt-3">
                            <button
                                onClick={classifyContent}
                                disabled={loading || !value.trim()}
                                className={cn(
                                    "px-6 py-2.5 rounded-lg text-sm font-medium transition-all",
                                    value.trim() && !loading
                                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                                )}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Analyzing...
                                    </span>
                                ) : (
                                    "Classify Content"
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Quick Examples */}
                    <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
                        <p className="text-xs font-medium text-slate-400 mb-3">Quick Analysis Examples:</p>
                        <div className="flex flex-wrap gap-2">
                            <QuickButton
                                icon={<Instagram className="w-3 h-3" />}
                                label="Fitness Pro"
                                onClick={() => handleQuickAnalysis("instagram")}
                            />
                            <QuickButton
                                icon={<TrendingUp className="w-3 h-3" />}
                                label="Lifestyle Vlogger"
                                onClick={() => handleQuickAnalysis("lifestyle")}
                            />
                            <QuickButton
                                icon={<ShieldAlert className="w-3 h-3" />}
                                label="Nightlife Promoter"
                                onClick={() => handleQuickAnalysis("nightlife")}
                            />
                            <QuickButton
                                icon={<ShieldCheck className="w-3 h-3" />}
                                label="Family Content"
                                onClick={() => handleQuickAnalysis("family")}
                            />
                            <QuickButton
                                icon={<AlertTriangle className="w-3 h-3" />}
                                label="Adult Content"
                                onClick={() => handleQuickAnalysis("adult")}
                            />
                        </div>
                    </div>
                </div>

                {/* Results Panel */}
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <h3 className="text-sm font-medium text-slate-300">Classification Result</h3>
                    </div>

                    {!result && !loading && (
                        <div className="flex flex-col items-center justify-center h-[400px] text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                                <Sparkles className="w-8 h-8 text-slate-600" />
                            </div>
                            <p className="text-sm text-slate-500">
                                Enter influencer details and click &quot;Classify Content&quot;
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div className="flex flex-col items-center justify-center h-[400px]">
                            <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
                            <p className="text-sm text-slate-400">Analyzing content against guidelines...</p>
                            <p className="text-xs text-slate-600 mt-2">This may take a few seconds</p>
                        </div>
                    )}

                    {result && !loading && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            {/* Rating Badge */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Content Rating</p>
                                    <Badge className={`${getRatingColor(result.rating)} text-xl px-4 py-1 font-bold`}>
                                        {result.rating}
                                    </Badge>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 mb-1">Risk Level</p>
                                    <div className={cn(
                                        "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium",
                                        result.riskLevel === "Low" && "bg-emerald-500/10 text-emerald-500",
                                        result.riskLevel === "Medium" && "bg-amber-500/10 text-amber-500",
                                        result.riskLevel === "High" && "bg-orange-500/10 text-orange-500",
                                        result.riskLevel === "Critical" && "bg-red-500/10 text-red-500"
                                    )}>
                                        {getRiskIcon(result.riskLevel)}
                                        {result.riskLevel}
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div>
                                <p className="text-xs text-slate-500 mb-2">Summary</p>
                                <p className="text-sm text-slate-300 leading-relaxed">{result.summary}</p>
                            </div>

                            {/* Key Factors */}
                            <div>
                                <p className="text-xs text-slate-500 mb-2">Key Factors</p>
                                <ul className="space-y-2">
                                    {result.factors.map((factor, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-slate-400">
                                            <span className="text-purple-500 mt-1">•</span>
                                            <span>{factor}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Recommendation */}
                            <div className="border-t border-slate-800 pt-4">
                                <p className="text-xs text-slate-500 mb-2">Partnership Recommendation</p>
                                <p className={cn(
                                    "text-sm font-medium leading-relaxed",
                                    result.riskLevel === "Low" && "text-emerald-400",
                                    result.riskLevel === "Medium" && "text-amber-400",
                                    (result.riskLevel === "High" || result.riskLevel === "Critical") && "text-red-400"
                                )}>
                                    {result.recommendation}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

interface QuickButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

function QuickButton({ icon, label, onClick }: QuickButtonProps) {
    return (
        <button
            onClick={onClick}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-400 hover:text-white transition-colors text-xs"
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

