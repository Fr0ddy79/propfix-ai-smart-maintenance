import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function FinalCTA() {
  const ref = useScrollReveal();
  return (
    <section id="final-cta" ref={ref} className="reveal py-20 lg:py-28 bg-primary">
      <div className="section-container section-padding text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
          Ready to fix your maintenance workflow?
        </h2>
        <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8">
          Join property managers who save hours every week with PropFix AI. Try the tenant demo or talk to our team.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Link to="/login">
            <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 active:scale-[0.97] transition-all h-12 px-8 text-base font-semibold">
              Login to Demo
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link to="/tenant">
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 active:scale-[0.97] transition-all h-12 px-8 text-base font-semibold">
              Try Tenant Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
