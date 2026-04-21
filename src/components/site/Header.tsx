import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { TopBar } from "./TopBar";
import { NAV_LINKS, SITE } from "@/lib/site";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full">
      <TopBar />
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container-wide flex h-16 items-center justify-between gap-4">
          <Logo />
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary bg-secondary"
                      : "text-muted-foreground hover:text-primary hover:bg-secondary/60"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <a
              href={SITE.phoneHref}
              className="hidden xl:flex items-center gap-1.5 text-sm font-semibold text-primary"
            >
              <Phone className="h-4 w-4 text-accent" />
              {SITE.phone}
            </a>
            <Button asChild variant="gold" size="sm">
              <Link to="/contact">Request a Quote</Link>
            </Button>
          </div>
          <button
            className="lg:hidden rounded-md p-2 text-primary"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="container-wide flex flex-col py-3">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-sm font-medium ${
                    loc.pathname === l.to
                      ? "bg-secondary text-primary"
                      : "text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Button asChild variant="gold" className="mt-3">
                <Link to="/contact" onClick={() => setOpen(false)}>
                  Request a Quote
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};