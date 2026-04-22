import { CountUp } from "@/components/anim/CountUp";

const STATS = [
  { end: 500, suffix: "+", label: "Products Supplied" },
  { end: 24, suffix: "hr", label: "Quotation Turnaround" },
  { end: 100, suffix: "+", label: "Clients Served" },
  { end: 5, suffix: "+", label: "Years in Operation" },
];

export const StatsCounter = () => (
  <section className="bg-primary-dark py-16 sm:py-20">
    <div className="container-wide">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="text-center sm:text-left">
            <div className="text-5xl font-extrabold tracking-tight text-accent sm:text-6xl">
              <CountUp end={s.end} suffix={s.suffix} />
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