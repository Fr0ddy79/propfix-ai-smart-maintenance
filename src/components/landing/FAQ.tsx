import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How long does setup take?", a: "Most teams are up and running within 30 minutes. Add your properties, invite your contractors, and start receiving tickets immediately." },
  { q: "Can tenants use PropFix AI without creating an account?", a: "Yes. Tenants can submit requests via a simple web form that requires only their name, unit, and a description of the issue. No app download needed." },
  { q: "How does the AI triage work?", a: "When a tenant submits a request, our AI analyzes the description to determine the issue category, priority level, and suggested contractor trade. It converts unstructured text into a structured ticket in seconds." },
  { q: "What if I manage multiple properties?", a: "PropFix AI supports multi-property management. You can view all tickets across properties or filter by individual buildings from the dashboard." },
  { q: "Is there a mobile app for contractors?", a: "Contractors access their assignments through a responsive web portal optimized for mobile. They can view jobs, update status, and communicate — all from their phone's browser." },
  { q: "Can I integrate with my existing property management software?", a: "Professional and Enterprise plans include API access for integrations. We also offer pre-built connections for popular property management platforms." },
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
