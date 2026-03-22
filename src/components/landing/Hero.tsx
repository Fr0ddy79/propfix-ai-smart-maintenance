import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[hsl(var(--landing-bg))] overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
        backgroundSize: '24px 24px',
      }} />

      <div className="section-container section-padding relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
            AI-Powered Maintenance Coordination
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.08] mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Stop juggling maintenance requests
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
            PropFix AI connects tenants, property managers, and contractors in one streamlined workflow. 
            AI triages every request so the right contractor gets dispatched faster.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <Link to="/login">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-all h-12 px-8 text-base font-semibold">
                Try Manager Demo
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/tenant">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base font-semibold active:scale-[0.97] transition-all">
                <Play className="mr-2 w-4 h-4" />
                See Tenant Demo
              </Button>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground mt-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
            No signup required · Instant demo access · Explore all features
          </p>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 lg:mt-20 max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: '500ms' }} role="img" aria-label="PropFix AI dashboard preview showing tickets and scheduling">
          <div className="rounded-xl border border-border bg-card card-shadow-lg overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/30">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-status-in-progress/60" />
              <div className="w-3 h-3 rounded-full bg-status-completed/60" />
              <span className="ml-3 text-xs text-muted-foreground">PropFix AI — Dashboard</span>
            </div>
            <div className="p-6 bg-background">
              {/* Mini dashboard mockup */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: "Open Tickets", value: "4", color: "text-status-new" },
                  { label: "In Progress", value: "2", color: "text-status-in-progress" },
                  { label: "Completed (7d)", value: "11", color: "text-status-completed" },
                  { label: "Avg Response", value: "1.8h", color: "text-primary" },
                ].map((kpi) => (
                  <div key={kpi.label} className="rounded-lg bg-card border border-border p-3">
                    <div className="text-xs text-muted-foreground mb-1">{kpi.label}</div>
                    <div className={`text-xl font-bold tabular-nums ${kpi.color}`}>{kpi.value}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 rounded-lg bg-card border border-border p-3">
                  <div className="text-xs font-medium text-foreground mb-2">Action Required</div>
                  {[
                    { ticket: "Water heater issue, 425 Elm St #3A", urgency: "Urgent", assignee: "Mike's Plumbing" },
                    { ticket: "HVAC not cooling, 188 Oak Ave #12", urgency: "High", assignee: "Unassigned" },
                    { ticket: "Broken outlet, 425 Elm St #7B", urgency: "Medium", assignee: "Sparky Electric" },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                      <span className="text-xs text-muted-foreground">{t.ticket}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                          t.urgency === "Urgent" ? "bg-status-urgent/10 text-status-urgent" :
                          t.urgency === "High" ? "bg-status-in-progress/10 text-status-in-progress" :
                          "bg-primary/10 text-primary"
                        }`}>{t.urgency}</span>
                        <span className="text-[10px] text-muted-foreground">{t.assignee === "Unassigned" ? "Assign →" : t.assignee}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-card border border-border p-3">
                  <div className="text-xs font-medium text-foreground mb-2">Today's Jobs</div>
                  {[
                    { job: "HVAC Repair", time: "9–11 AM", crew: "CoolAir HVAC" },
                    { job: "Lockout Assist", time: "1:30 PM", crew: "Metro Locksmith" },
                    { job: "Plumbing Fix", time: "3–4 PM", crew: "Mike's Plumbing" },
                  ].map((j, i) => (
                    <div key={i} className="py-1.5 text-xs text-muted-foreground border-b border-border last:border-0">
                      <div className="font-medium text-foreground">{j.job}</div>
                      <div className="text-[10px] text-muted-foreground">{j.time}</div>
                      <div className="text-[10px] text-primary">{j.crew}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
