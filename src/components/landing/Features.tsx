import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Bot, Ticket, Users, BarChart3, MessageCircle, Calendar, Zap, Shield, ArrowRight, CheckCircle2 } from "lucide-react";

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

        {/* AI Triage example — makes the benefit tangible */}
        <div className="mt-16 max-w-3xl mx-auto reveal">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-medium mb-3">
              <Bot className="w-3 h-3" />
              AI Triage in action
            </div>
            <h3 className="text-lg font-semibold text-foreground">See what AI triage actually does</h3>
            <p className="text-sm text-muted-foreground mt-1">A tenant's messy message becomes a structured ticket in seconds</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Before */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Tenant message</div>
              <p className="text-sm text-foreground italic leading-relaxed">
                "Hey, the AC in my unit 4B at the elm street building hasn't been working right for a couple days. it's making this weird noise and not cooling properly. can someone take a look? thanks"
              </p>
            </div>
            {/* After */}
            <div className="rounded-xl border border-primary/20 bg-card p-5 relative">
              <div className="absolute -top-2.5 right-4 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-semibold rounded">AI Output</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Category</span>
                  <span className="text-xs font-medium text-foreground">HVAC Repair</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Priority</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500">High</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Suggested trade</span>
                  <span className="text-xs font-medium text-foreground">CoolAir HVAC</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Unit</span>
                  <span className="text-xs font-medium text-foreground">4B · 425 Elm St</span>
                </div>
                <div className="flex items-start gap-2 pt-1 border-t border-border">
                  <CheckCircle2 className="w-3.5 h-3.5 text-status-completed flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-muted-foreground">AI reasoning: noise + no cooling after 2 days suggests compressor issue. High priority to prevent further damage.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-status-completed" />
              Ticket created and assigned — no manager intervention needed
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
