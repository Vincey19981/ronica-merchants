import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Banknote,
  Truck,
  PackageSearch,
  FileText,
  ClipboardCheck,
  Building2,
  PackageCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/site/Layout";
import { SectionHeader } from "@/components/site/SectionHeader";
import { CATEGORY_ICONS } from "@/data/products";

const trustBadges = [
  "PIN Registered",
  "VAT Compliant",
  "ISO-Ready Documentation",
  "LPO & Tender Ready",
];

const whyUs = [
  { icon: ShieldCheck, title: "Tender Compliance", body: "Full documentation including PIN, VAT, CR12, and tax compliance certificates ready on request." },
  { icon: Banknote, title: "Competitive Pricing", body: "Bulk supply pricing with transparent unit cost breakdowns for BOQ submissions." },
  { icon: Truck, title: "Fast Delivery", body: "Nairobi same-day delivery. Upcountry within 48 hours, fully tracked." },
  { icon: PackageSearch, title: "Full Product Range", body: "Stationery, furniture, toner, cleaning supplies — one trusted supplier, one LPO." },
];

const categories = [
  { name: "Office Stationery & Paper", key: "Stationery" },
  { name: "Ink, Toner & Printer Supplies", key: "Toner & Ink" },
  { name: "Office Furniture & Seating", key: "Furniture" },
  { name: "Cleaning & Breakroom Supplies", key: "Cleaning" },
  { name: "Technology Accessories", key: "Technology" },
  { name: "Packaging & Labelling", key: "Packaging" },
];

const steps = [
  { icon: FileText, title: "Submit Enquiry or BOQ", body: "Email or upload your tender document and item list." },
  { icon: ClipboardCheck, title: "Receive Formal Quotation", body: "On letterhead, line-by-line, within 24 business hours." },
  { icon: Building2, title: "LPO / Award Confirmation", body: "We confirm scope, lead time and delivery schedule." },
  { icon: PackageCheck, title: "Delivery + Compliance Docs", body: "Goods, invoice, delivery note, and GRN delivered together." },
];

const Home = () => (
  <Layout>
    {/* Hero */}
    <section className="hero-pattern text-white">
      <div className="container-wide grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Kenyan B2B Procurement Partner
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Your Trusted Partner in <span className="text-accent">Office Supply Tenders</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/80">
            Supplying government ministries, county offices, schools, and corporates across Kenya
            with quality office products — on time, within budget, fully compliant.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="gold" size="lg">
              <Link to="/products">View Our Products <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="goldOutline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              <Link to="/contact">Submit Tender Enquiry</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap gap-2.5">
            {trustBadges.map((b) => (
              <span key={b} className="inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur">
                <CheckCircle2 className="h-3.5 w-3.5 text-accent" /> {b}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 hidden lg:block">
          <div className="relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-2xl">
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
                  <span>{n}</span><span className="text-white/60">{q}</span>
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

    {/* Why Us */}
    <section className="bg-background py-20">
      <div className="container-wide">
        <SectionHeader
          eyebrow="Why Procurement Officers Choose Us"
          title="Built for tenders, not retail."
          description="Every part of our process — pricing, paperwork, delivery — is designed to help your evaluation committee say yes."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyUs.map(({ icon: Icon, title, body }) => (
            <div key={title} className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent hover:shadow-[var(--shadow-card)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-primary">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Categories */}
    <section className="bg-surface py-20">
      <div className="container-wide">
        <SectionHeader eyebrow="Product Highlights" title="One supplier. Every category." />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.name}
              to="/products"
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="flex h-36 items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 text-5xl">
                <span aria-hidden>{CATEGORY_ICONS[c.key]}</span>
              </div>
              <div className="border-t border-border p-5">
                <h3 className="font-bold text-primary">{c.name}</h3>
                <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:gap-2 transition-all">
                  View Products <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* Tender Process */}
    <section className="bg-primary text-primary-foreground py-20">
      <div className="container-wide">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Our 4-Step Tender Process</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">From enquiry to delivery — predictable, documented, fast.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-xl border border-white/10 bg-white/5 p-6">
              <div className="absolute -top-3 -left-3 flex h-9 w-9 items-center justify-center rounded-md bg-accent font-bold text-accent-foreground">
                {i + 1}
              </div>
              <s.icon className="h-7 w-7 text-accent" />
              <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-white/70">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="bg-background py-20">
      <div className="container-wide">
        <SectionHeader
          eyebrow="Trusted by organizations across Kenya"
          title="What our clients will say."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative rounded-xl border border-border bg-card p-7 shadow-[var(--shadow-card)]">
              <span className="absolute right-4 top-4 rounded bg-accent-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                Coming Soon
              </span>
              <p className="text-4xl font-serif text-accent leading-none">“</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Real testimonials from our procurement clients will appear here as we collect them. We are
                committed to transparency and only publish verified feedback.
              </p>
              <div className="mt-6 border-t border-border pt-4">
                <p className="text-sm font-bold text-primary">Procurement Officer</p>
                <p className="text-xs text-muted-foreground">Public Sector Client</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Home;