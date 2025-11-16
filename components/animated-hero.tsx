"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Video, Mic, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AnimatedHero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Risky Content", "Bad Influencers", "Reputation Damage", "Costly Mistakes", "Brand Crises"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2500);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
      
      <div className="container mx-auto relative">
        <div className="flex gap-8 py-20 lg:py-32 items-center justify-center flex-col">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-400">
                AI-Powered Content Safety
              </span>
            </div>
          </motion.div>

          {/* Animated Headline */}
          <div className="flex gap-4 flex-col">
            <motion.h1 
              className="text-5xl md:text-7xl max-w-4xl tracking-tight text-center font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="text-white">Protect Your Brand From</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-2">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: 100 }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl leading-relaxed tracking-tight text-slate-400 max-w-3xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              AI-powered MPAA-style content classification for influencer partnerships.
              Stop wasting money on bad influencers and protect your brand reputation
              with real-time content analysis.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col items-center gap-4 mt-4 w-full max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Primary CTA - Video Recording */}
            <Link href="/video" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-2xl shadow-blue-500/30 px-8 py-6 text-lg group"
              >
                <Video className="w-5 h-5" />
                Start Video Analysis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            {/* Secondary CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href="/voice" className="flex-1 sm:flex-initial">
                <Button 
                  size="lg" 
                  className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                >
                  <Mic className="w-4 h-4" />
                  Voice Recording
                </Button>
              </Link>
              <Link href="/chat" className="flex-1 sm:flex-initial">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full gap-2 border-slate-700 hover:bg-slate-800"
                >
                  <MessageSquare className="w-4 h-4" />
                  Text Analysis
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-8 sm:gap-12 mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div>
              <div className="text-3xl font-bold text-white">4</div>
              <div className="text-sm text-slate-500">Rating Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">5</div>
              <div className="text-sm text-slate-500">Analysis Methods</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">Real-time</div>
              <div className="text-sm text-slate-500">AI Classification</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

