"use client";

import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, Scale } from "lucide-react";
import { Card } from "@/components/ui/card";

const problems = [
  {
    icon: TrendingDown,
    stat: "$1.3B",
    title: "Lost on Misaligned Content",
    description: "Brands waste billions annually partnering with influencers whose content doesn't align with their values or target audience.",
  },
  {
    icon: AlertTriangle,
    stat: "One Post",
    title: "Can Destroy Brand Equity",
    description: "A single controversial influencer post can undo years of carefully built brand reputation and customer trust.",
  },
  {
    icon: Scale,
    stat: "Manual",
    title: "Screening Doesn't Scale",
    description: "Human review of thousands of influencer profiles is slow, inconsistent, and prone to subjective bias.",
  },
];

export function ProblemSection() {
  return (
    <section className="py-20 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent pointer-events-none" />
      
      <div className="container mx-auto relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            The Hidden Cost of Influencer Marketing
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Without systematic content evaluation, every partnership is a gamble
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="relative overflow-hidden bg-slate-900/50 border-slate-800 p-8 h-full hover:bg-slate-900 transition-colors group">
                {/* Gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <problem.icon className="w-6 h-6 text-red-500" />
                  </div>
                  
                  <div>
                    <div className="text-4xl font-bold text-white mb-2">
                      {problem.stat}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {problem.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {problem.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

