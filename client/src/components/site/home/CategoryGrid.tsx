import { Link } from "react-router-dom";
import { ArrowRight, FileText, Printer, Laptop, Network, ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/site/SectionHeader";

const CATS = [
  {
    icon: FileText,
    name: "Office Stationery",
    body: "Paper, files, pens and daily office supplies.",
    examples: ["A4 paper", "Office files", "Writing supplies"],
  },
  {
    icon: Printer,
    name: "Printer Consumables",
    body: "Toner, ink and related printer supplies.",
    examples: ["HP toner", "Ink bottles", "Printer accessories"],
  },
  {
    icon: Laptop,
    name: "Computers & Accessories",
    body: "Computers, peripherals and office IT accessories.",
    examples: ["Laptops", "Keyboards", "Storage drives"],
  },
  {
    icon: Network,
    name: "Networking Equipment",
    body: "Routers, switches, cables and network accessories.",
    examples: ["Switches", "Routers", "Network cables"],
  },
  {
    icon: ShieldCheck,
    name: "Software & Antivirus",
    body: "Software licences and endpoint protection requests.",
    examples: ["Antivirus", "Office software", "Licences"],
  },
];

export const CategoryGrid = () => (
  <section className="section-pad bg-surface">
    <div className="container-wide">
      <SectionHeader
        eyebrow="Product Highlights"
        title="Grouped for quotation requests."
        description="Request a quote by category, or send a BOQ and we will respond line by line within 24 hours."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATS.map((c) => (
          <Link
            key={c.name}
            to={`/request-quote?category=${encodeURIComponent(c.name)}`}
            className="relative block h-full border border-border bg-primary text-white"
            style={{ borderRadius: "6px" }}
          >
            <div className="flex h-36 items-center justify-center border-b border-white/10">
              <c.icon className="h-12 w-12 text-accent" strokeWidth={1.4} />
            </div>
            <div className="p-5">
              <h3 className="text-white" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>{c.name}</h3>
              <p className="mt-1 text-xs text-white/60">{c.body}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.examples.map((ex) => (
                  <span
                    key={ex}
                    className="bg-white/10 px-2 py-0.5 text-[11px] text-white/80"
                    style={{ borderRadius: "6px" }}
                  >
                    {ex}
                  </span>
                ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-accent">
                Request a Quote <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);