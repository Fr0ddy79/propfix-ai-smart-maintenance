import { Link } from "react-router-dom";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "API", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  Solutions: [
    { label: "Property Managers", href: "#features" },
    { label: "HOA Management", href: "#" },
    { label: "Student Housing", href: "#" },
    { label: "Commercial", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "mailto:hello@propfix.ai" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security", href: "#" },
    { label: "GDPR", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="py-16 bg-foreground">
      <div className="section-container section-padding">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">P</span>
              </div>
              <span className="font-bold text-lg text-primary-foreground">PropFix AI</span>
            </Link>
            <p className="text-sm text-muted-foreground/60">
              AI-powered property maintenance coordination for modern teams.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-primary-foreground mb-3">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground/60 hover:text-primary-foreground/80 transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-primary-foreground/10 text-center">
          <p className="text-sm text-muted-foreground/40">© 2026 PropFix AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
