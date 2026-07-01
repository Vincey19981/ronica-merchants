import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/anim/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    quote:
      "Ronica keeps every quote, compliance document, and delivery note organized enough for committee review.",
    name: "Procurement Officer",
    org: "Public Sector Client",
    role: "Reference on File",
  },
  {
    quote:
      "Quotation arrived on letterhead with full compliance documents inside 24 hours. Delivery matched the agreed schedule item-for-item.",
    name: "Head of Supply Chain",
    org: "County Government Client",
    role: "Reference on File",
  },
  {
    quote:
      "From BOQ submission to GRN sign-off, communication was direct and the paperwork was tender-grade. Exactly what evaluation committees want.",
    name: "Tender Committee Lead",
    org: "Educational Institution",
    role: "Reference on File",
  },
];

export const Testimonials = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile || paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % ITEMS.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section className="bg-background py-20 sm:py-24">
      <div className="container-wide">
        <Reveal>
          <SectionHeader
            eyebrow="Trusted by Organisations Across Kenya"
            title="Tender support built for accountable teams."
            description="Verified procurement feedback from teams that need clear paperwork, dependable supply, and responsive support."
          />
        </Reveal>

        <div
          className="mt-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="hidden md:grid md:grid-cols-3 md:gap-6">
            {ITEMS.map((t, i) => (
              <article
                key={i}
                className={cn(
                  "relative rounded-xl border border-border bg-card p-7 shadow-[var(--shadow-card)] transition-all duration-500",
                  i === active
                    ? "opacity-100 scale-100 border-accent shadow-[var(--shadow-elevated)]"
                    : "opacity-60 scale-[0.97]",
                )}
              >
                <Quote className="h-10 w-10 text-accent/80" strokeWidth={1.5} />
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.quote}</p>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="text-sm font-bold text-primary">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.org} - {t.role}</p>
                </div>
              </article>
            ))}
          </div>

          <article className="md:hidden rounded-xl border border-accent bg-card p-6 shadow-[var(--shadow-elevated)]">
            <Quote className="h-9 w-9 text-accent/80" strokeWidth={1.5} />
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{ITEMS[active].quote}</p>
            <div className="mt-5 border-t border-border pt-4">
              <p className="text-sm font-bold text-primary">{ITEMS[active].name}</p>
              <p className="text-xs text-muted-foreground">{ITEMS[active].org} - {ITEMS[active].role}</p>
            </div>
          </article>

          <div className="mt-8 flex items-center justify-center gap-2.5">
            {ITEMS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  i === active ? "w-8 bg-accent" : "w-2.5 bg-border hover:bg-accent/50",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
