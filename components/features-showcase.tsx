"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, Mic, MessageSquare, Upload, FileAudio } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Video,
    title: "Video Recording",
    description: "Record video with live preview while we analyze your audio content",
    href: "/video",
    gradient: "from-blue-600 to-cyan-600",
    primary: true,
  },
  {
    icon: Mic,
    title: "Voice Recording",
    description: "Real-time audio recording with live visualization",
    href: "/voice",
    gradient: "from-purple-600 to-pink-600",
  },
  {
    icon: MessageSquare,
    title: "Text Classification",
    description: "Analyze influencer descriptions and social media content",
    href: "/chat",
    gradient: "from-emerald-600 to-teal-600",
  },
  {
    icon: Upload,
    title: "Batch Upload",
    description: "Process multiple influencers at once via CSV upload",
    href: "/batch",
    gradient: "from-orange-600 to-red-600",
  },
  {
    icon: FileAudio,
    title: "Audio Files",
    description: "Upload audio files for content classification",
    href: "/audio",
    gradient: "from-indigo-600 to-purple-600",
  },
];

export function FeaturesShowcase() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Rating Method
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Multiple ways to analyze and classify creator content with AI-powered insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isPrimary = feature.primary;

            return (
              <motion.div
                key={feature.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={isPrimary ? "md:col-span-2 lg:col-span-1" : ""}
              >
                <Link href={feature.href}>
                  <Card
                    className={`
                      group relative overflow-hidden border-2 transition-all duration-300
                      ${
                        isPrimary
                          ? "bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-500/50 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/20"
                          : "bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:shadow-xl"
                      }
                      backdrop-blur-sm hover:scale-[1.02] cursor-pointer
                    `}
                  >
                    <div className="p-8">
                      {/* Icon */}
                      <div
                        className={`
                        mb-6 w-16 h-16 rounded-2xl 
                        bg-gradient-to-br ${feature.gradient}
                        flex items-center justify-center
                        group-hover:scale-110 transition-transform duration-300
                      `}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <h3
                        className={`
                        text-2xl font-bold mb-3
                        ${isPrimary ? "text-blue-100" : "text-white"}
                      `}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={`
                        text-base leading-relaxed mb-6
                        ${isPrimary ? "text-blue-200/80" : "text-slate-400"}
                      `}
                      >
                        {feature.description}
                      </p>

                      {/* CTA */}
                      <Button
                        className={`
                        w-full
                        ${
                          isPrimary
                            ? `bg-gradient-to-r ${feature.gradient} hover:opacity-90 text-white border-0`
                            : "bg-slate-800 hover:bg-slate-700 text-white border-slate-700"
                        }
                      `}
                      >
                        {isPrimary ? "Start Recording →" : "Try it Now"}
                      </Button>

                      {/* Badge for primary */}
                      {isPrimary && (
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-semibold">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Gradient overlay on hover */}
                    <div
                      className={`
                      absolute inset-0 opacity-0 group-hover:opacity-10 
                      bg-gradient-to-br ${feature.gradient}
                      transition-opacity duration-300 pointer-events-none
                    `}
                    />
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

