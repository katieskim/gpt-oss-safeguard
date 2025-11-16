import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Gavel, ShieldAlert } from "lucide-react";

export function ProblemContext() {
  const risks = [
    {
      icon: AlertTriangle,
      title: "Reputation Risk",
      description:
        "Unreviewed influencer content can lead to brand associations with inappropriate or controversial material, damaging public perception.",
    },
    {
      icon: Gavel,
      title: "Compliance Risk",
      description:
        "Lack of standardized content evaluation creates legal and regulatory exposure, especially for industries with strict content requirements.",
    },
    {
      icon: ShieldAlert,
      title: "Brand Safety Risk",
      description:
        "Inconsistent screening processes result in partnerships that misalign with brand values and safety requirements.",
    },
  ];

  return (
    <section className="py-16 bg-slate-950/50 border-y border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Why Content Classification Matters
            </h2>
            <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              In today's social media landscape, influencer partnerships carry significant
              risk. Without a consistent, documented classification system, organizations
              face exposure across multiple dimensions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {risks.map((risk, index) => {
              const Icon = risk.icon;
              return (
                <Card key={index} className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-800">
                        <Icon className="h-5 w-5 text-slate-400" />
                      </div>
                      <CardTitle className="text-lg">{risk.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {risk.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
