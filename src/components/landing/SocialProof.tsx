import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Building2, CheckCircle } from "lucide-react";

const trustPoints = [
  "Property managers handling 20–250 units",
  "SOC 2 compliant infrastructure",
  "Tenant data never sold or shared",
  "Setup in under 30 minutes",
];

export function SocialProof() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="reveal py-12 border-y border-border bg-[hsl(var(--landing-bg))]">
      <div className="section-container section-padding">
        <p className="text-center text-sm text-muted-foreground mb-6">Built for property managers who can't afford slow, unreliable maintenance systems</p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 reveal-stagger">
          {trustPoints.map((point) => (
            <div key={point} className="reveal flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="w-4 h-4 text-status-completed flex-shrink-0" />
              <span className="text-sm font-medium">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
