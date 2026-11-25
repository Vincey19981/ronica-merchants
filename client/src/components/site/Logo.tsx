import { Link } from "react-router-dom";

export const LogoMark = ({ className = "h-8 w-8" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden>
    <rect width="32" height="32" rx="6" className="fill-primary" />
    <path d="M9 23V9h8a4.5 4.5 0 0 1 0 9h-8" fill="none" className="stroke-primary-foreground" strokeWidth="2.6" strokeLinejoin="round" />
    <path d="M17 18l6 5" className="stroke-accent" strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

export const Logo = ({ light = false }: { light?: boolean }) => (
  <Link to="/" className="inline-flex shrink-0 items-center gap-2.5" aria-label="Ronica Merchants Limited home">
    <LogoMark className={`h-8 w-8 ${light ? "rounded-md ring-1 ring-primary-foreground/20" : ""}`} />
    <span className="flex flex-col leading-none">
      <span className={`text-lg font-extrabold tracking-[0.2em] ${light ? "text-primary-foreground" : "text-primary"}`}>RONICA</span>
      <span className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.28em] ${light ? "text-primary-foreground/60" : "text-muted-foreground"}`}>Merchants Limited</span>
    </span>
  </Link>
);
