import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout = ({ children }: { children: ReactNode; hideBottomCta?: boolean }) => {
  const { pathname, hash } = useLocation();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } else window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  useEffect(() => {
    const on = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main key={pathname} className="flex-1 animate-fade-in">{children}</main>
      <Footer />
      <button aria-label="Scroll to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 grid h-11 w-11 place-items-center rounded-sm bg-primary text-primary-foreground shadow-[var(--shadow-elevated)] transition-all hover:bg-brand-blue ${showTop ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}>
        <ArrowUp className="h-5 w-5" />
      </button>
    </div>
  );
};
