import { Marquee } from "@/components/anim/Marquee";

const ITEMS = [
  "PIN Registered",
  "VAT Compliant",
  "Tax Compliant",
  "LPO & Tender Ready",
  "Fast Delivery Nationwide",
  "24-Hour Quotation Turnaround",
  "ISO-Ready Documentation",
  "Bulk Supply Pricing",
];

export const TickerBar = () => (
  <div className="bg-primary-dark border-y border-accent/20 py-3">
    <Marquee>
      {ITEMS.map((t) => (
        <span
          key={t}
          className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {t}
        </span>
      ))}
    </Marquee>
  </div>
);