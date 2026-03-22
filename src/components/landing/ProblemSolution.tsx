import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Phone, Mail, FileSpreadsheet, ArrowRight, LayoutDashboard, Bot, CheckCircle } from "lucide-react";

export function ProblemSolution() {
  const ref = useScrollReveal();
  return (
    <section id="problem-solution" ref={ref} className="reveal py-20 lg:py-28 bg-[hsl(var(--landing-section-alt))]">
      <div className="section-container section-padding">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">From chaos to clarity</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Property managers spend hours every week on phone calls, emails, and spreadsheets to coordinate maintenance. PropFix AI replaces all of that.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr,auto,1fr] gap-8 items-center max-w-4xl mx-auto reveal-stagger">
          {/* Before */}
          <div className="reveal rounded-xl border border-destructive/20 bg-card p-6 card-shadow">
            <div className="text-sm font-semibold text-destructive mb-4">Without PropFix AI</div>
            <div className="space-y-3">
              {[
                { icon: Phone, text: "Missed calls from tenants" },
                { icon: Mail, text: "Emails buried in inboxes" },
                { icon: FileSpreadsheet, text: "Spreadsheets nobody updates" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Icon className="w-4 h-4 text-destructive/60 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
              Most teams spend hours every week on this manually
            </div>
          </div>

          {/* Arrow desktop */}
          <div className="hidden md:flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-primary" />
            </div>
          </div>
          {/* Arrow mobile */}
          <div className="flex md:hidden items-center justify-center py-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-primary rotate-90" />
            </div>
          </div>

          {/* After */}
          <div className="reveal rounded-xl border border-status-completed/20 bg-card p-6 card-shadow">
            <div className="text-sm font-semibold text-status-completed mb-4">With PropFix AI</div>
            <div className="space-y-3">
              {[
                { icon: LayoutDashboard, text: "One dashboard, full visibility" },
                { icon: Bot, text: "AI triages and routes requests" },
                { icon: CheckCircle, text: "Auto-updates keep everyone informed" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Icon className="w-4 h-4 text-status-completed/80 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
              Most teams handle it in under <span className="font-medium text-status-completed">2 hrs/week</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
