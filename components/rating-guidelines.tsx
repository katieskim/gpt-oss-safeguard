import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function RatingGuidelines() {
  const guidelines = [
    {
      rating: "I-G",
      name: "General Audience",
      color: "bg-emerald-500 text-emerald-950",
      definition:
        "Content is universally appropriate for audiences of all ages. There is no mature, controversial, or sensitive material.",
      criteria: [
        "No profanity of any kind",
        "No sexual content, suggestive poses, or revealing clothing",
        "No violence, aggressive behavior, or dangerous activities",
        "No alcohol, vaping, or drug references",
        "No controversial discussions (politics, religion, divisive topics)",
        "Consistently positive, educational, or neutral tone",
        "Family-friendly presentation across all posts",
      ],
      examples: [
        "Education and tutorial content",
        "Non-sexualized fitness content",
        "Cooking and food content",
        "Crafts and DIY projects",
        "Family vlogs",
        "Motivational and personal development",
      ],
    },
    {
      rating: "I-PG",
      name: "Parental Guidance",
      color: "bg-sky-500 text-sky-950",
      definition:
        "Content is mostly safe but includes mild mature elements that may not be appropriate for very young audiences.",
      criteria: [
        "Mild or infrequent light profanity (soft words only)",
        "Casual fashion content with form-fitting clothing (not sexualized)",
        "Mildly suggestive humor without explicit references",
        "Occasional references to nightlife or social outings",
        "Mild thematic complexity (dating, relationships)",
        "Personal opinions expressed respectfully",
        "Occasional depiction of alcohol (not excessive)",
      ],
      examples: [
        "Lifestyle vlogging",
        "Beauty and skincare content",
        "Travel and food content",
        "Relaxed comedic content",
      ],
    },
    {
      rating: "I-PG13",
      name: "Parents Strongly Cautioned",
      color: "bg-amber-500 text-amber-950",
      definition:
        "Includes moderately mature content. Material may be inappropriate for younger audiences and requires additional review.",
      criteria: [
        "Common profanity but not highly explicit language",
        "Suggestive poses, sexually appealing fashion, swimwear, lingerie modeling (non-explicit)",
        "Mature humor, innuendo, flirtatious or provocative captions",
        "Clear partying, nightlife, or social drinking imagery",
        "Strong personal opinions that may create polarization",
        "Mild political or controversial commentary (non-extreme)",
        "Intense fitness content including shirtless posts or aestheticized physique",
      ],
      examples: [
        "Fashion and modeling content",
        "Dating and relationship commentary",
        "Comedy with innuendo",
        "Fitness and physique-oriented content",
        "Nightlife and social lifestyle content",
      ],
    },
    {
      rating: "I-R",
      name: "Restricted",
      color: "bg-orange-500 text-orange-950",
      definition:
        "Content contains strong mature themes. Not suitable for minors and poses high reputational risk for partnerships.",
      criteria: [
        "Frequent or explicit profanity",
        "Highly sexualized posing, erotic positioning, dominance/bondage aesthetics (non-nude)",
        "Strong depictions of partying, intoxication, or substance use",
        "Explicit references to sexual topics or performances",
        "Strongly opinionated or divisive political commentary",
        "Content likely to provoke controversy or moral backlash",
        "Violent, aggressive, or dangerous imagery",
        "Participation in explicit comedic behavior",
      ],
      examples: [
        "Adult humor creators",
        "Explicit relationship or sexual commentary",
        "Nightlife promoters",
        "Shock humor creators",
      ],
    },
    {
      rating: "I-NC17",
      name: "Adults Only",
      color: "bg-red-700 text-red-50",
      definition:
        "Content is fully adult, explicit, or erotic in nature. Not suitable for any general-market partnership.",
      criteria: [
        "Full or partial nudity",
        "Explicit sexual content, erotic performances, or fetish representation",
        "Adult subscription link promotion (e.g., OnlyFans, Fansly)",
        "Sex work, adult modeling, or pornography",
        "Highly explicit discussions about sexual acts",
        "Extreme political, hateful, or violent content",
        "Content intentionally created for adult arousal",
      ],
      examples: [
        "Adult models and performers",
        "Nude or partially nude photography",
        "Erotic dancers",
        "Explicit content creators",
      ],
    },
  ];

  return (
    <section id="rating-guidelines" className="py-16 bg-slate-950/50 border-y border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Detailed Classification Guidelines
            </h2>
            <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Complete criteria and examples for each rating category. These guidelines are
              used by the AI classifier to evaluate influencer content.
            </p>
          </div>

          <Tabs defaultValue="I-G" className="w-full">
            <TabsList className="w-full justify-start flex-wrap h-auto gap-2 bg-slate-900 p-2">
              {guidelines.map((guide) => (
                <TabsTrigger key={guide.rating} value={guide.rating}>
                  {guide.rating}
                </TabsTrigger>
              ))}
            </TabsList>

            {guidelines.map((guide) => (
              <TabsContent key={guide.rating} value={guide.rating} className="mt-6">
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center gap-3">
                      <Badge className={`${guide.color} text-sm px-3 py-1`}>
                        {guide.rating}
                      </Badge>
                      <h3 className="text-xl font-semibold">{guide.name}</h3>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-2 text-slate-300">
                        Definition
                      </h4>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {guide.definition}
                      </p>
                    </div>

                    <div className="border-t border-slate-800 pt-4">
                      <h4 className="text-sm font-semibold mb-3 text-slate-300">
                        Key Criteria
                      </h4>
                      <ul className="space-y-2">
                        {guide.criteria.map((criterion, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-slate-400"
                          >
                            <span className="text-slate-600 mt-1">•</span>
                            <span>{criterion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-slate-800 pt-4">
                      <h4 className="text-sm font-semibold mb-3 text-slate-300">
                        Example Content Types
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {guide.examples.map((example, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-slate-800/50 text-slate-400 border-slate-700"
                          >
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
