import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      question: "What if an influencer has multiple styles of content?",
      answer:
        "The classification is based on the dominant content pattern across the profile. If an influencer regularly posts content from different categories, the rating defaults to the higher-risk category to ensure safety. For example, if 80% of posts are I-PG but 20% are I-R, the overall rating would be I-R.",
    },
    {
      question: "Do we always choose the highest rating based on any single post?",
      answer:
        "No, the system evaluates the overall content pattern, not isolated posts. However, any explicit content (nudity, adult material) immediately qualifies the profile as I-NC17, regardless of other content. For less extreme material, occasional mature posts within an otherwise family-friendly profile may result in a higher rating if they appear frequently or recently.",
    },
    {
      question: "How often should we re-run the classifier?",
      answer:
        "Content creators evolve their style over time. We recommend re-evaluating influencers quarterly for ongoing partnerships, or immediately if you notice significant changes in their content style. High-risk categories (I-R, I-NC17) should be monitored more frequently.",
    },
    {
      question: "Can this system be used for automated blocking or approval?",
      answer:
        "The classifier is designed as a decision-support tool, not an automated gatekeeper. While I-G and I-PG ratings may feed into low-risk approval workflows, I-PG13 and above should always involve human review before final partnership decisions. Never use this system for fully automated blocking without human oversight.",
    },
    {
      question: "What about content in Stories or Lives that disappears?",
      answer:
        "Ephemeral content (Stories, Lives) should be considered in the classification if it's representative of the creator's typical content. If you observe mature content in Stories but not in permanent posts, document this in your assessment and default to the higher-risk rating. Consider the overall impression a viewer would get from following the account.",
    },
    {
      question: "How do we handle influencers with separate personal and brand accounts?",
      answer:
        "Each account should be classified independently. However, if both accounts are publicly linked (bio mentions, cross-posting), both should be reviewed. The higher-risk rating should be applied to partnership decisions, as brand associations can extend across linked accounts.",
    },
    {
      question: "What if the AI classifier disagrees with a human reviewer?",
      answer:
        "Human judgment always takes precedence. The AI provides a starting point and consistency check, but reviewers with context and expertise should make final decisions. Document any disagreements to help improve the system over time and ensure alignment on edge cases.",
    },
  ];

  return (
    <section className="py-16 bg-slate-950/50 border-y border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Frequently Asked Questions
            </h2>
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Common questions about edge cases, implementation, and best practices for
              using the classification system.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-slate-800"
              >
                <AccordionTrigger className="text-left hover:text-slate-200">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-400 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
