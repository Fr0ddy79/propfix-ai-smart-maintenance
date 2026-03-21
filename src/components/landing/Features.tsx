import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Bot, Ticket, Users, BarChart3, MessageCircle, Calendar, Zap, Shield } from "lucide-react";

const features = [
  { icon: Ticket, title: "Smart Ticket Intake", desc: "Tenants submit requests via web portal. Issues are automatically logged and organized." },
  { icon: Bot, title: "AI Triage", desc: "Unstructured messages become structured tickets with category, priority, and suggested trade." },
  { icon: Users, title: "Contractor Assignment", desc: "Match the right contractor based on specialty, availability, and past performance." },
  { icon: Zap, title: "Real-Time Status Tracking", desc: "Everyone sees live updates — from submission to completion." },
  { icon: MessageCircle, title: "Communication Threads", desc: "Keep all messages, photos, and notes in one place per ticket." },
  { icon: Calendar, title: "Scheduling", desc: "Coordinate appointments and maintenance windows without phone tag." },
  { icon: BarChart3, title: "Analytics & Reporting", desc: "Track response times, completion rates, and costs across your portfolio." },
  { icon: Shield, title: "Audit Trail", desc: "Full history of every request, decision, and action for compliance." },
];

export function Features() {
  const ref = useScrollReveal();
  return (
    <section id="features" ref={ref} className="reveal py-20 lg:py-28 bg-[hsl(var(--landing-section-alt))]">
      <div className="section-container section-padding">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Everything you need to manage maintenance</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for property managers who want to move fast without dropping the ball.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto reveal-stagger">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="reveal group rounded-xl border border-border bg-card p-5 card-shadow hover:card-shadow-hover transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/12 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1.5">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
