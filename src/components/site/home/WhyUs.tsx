import { ShieldCheck, Banknote, Truck, PackageSearch } from "lucide-react";
import { Reveal } from "@/components/anim/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";

const ITEMS = [
  { icon: ShieldCheck, title: "Tender Compliance", body: "PIN, VAT, CR12 & tax certificates ready on request." },
  { icon: Banknote, title: "Competitive Pricing", body: "Bulk supply rates with transparent BOQ breakdowns." },
  { icon: Truck, title: "Fast Delivery", body: "Nairobi same-day. Upcountry within 48 hours." },
  { icon: PackageSearch, title: "Full Range", body: "Stationery, furniture, toner, cleaning — one LPO." },
];

export const WhyUs = () => (
  <section className="bg-background py-20 sm:py-24">
    <div className="container-wide">
      <Reveal>
        <SectionHeader
          eyebrow="Why Procurement Officers Choose Us"
          title="Built for tenders, not retail."
          description="Pricing, paperwork, delivery — every step is designed to help your evaluation committee say yes."
        />
      </Reveal>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 100}>
            <article className="group relative h-full overflow-hidden rounded-xl border border-border bg-card p-6 pl-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]">
              <span className="absolute inset-y-0 left-0 w-1 bg-accent transition-all duration-300 group-hover:w-1.5 group-hover:shadow-[0_0_18px_hsl(var(--accent))]" />
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-transform duration-300 group-hover:rotate-[5deg] group-hover:bg-accent group-hover:text-accent-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);