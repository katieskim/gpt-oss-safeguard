import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function RatingOverview() {
  const ratings = [
    {
      label: "I-G",
      name: "General Audience",
      description: "Fully family-friendly content suitable for all audiences",
      color: "bg-emerald-500 text-emerald-950",
    },
    {
      label: "I-PG",
      name: "Parental Guidance",
      description: "Mildly mature themes, suitable for most audiences",
      color: "bg-sky-500 text-sky-950",
    },
    {
      label: "I-PG13",
      name: "Parents Strongly Cautioned",
      description: "Moderately mature content, not suitable for younger audiences",
      color: "bg-amber-500 text-amber-950",
    },
    {
      label: "I-R",
      name: "Restricted",
      description: "Strong mature themes, high reputational risk",
      color: "bg-orange-500 text-orange-950",
    },
    {
      label: "I-NC17",
      name: "Adults Only",
      description: "Explicit adult content, not suitable for general partnerships",
      color: "bg-red-700 text-red-50",
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold">Rating System Overview</h2>
            <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Our classification system uses five content maturity categories, modeled after
              the MPAA film rating system. Each rating reflects the nature, tone, and
              appropriateness of an influencer's content.
            </p>
          </div>

          <div className="grid gap-4">
            {ratings.map((rating, index) => (
              <Card
                key={index}
                className="bg-slate-900/50 border-slate-800 transition-all hover:bg-slate-900/70"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Badge className={`${rating.color} text-sm px-3 py-1 shrink-0`}>
                      {rating.label}
                    </Badge>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{rating.name}</h3>
                      <p className="text-sm text-slate-400">{rating.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
