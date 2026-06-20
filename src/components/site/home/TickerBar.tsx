const ITEMS = [
  "Nationwide",
  "24-Hour Quotation Turnaround",
  "ISO-Ready Documentation",
  "Bulk Supply Pricing",
  "PIN Registered",
];

export const TickerBar = () => (
  <div className="bg-primary-dark border-y border-accent/20 py-3">
    <div className="container-wide flex flex-wrap items-center justify-center gap-2 sm:justify-between sm:gap-4">
      {ITEMS.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {t}
        </span>
      ))}
    </div>
  </div>
);