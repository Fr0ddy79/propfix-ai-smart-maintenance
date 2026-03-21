import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Clock, TrendingUp, ThumbsUp, DollarSign } from "lucide-react";

const benefits = [
  { icon: Clock, stat: "77%", label: "Less admin time", desc: "Automate coordination that used to require phone calls and emails." },
  { icon: TrendingUp, stat: "3.2×", label: "Faster response", desc: "AI routing gets the right contractor dispatched immediately." },
  { icon: ThumbsUp, stat: "94%", label: "Tenant satisfaction", desc: "Real-time updates and faster resolutions keep tenants happy." },
  { icon: DollarSign, stat: "$840", label: "Monthly savings", desc: "Reduce per-unit maintenance coordination costs across your portfolio." },
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
