import { FileText, ClipboardCheck, Building2, PackageCheck } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const STEPS = [
  { icon: FileText, title: "Submit Enquiry / BOQ", body: "Email or upload your tender document." },
  { icon: ClipboardCheck, title: "Receive Formal Quotation", body: "On letterhead, line-by-line, within 24 hours." },
  { icon: Building2, title: "LPO / Award Confirmation", body: "We confirm scope, lead time and schedule." },
  { icon: PackageCheck, title: "Delivery + Compliance Docs", body: "Goods, invoice, delivery note & GRN together." },
];

export const ProcessTimeline = () => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  return (
    <section className="bg-primary text-primary-foreground py-20 sm:py-24">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Our 4-Step Tender Process</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">From enquiry to delivery — predictable, documented, fast.</h2>
        </div>

        <div ref={ref} className="relative mt-16">
          {/* connector */}
          <div className="absolute left-0 right-0 top-7 hidden h-[2px] origin-left bg-accent/80 md:block"
               style={{
                 transform: inView ? "scaleX(1)" : "scaleX(0)",
                 transition: "transform 1.4s ease-out",
               }}
          />
          <ol className="relative grid gap-10 md:grid-cols-4 md:gap-6">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex flex-col items-start md:items-center md:text-center">
                <div
                  className={cn(
                    "relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent bg-primary-dark text-accent transition-all duration-500",
                    inView ? "animate-pop-in opacity-100" : "opacity-0 scale-50",
                  )}
                  style={{ animationDelay: inView ? `${300 + i * 280}ms` : undefined }}
                >
                  <s.icon className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold">{s.title}</h3>
                <p className="mt-1 max-w-[14rem] text-sm text-white/65">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};