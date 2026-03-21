import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MessageSquare, ClipboardCheck, Wrench } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    step: "1",
    title: "Tenant submits request",
    desc: "Tenants describe the issue in plain language. AI converts it into a structured ticket with category, priority, and suggested trade.",
  },
  {
    icon: ClipboardCheck,
    step: "2",
    title: "Manager assigns & tracks",
    desc: "Review AI-triaged tickets, assign the right contractor, and set schedules — all from one dashboard.",
  },
  {
    icon: Wrench,
    step: "3",
    title: "Contractor completes & updates",
    desc: "Contractors receive assignments, update job status in real time, and tenants get notified when work is done.",
  },
];

export function HowItWorks() {
  const ref = useScrollReveal();
  return (
    <section id="how-it-works" ref={ref} className="reveal py-20 lg:py-28 bg-[hsl(var(--landing-bg))]">
      <div className="section-container section-padding">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How it works</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Three steps. One workflow. Everyone stays in the loop.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto reveal-stagger">
          {steps.map(({ icon: Icon, step, title, desc }) => (
            <div key={step} className="reveal text-center rounded-xl p-4 hover:shadow-md hover:bg-card/40 transition-all">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-5">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Step {step}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
