const STATS = [
  { value: "500+", label: "Products Supplied" },
  { value: "24hr", label: "Quotation Turnaround" },
  { value: "100+", label: "Clients Served" },
  { value: "5+", label: "Years in Operation" },
];

export const StatsCounter = () => (
  <section className="section-pad bg-primary-dark">
    <div className="container-wide">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center sm:text-left">
            <div className="text-5xl tracking-tight text-accent sm:text-6xl" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>
              {s.value}
            </div>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-white/75">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);