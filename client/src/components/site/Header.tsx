import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { NAV_LINKS } from "@/lib/site";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [loc.pathname]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  return (
    <header className={`sticky top-0 z-[100] w-full border-b bg-background/95 backdrop-blur transition-shadow ${scrolled ? "border-border shadow-[var(--shadow-card)]" : "border-transparent"}`}>
      <div className="container-wide flex h-[72px] items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"}
              className={({ isActive }) => `relative px-3 py-2 text-sm font-medium transition-colors after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-accent after:transition-transform ${isActive ? "text-primary after:scale-x-100" : "text-muted-foreground hover:text-primary after:scale-x-0 hover:after:scale-x-100"}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:block">
          <Button asChild variant="navy" size="sm"><Link to="/contact">Discuss a Project</Link></Button>
        </div>
        <button className="p-2 text-primary lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {open && createPortal(
        <div className="fixed inset-0 z-[110] lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-primary/60" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-primary text-primary-foreground" style={{ animation: "slide-in-right 240ms ease-out" }}>
            <div className="flex h-[72px] items-center justify-between border-b border-primary-foreground/10 px-6">
              <Logo light />
              <button onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-6 w-6" /></button>
            </div>
            <nav className="flex flex-1 flex-col px-6 py-6" aria-label="Mobile">
              {NAV_LINKS.map((l, i) => (
                <Link key={l.to} to={l.to} className={`flex items-baseline gap-4 border-b border-primary-foreground/10 py-4 text-xl font-semibold ${loc.pathname === l.to ? "text-accent" : ""}`}>
                  <span className="text-xs text-primary-foreground/40">0{i + 1}</span>{l.label}
                </Link>
              ))}
            </nav>
            <div className="p-6"><Button asChild variant="gold" className="w-full"><Link to="/contact">Discuss a Project</Link></Button></div>
          </div>
        </div>,
        document.body,
      )}
    </header>
  );
};
