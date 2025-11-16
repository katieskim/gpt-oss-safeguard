import { AnimatedHero } from "@/components/animated-hero";
import { ProblemSection } from "@/components/problem-section";
import { SolutionSection } from "@/components/solution-section";
import { WhyItMatters } from "@/components/why-it-matters";
import { RatingOverview } from "@/components/rating-overview";
import { RatingGuidelines } from "@/components/rating-guidelines";
import { AgentPlayground } from "@/components/agent-playground";
import { ExampleUseCases } from "@/components/example-use-cases";
import { GovernanceSection } from "@/components/governance-section";
import { FAQSection } from "@/components/faq-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <AnimatedHero />
      <ProblemSection />
      <SolutionSection />
      <WhyItMatters />
      <RatingOverview />
      <RatingGuidelines />
      <AgentPlayground />
      <ExampleUseCases />
      <GovernanceSection />
      <FAQSection />

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-500">
              Influencer Content Classifier &copy; {new Date().getFullYear()}
            </p>
            <p className="text-xs text-slate-600">
              For internal use only. Classification system for influencer screening and
              risk assessment.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
