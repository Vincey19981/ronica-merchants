import { Link } from "react-router-dom";

/** Framed serif R: gold frame and letter; works on light and dark surfaces. */
export const LogoMark = ({ className = "h-10 w-10" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" className={className} aria-hidden>
    <rect x="1" y="1" width="38" height="38" fill="none" className="stroke-accent" strokeWidth="1.5" />
    <text x="20" y="29" textAnchor="middle" className="fill-accent" style={{ font: "500 26px Newsreader, Georgia, serif" }}>R</text>
    <path d="M24 22 L33 9" className="stroke-accent" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const Logo = ({ light = false }: { light?: boolean }) => (
  <Link to="/" className="inline-flex shrink-0 items-center gap-3" aria-label="Ronica Merchants Limited home">
    <LogoMark />
    <span className="flex flex-col leading-none">
      <span className={`font-serif text-[17px] font-medium tracking-[0.16em] ${light ? "text-primary-foreground" : "text-primary"}`} style={{ fontFamily: "Newsreader, Georgia, serif" }}>
        RONICA MERCHANTS
      </span>
      <span className={`mt-1.5 text-[9px] font-semibold uppercase tracking-[0.42em] ${light ? "text-primary-foreground/60" : "text-muted-foreground"}`}>Limited</span>
    </span>
  </Link>
);
