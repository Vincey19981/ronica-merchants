const ITEMS = [
  "Nationwide",
  "24-Hour Quotation Turnaround",
  "ISO-Ready Documentation",
  "Bulk Supply Pricing",
  "PIN & VAT Registered",
];

export const TickerBar = () => (
  <div className="w-full bg-primary py-3">
    <div className="container-wide flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
      {ITEMS.map((t, i) => (
        <span key={t} className="flex items-center gap-x-3">
          <span
            className="text-[12px] font-medium text-accent"
            style={{ letterSpacing: "0.04em" }}
          >
            {t}
          </span>
          {i < ITEMS.length - 1 && (
            <span className="text-accent" aria-hidden>·</span>
          )}
        </span>
      ))}
    </div>
  </div>
);