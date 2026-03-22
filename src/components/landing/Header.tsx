import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Product", href: "#features" },
  { label: "Solutions", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Demo", href: "/tenant" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--landing-bg))]/80 backdrop-blur-lg border-b border-border/50">
      <div className="section-container section-padding">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-lg text-foreground">PropFix AI</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.href.startsWith("/") ? (
                <Link key={link.label} to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ) : (
                <a key={link.label} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </a>
              )
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/app/dashboard">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-all">
                Start Free Trial — It's Free
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                link.href.startsWith("/") ? (
                  <Link key={link.label} to={link.href} className="text-sm text-muted-foreground hover:text-foreground px-2 py-1.5" onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </Link>
                ) : (
                  <a key={link.label} href={link.href} className="text-sm text-muted-foreground hover:text-foreground px-2 py-1.5" onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </a>
                )
              ))}
              <Link to="/app/dashboard" onClick={() => setMobileOpen(false)}>
                <Button className="w-full mt-2 bg-primary text-primary-foreground">Start Free Trial — It's Free</Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
