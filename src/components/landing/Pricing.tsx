import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "$99",
    period: "/month",
    desc: "For small portfolios getting started",
    units: "Up to 50 units",
    features: [
      "Unlimited tickets",
      "AI triage",
      "3 contractor accounts",
      "Tenant portal",
      "Email notifications",
      "Basic reporting",
    ],
    cta: "Try Free Demo",
    ctaHref: "/login",
    highlight: false,
  },
  {
    name: "Professional",
    price: "$249",
    period: "/month",
    desc: "For growing property management teams",
    units: "51–250 units",
    features: [
      "Everything in Starter",
      "Unlimited contractors",
      "Advanced analytics",
      "Scheduling & calendar",
      "Priority support",
      "Custom workflows",
      "API access",
    ],
    cta: "Try Free Demo",
    ctaHref: "/login",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large portfolios and multi-site teams",
    units: "250+ units",
    features: [
      "Everything in Professional",
      "SSO & SAML",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantees",
      "White-label tenant portal",
      "On-premise option",
    ],
    cta: "Talk to Sales",
    ctaHref: "mailto:sales@propfix.ai?subject=Enterprise%20Inquiry",
    highlight: false,
  },
];

export function Pricing() {
  const ref = useScrollReveal();
  return (
    <section id="pricing" ref={ref} className="reveal py-20 lg:py-28 bg-[hsl(var(--landing-section-alt))]">
      <div className="section-container section-padding">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Try the full platform free for 14 days. No credit card required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto reveal-stagger">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`reveal rounded-xl border p-6 flex flex-col ${
                plan.highlight
                  ? "border-primary bg-card card-shadow-lg ring-1 ring-primary/20 relative"
                  : "border-border bg-card card-shadow"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  Best Value
                </div>
              )}
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{plan.desc}</p>
              </div>
              <div className="mb-1">
                <span className="text-4xl font-bold text-foreground tabular-nums">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <div className="text-xs text-muted-foreground mb-5">{plan.units}</div>
              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-status-completed flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.ctaHref.startsWith("mailto:") ? (
                <a href={plan.ctaHref}>
                  <Button
                    variant="outline"
                    className="w-full active:scale-[0.97] transition-all"
                  >
                    {plan.cta}
                  </Button>
                </a>
              ) : (
                <Link to={plan.ctaHref}>
                  <Button
                    className={`w-full active:scale-[0.97] transition-all ${
                      plan.highlight ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
                    }`}
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
