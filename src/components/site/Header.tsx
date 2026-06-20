import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { TopBar } from "./TopBar";
import { NAV_LINKS, SITE } from "@/lib/site";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-[100] w-full">
      <TopBar />
      <div
        className="border-b border-border transition-colors duration-200"
        style={
          scrolled
            ? { background: "rgba(13, 27, 62, 0.97)", backdropFilter: "blur(8px)", borderColor: "transparent" }
            : { background: "hsl(var(--background))" }
        }
      >
        <div className="container-wide flex h-16 items-center justify-between gap-4">
          <Logo />
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium transition-colors duration-[150ms] ${
                    isActive
                      ? scrolled ? "text-accent" : "text-primary"
                      : scrolled ? "text-white/85 hover:text-accent" : "text-muted-foreground hover:text-primary"
                  }`
                }
                style={{ borderRadius: "6px" }}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <a
              href={SITE.phoneHref}
              className={`hidden xl:flex items-center gap-1.5 text-sm font-medium ${scrolled ? "text-white" : "text-primary"}`}
            >
              <Phone className="h-4 w-4 text-accent" />
              {SITE.phone}
            </a>
            <Button asChild variant="gold" size="sm">
              <Link to="/request-quote">Request a Quote</Link>
            </Button>
          </div>
          <button
            className="lg:hidden p-2 text-accent"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Mobile slide-in panel */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-[110]">
          <div
            className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-primary text-white shadow-2xl"
            style={{ animation: "slide-in-right 220ms ease-out" }}
          >
            <div className="flex h-16 items-center justify-between px-5 border-b border-white/10">
              <span className="text-sm font-medium uppercase tracking-wider text-accent">Menu</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col px-2 py-3">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`flex h-12 items-center px-4 text-[18px] ${loc.pathname === l.to ? "text-accent" : "text-white"}`}
                >
                  {l.label}
                </Link>
              ))}
              <Button asChild variant="gold" className="mx-4 mt-4">
                <Link to="/request-quote" onClick={() => setOpen(false)}>Request a Quote</Link>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};