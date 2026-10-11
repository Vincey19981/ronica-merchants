import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/anim/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";

const ITEMS = [
  "Office stationery and paper supplies",
  "Printer consumables and accessories",
  "Computers, accessories and networking equipment",
  "Software and antivirus supply support",
  "Formal quotations for LPO and BOQ review",
  "Compliance documents available on request",
];

export const Testimonials = () => (
  <section className="bg-background py-20 sm:py-24">
    <div className="container-wide">
      <Reveal>
        <SectionHeader
          eyebrow="Tender Supply Coverage"
          title="A practical catalogue for accountable teams."
          description="Ronica Merchants keeps the public website focused on what buyers need to request a quote, without publishing private client or tender information."
        />
      </Reveal>

      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-lg border border-border bg-card px-5 py-4 shadow-[var(--shadow-card)]">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
            <span className="font-medium text-primary">{item}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);