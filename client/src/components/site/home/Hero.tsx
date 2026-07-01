import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => (
  <section className="hero-grid relative isolate min-h-[100svh] overflow-hidden text-white">
    {/* Soft drifting overlay */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen"
      style={{
        backgroundImage:
          "radial-gradient(circle at 30% 20%, hsl(43 81% 56% / 0.08), transparent 45%), radial-gradient(circle at 75% 70%, hsl(220 60% 50% / 0.10), transparent 50%)",
      }}
    />

    {/* Gold geometric grid + diagonal texture */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(rgba(201,168,76,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.07) 1px, transparent 1px), repeating-linear-gradient(45deg, rgba(201,168,76,0.04) 0 1px, transparent 1px 22px)",
        backgroundSize: "44px 44px, 44px 44px, auto",
        maskImage:
          "radial-gradient(ellipse at center, black 40%, transparent 85%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 40%, transparent 85%)",
      }}
    />

    <div className="container-wide relative z-10 grid min-h-[100svh] gap-12 py-24 lg:grid-cols-12 lg:py-28">
      <div className="lg:col-span-8 flex flex-col justify-center">
        <p
          className="inline-flex w-fit items-center gap-2 border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent"
          style={{ borderRadius: "6px" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Kenyan B2B Procurement Partner
        </p>

        <h1 className="mt-6 leading-[1.05] text-[2.75rem] sm:text-6xl lg:text-[4rem]" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>
          <span className="block">Your Trusted Partner</span>
          <span className="block">in <span className="text-accent">Office Supply Tenders</span></span>
        </h1>

        <p className="mt-7 max-w-2xl text-lg text-white/75">
          We supply government ministries, county offices, schools and corporates across Kenya —
          on time, within budget, fully compliant.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="gold" size="lg">
            <Link to="/products">
              Browse Catalogue <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white bg-transparent text-white transition-colors duration-[180ms] hover:bg-white hover:text-primary"
          >
            <Link to="/contact">Submit Tender Enquiry</Link>
          </Button>
        </div>
      </div>

      <div className="lg:col-span-4 hidden lg:flex items-center">
        <div className="relative w-full border border-white/10 bg-white/5 p-6" style={{ borderRadius: "6px" }}>
          <div className="absolute -top-3 left-6 bg-accent px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-primary" style={{ borderRadius: "6px" }}>
            Quotation Ref · Sample
          </div>
          <p className="text-xs uppercase tracking-wider text-white/60">Ronica Merchants Ltd</p>
          <p className="mt-1 text-sm font-medium">Quotation #RM-2025-0042</p>
          <div className="mt-5 space-y-2 text-sm">
            {[
              ["A4 Copy Paper 80gsm", "200 reams"],
              ["HP 85A Toner", "40 units"],
              ["Executive Chair", "12 units"],
              ["Hand Sanitiser 500ml", "60 units"],
            ].map(([n, q]) => (
              <div key={n} className="flex justify-between border-b border-white/10 pb-1.5 text-white/85">
                <span>{n}</span>
                <span className="text-white/60">{q}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 text-xs text-accent">
            <ShieldCheck className="h-4 w-4" /> Compliance pack attached
          </div>
        </div>
      </div>
    </div>
  </section>
);