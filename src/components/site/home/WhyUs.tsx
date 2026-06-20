import { ShieldCheck, BarChart2, Truck, LayoutGrid } from "lucide-react";
import { SectionHeader } from "@/components/site/SectionHeader";

const ITEMS = [
  { icon: ShieldCheck, title: "Tender Compliance", body: "PIN, VAT, CR12 & tax certificates ready on request." },
  { icon: BarChart2, title: "Competitive Pricing", body: "Bulk supply rates with transparent BOQ breakdowns." },
  { icon: Truck, title: "Fast Delivery", body: "Nairobi same-day. Upcountry within 48 hours." },
  { icon: LayoutGrid, title: "Full Range", body: "Stationery, furniture, toner, cleaning — one LPO." },
];

export const WhyUs = () => (
  <section className="section-pad bg-background">
    <div className="container-wide">
      <SectionHeader
        eyebrow="Why Procurement Officers Choose Us"
        title="Built for tenders, not retail."
        description="Pricing, paperwork, delivery — every step is designed to help your evaluation committee say yes."
      />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, body }) => (
          <article
            key={title}
            className="relative h-full border border-border bg-card p-6 pl-7"
            style={{ borderRadius: "6px" }}
          >
            <span className="absolute inset-y-0 left-0 w-1 bg-accent" />
            <div className="flex h-12 w-12 items-center justify-center bg-accent/10 text-accent" style={{ borderRadius: "6px" }}>
              <Icon className="h-6 w-6" strokeWidth={1.6} />
            </div>
            <h3 className="mt-5 text-lg text-primary" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);