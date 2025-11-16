import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, UserCheck, FileCheck, Shield } from "lucide-react";

export function GovernanceSection() {
  const principles = [
    {
      icon: UserCheck,
      title: "Human Review Required",
      description:
        "All I-R and I-NC17 classifications must be reviewed and approved by human reviewers before final decisions.",
    },
    {
      icon: FileCheck,
      title: "Agent as Guidance",
      description:
        "AI classifier output serves as guidance and initial assessment, not as final decision authority.",
    },
    {
      icon: Shield,
      title: "Audit Trail",
      description:
        "All classifications, agent outputs, and human decisions are logged for compliance audits and quality review.",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Governance & Safety
            </h2>
            <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              The classification system is integrated into a broader governance framework
              to ensure responsible decision-making and compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <Card key={index} className="bg-slate-900/50 border-slate-800">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-slate-800 w-fit">
                        <Icon className="h-6 w-6 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold">{principle.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {principle.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Classification Workflow</h3>

                <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
                  <div className="flex-1 text-center">
                    <div className="p-4 rounded-lg bg-slate-800 mb-3">
                      <p className="font-medium">Input Profile</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Influencer description and content
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-slate-600 rotate-90 md:rotate-0" />

                  <div className="flex-1 text-center">
                    <div className="p-4 rounded-lg bg-slate-800 mb-3">
                      <p className="font-medium">AI Classification</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Automated rating and analysis
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-slate-600 rotate-90 md:rotate-0" />

                  <div className="flex-1 text-center">
                    <div className="p-4 rounded-lg bg-slate-800 mb-3">
                      <p className="font-medium">Human Review</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Validation and approval
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 text-slate-600 rotate-90 md:rotate-0" />

                  <div className="flex-1 text-center">
                    <div className="p-4 rounded-lg bg-emerald-800/30 border border-emerald-700/30 mb-3">
                      <p className="font-medium text-emerald-400">Final Classification</p>
                      <p className="text-xs text-emerald-400/70 mt-1">
                        Decision logged and stored
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
