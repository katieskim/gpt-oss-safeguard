"use client";

import { motion } from "framer-motion";
import { Shield, FileCheck, AlertOctagon } from "lucide-react";
import { Card } from "@/components/ui/card";

const risks = [
  {
    icon: AlertOctagon,
    title: "Reputation Risk",
    description: "Unreviewed influencer content can lead to brand associations with inappropriate or controversial material, damaging public perception and customer trust.",
    color: "red",
  },
  {
    icon: FileCheck,
    title: "Compliance Risk",
    description: "Lack of standardized content evaluation creates legal and regulatory exposure, especially for industries with strict content requirements like healthcare and finance.",
    color: "amber",
  },
  {
    icon: Shield,
    title: "Brand Safety Risk",
    description: "Inconsistent screening processes result in partnerships that misalign with brand values and safety requirements, leading to costly contract terminations.",
    color: "emerald",
  },
];

export function WhyItMatters() {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Why Content Classification Matters
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            In today's social media landscape, influencer partnerships carry significant risk.
            Without a consistent, documented classification system, organizations face exposure
            across multiple dimensions.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {risks.map((risk, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index === 0 ? -40 : index === 2 ? 40 : 0, y: index === 1 ? 40 : 0 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card className="relative overflow-hidden bg-slate-900/50 border-slate-800 p-8 h-full">
                {/* Colored accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                  risk.color === "red" ? "from-red-500/50 to-red-500" :
                  risk.color === "amber" ? "from-amber-500/50 to-amber-500" :
                  "from-emerald-500/50 to-emerald-500"
                }`} />
                
                <div className="flex flex-col gap-4">
                  <div className={`w-14 h-14 rounded-xl ${
                    risk.color === "red" ? "bg-red-500/10" :
                    risk.color === "amber" ? "bg-amber-500/10" :
                    "bg-emerald-500/10"
                  } flex items-center justify-center`}>
                    <risk.icon className={`w-7 h-7 ${
                      risk.color === "red" ? "text-red-500" :
                      risk.color === "amber" ? "text-amber-500" :
                      "text-emerald-500"
                    }`} />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {risk.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {risk.description}
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

