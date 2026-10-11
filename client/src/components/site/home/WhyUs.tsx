import { ShieldCheck, FileText, Clock, LayoutGrid } from "lucide-react";
import { SectionHeader } from "@/components/site/SectionHeader";

const ITEMS = [
  { icon: Clock, title: "Quotes within 24 hours", body: "Send your list, BOQ or LPO requirements and receive a clear quotation." },
  { icon: FileText, title: "LPO and BOQ ready", body: "Line items are prepared for tender review and procurement records." },
  { icon: ShieldCheck, title: "Tax documentation", body: "KRA PIN registered, eTIMS-compliant and tax compliant documents available on request." },
  { icon: LayoutGrid, title: "Tender supply range", body: "Stationery, printer consumables, IT equipment, networking and software under one request." },
];

export const WhyUs = () => (
  <section className="section-pad bg-background">
    <div className="container-wide">
      <SectionHeader
        eyebrow="Why Procurement Teams Choose Us"
        title="Built for tender quotations."
        description="Clear requirements, documented quotations, and a practical supply range for public and private buyers."
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