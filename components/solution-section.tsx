"use client";

import { motion } from "framer-motion";
import { Brain, Zap, ShieldCheck, FileText, Mic, Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "GPT-4 Turbo analyzes content using MPAA-style classification guidelines for consistent, objective ratings.",
    link: "/chat",
  },
  {
    icon: Database,
    title: "Batch Processing",
    description: "Upload CSV files with hundreds of influencers and get automated classifications in minutes, not days.",
    link: "/batch",
  },
  {
    icon: Mic,
    title: "Audio Transcription",
    description: "Whisper AI transcribes audio content and evaluates speech for profanity, themes, and brand safety.",
    link: "/audio",
  },
  {
    icon: Zap,
    title: "Real-time Results",
    description: "Get instant classification with detailed reasoning, key factors, and partnership recommendations.",
    link: "/chat",
  },
  {
    icon: ShieldCheck,
    title: "Risk Assessment",
    description: "Four-tier risk levels (Low, Medium, High, Critical) with specific partnership guidance for each influencer.",
    link: "/chat",
  },
  {
    icon: FileText,
    title: "Export & Reports",
    description: "Download classification results as CSV for stakeholder review, compliance documentation, and CRM integration.",
    link: "/batch",
  },
];

export function SolutionSection() {
  return (
    <section className="py-20 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
      
      <div className="container mx-auto relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-400">
              The Solution
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            AI-Powered Content Safety at Scale
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            Comprehensive MPAA-style content classification system that evaluates influencers
            across text, audio, and batch analysis
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={feature.link}>
                <Card className="relative overflow-hidden bg-slate-900/50 border-slate-800 p-6 h-full hover:bg-slate-900 hover:border-purple-500/30 transition-all group cursor-pointer">
                  {/* Hover gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-transparent transition-all" />
                  
                  <div className="relative flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-purple-500" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

