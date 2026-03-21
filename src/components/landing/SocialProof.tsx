import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Building2 } from "lucide-react";

const companies = ["Pinecrest Living", "BlueSky Properties", "Harbor View Mgmt", "Summit Residential", "Evergreen Capital", "Apex Housing"];

export function SocialProof() {
  const ref = useScrollReveal();
  return (
    <section ref={ref} className="reveal py-12 border-y border-border bg-[hsl(var(--landing-bg))]">
      <div className="section-container section-padding">
        <p className="text-center text-sm text-muted-foreground mb-6">Trusted by property teams managing 50,000+ units across North America</p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 reveal-stagger">
          {companies.map((name) => (
            <div key={name} className="reveal flex items-center gap-2 text-muted-foreground/50">
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-semibold tracking-wide">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
