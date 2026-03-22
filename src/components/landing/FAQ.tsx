import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How long does setup take?", a: "Most teams are up and running in under 30 minutes — no credit card, no IT department needed. Import your properties, invite contractors, and start receiving tickets immediately." },
  { q: "Can tenants use PropFix AI without creating an account?", a: "Yes. Tenants submit requests via a simple web form — name, unit, and description only. No app download, no account needed. They get email updates until the job is done." },
  { q: "How does the AI triage work?", a: "When a tenant submits a request, our AI analyzes the description and outputs: an issue category, a priority level (with reasoning), and a suggested contractor. The ticket is pre-filled and ready for your review — no manual triage needed." },
  { q: "What if I manage multiple properties?", a: "PropFix AI supports portfolios of any size. Filter tickets by property, view aggregate analytics across all buildings, and assign contractors per-ticket or by property. Scales from 5 units to 10,000+." },
  { q: "Is there a mobile app for contractors?", a: "Contractors access their assignments through a responsive web portal — no app download required. They can view jobs, update status, mark jobs complete with photo proof, and message tenants from their phone's browser." },
  { q: "Can I integrate with my existing property management software?", a: "Professional and Enterprise plans include REST API access. Enterprise plans include pre-built connectors for popular property management platforms and custom SSO/SAML setup." },
];

export function FAQ() {
  const ref = useScrollReveal();
  return (
    <section id="faq" ref={ref} className="reveal py-20 lg:py-28 bg-[hsl(var(--landing-bg))]">
      <div className="section-container section-padding">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Frequently asked questions</h2>
        </div>
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q} className="rounded-lg border border-border bg-card px-5">
                <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
