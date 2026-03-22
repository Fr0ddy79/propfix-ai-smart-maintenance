import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Clock, TrendingUp, ThumbsUp, Zap } from "lucide-react";

const benefits = [
  { icon: Clock, stat: "< 2 hrs", label: "Weekly coordination time", desc: "Most teams handle all maintenance coordination in under two hours per week." },
  { icon: TrendingUp, stat: "Same day", label: "First contractor response", desc: "AI triage routes requests to the right contractor within minutes." },
  { icon: ThumbsUp, stat: "Real-time", label: "Tenant updates", desc: "No more phone tag — tenants see status updates as they happen." },
  { icon: Zap, stat: "Zero", label: "Per-ticket overhead", desc: "Every request logged, categorized, and tracked without manual effort." },
];

export function ROI() {
  const ref = useScrollReveal();
  return (
    <section id="roi" ref={ref} className="reveal py-20 lg:py-28 bg-[hsl(var(--landing-bg))]">
      <div className="section-container section-padding">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">The impact is measurable</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Property managers using PropFix AI see results from the first week.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto reveal-stagger">
          {benefits.map(({ icon: Icon, stat, label, desc }) => (
            <div key={label} className="reveal text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground tabular-nums mb-1">{stat}</div>
              <div className="text-sm font-semibold text-foreground mb-1">{label}</div>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
