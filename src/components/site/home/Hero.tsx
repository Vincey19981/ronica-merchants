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

    <div className="container-wide relative z-10 grid min-h-[100svh] gap-12 py-24 lg:grid-cols-12 lg:py-28">
      <div className="lg:col-span-8 flex flex-col justify-center">
        <p
          className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent opacity-0"
          style={{ animation: "fade-up 0.6s ease-out 0.1s both" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Kenyan B2B Procurement Partner
        </p>

        <h1 className="mt-6 font-extrabold leading-[1.05] text-[2.75rem] sm:text-6xl lg:text-[4rem]">
          <span
            className="block opacity-0"
            style={{ animation: "fade-up 0.7s ease-out 0.25s both" }}
          >
            Your Trusted Partner
          </span>
          <span
            className="block opacity-0"
            style={{ animation: "fade-up 0.7s ease-out 0.45s both" }}
          >
            in <span className="text-accent">Office Supply Tenders</span>
          </span>
        </h1>

        <p
          className="mt-7 max-w-2xl text-lg text-white/75 opacity-0"
          style={{ animation: "fade-up 0.7s ease-out 0.75s both" }}
        >
          We supply government ministries, county offices, schools and corporates across Kenya —
          on time, within budget, fully compliant.
        </p>

        <div
          className="mt-9 flex flex-col gap-3 opacity-0 sm:flex-row"
          style={{ animation: "fade-up 0.7s ease-out 1s both" }}
        >
          <Button asChild variant="gold" size="lg" className="btn-glow transition-transform hover:scale-[1.02]">
            <Link to="/products">
              Browse Catalogue <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 bg-white/5 text-white backdrop-blur hover:border-accent hover:bg-accent hover:text-accent-foreground"
          >
            <Link to="/contact">Submit Tender Enquiry</Link>
          </Button>
        </div>
      </div>

      <div
        className="lg:col-span-4 hidden lg:flex items-center opacity-0"
        style={{ animation: "scale-in 0.8s ease-out 0.6s both" }}
      >
        <div className="relative w-full rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-2xl">
          <div className="absolute -top-3 left-6 rounded bg-accent px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-accent-foreground">
            Quotation Ref · Sample
          </div>
          <p className="text-xs uppercase tracking-wider text-white/60">Ronica Merchants Ltd</p>
          <p className="mt-1 text-sm font-semibold">Quotation #RM-2025-0042</p>
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

    {/* Scroll cue */}
    <div className="absolute inset-x-0 bottom-6 z-10 hidden justify-center text-white/40 lg:flex">
      <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-accent/60 to-transparent animate-pulse" />
    </div>
  </section>
);