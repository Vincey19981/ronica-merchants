import { ReactNode } from "react";

export const PageHero = ({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) => (
  <section className="hero-pattern text-white">
    <div className="container-wide py-16 sm:py-24">
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      )}
      <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl gold-underline">{title}</h1>
      {children && <div className="mt-6 max-w-2xl text-white/80 text-lg">{children}</div>}
    </div>
  </section>
);