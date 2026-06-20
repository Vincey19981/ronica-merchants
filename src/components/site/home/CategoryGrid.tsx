import { Link } from "react-router-dom";
import { ArrowRight, FileText, Printer, Armchair, SprayCan, Laptop, Package } from "lucide-react";
import { SectionHeader } from "@/components/site/SectionHeader";

const CATS = [
  {
    icon: FileText,
    name: "Office Stationery",
    body: "Pens, paper, files, envelopes — daily-use essentials.",
    examples: ["A4 paper reams", "Ballpoint pens", "Filing folders"],
  },
  {
    icon: Printer,
    name: "Ink & Toner",
    body: "OEM-equivalent toners for HP, Canon, Epson.",
    examples: ["HP 85A", "Canon 045", "Epson 664 refill"],
  },
  {
    icon: Armchair,
    name: "Office Furniture",
    body: "Executive chairs, desks, conference tables.",
    examples: ["Executive chairs", "L-shaped desks", "4-drawer cabinets"],
  },
  {
    icon: SprayCan,
    name: "Cleaning Supplies",
    body: "Sanitisers, mops, dispensers, washroom care.",
    examples: ["Hand sanitiser 5L", "Mop sets", "Washroom dispensers"],
  },
  {
    icon: Laptop,
    name: "Technology Accessories",
    body: "Peripherals, drives, cables, networking gear.",
    examples: ["USB hubs", "HDMI cables", "Wireless keyboards"],
  },
  {
    icon: Package,
    name: "Packaging & Labelling",
    body: "Tapes, cartons, labels, dispatch supplies.",
    examples: ["Brown tape rolls", "Dispatch labels", "Bubble wrap rolls"],
  },
];

export const CategoryGrid = () => (
  <section className="section-pad bg-surface">
    <div className="container-wide">
      <SectionHeader
        eyebrow="Product Highlights"
        title="One supplier. Every category."
        description="A single LPO covers your entire office — from a ream of A4 to a 12-seat boardroom."
      />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATS.map((c) => (
          <Link
            key={c.name}
            to="/products"
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
                Explore <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);