import { Link } from "react-router-dom";
import { ArrowRight, FileText, Printer, Armchair, SprayCan, Laptop, PackageOpen } from "lucide-react";
import { Reveal } from "@/components/anim/Reveal";
import { SectionHeader } from "@/components/site/SectionHeader";

const CATS = [
  { icon: FileText, name: "Office Stationery & Paper", body: "Pens, paper, files, envelopes — daily-use essentials." },
  { icon: Printer, name: "Ink, Toner & Printer Supplies", body: "OEM-equivalent toners for HP, Canon, Epson." },
  { icon: Armchair, name: "Office Furniture & Seating", body: "Executive chairs, desks, conference tables." },
  { icon: SprayCan, name: "Cleaning & Breakroom Supplies", body: "Sanitisers, mops, dispensers, washroom care." },
  { icon: Laptop, name: "Technology Accessories", body: "Printers, USB drives, peripherals, cables." },
  { icon: PackageOpen, name: "Packaging & Labelling", body: "Tapes, cartons, labels, dispatch supplies." },
];

export const CategoryGrid = () => (
  <section className="bg-surface py-20 sm:py-24">
    <div className="container-wide">
      <Reveal>
        <SectionHeader
          eyebrow="Product Highlights"
          title="One supplier. Every category."
          description="A single LPO covers your entire office — from a ream of A4 to a 12-seat boardroom."
        />
      </Reveal>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CATS.map((c, i) => (
          <Reveal key={c.name} delay={i * 80}>
            <Link
              to="/products"
              className="group relative block h-full overflow-hidden rounded-xl border border-border bg-primary text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)]"
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-30 transition-opacity duration-500 group-hover:opacity-50"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 80% 20%, hsl(43 81% 46% / 0.55), transparent 55%), linear-gradient(135deg, hsl(224 60% 16%), hsl(224 57% 26%))",
                }}
              />
              <div className="relative flex h-44 items-center justify-center">
                <c.icon className="h-14 w-14 text-accent transition-transform duration-500 group-hover:scale-110" strokeWidth={1.4} />
              </div>
              <div className="relative border-t border-white/10 bg-primary-dark/40 p-5 backdrop-blur">
                <h3 className="font-bold text-white">{c.name}</h3>
                <p className="mt-1 text-xs text-white/60">{c.body}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-accent transition-all group-hover:gap-2">
                  Explore <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);