import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, FileText, Calculator, FileSignature, Truck, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/site/SectionHeader";

const supplies = [
  "Full stationery packages for offices and schools",
  "Ink and toner for entire printer fleets",
  "Office furniture for new office setups",
  "Cleaning and hygiene supplies in bulk",
  "Technology accessories and peripherals",
  "Branded items (notebooks, pens, folders)",
];

const workflow = [
  { icon: FileText, title: "You share your BOQ or tender specs", body: "Email or upload the document — we accept PDF, Excel, or scanned copies." },
  { icon: Calculator, title: "We price every line item", body: "Unit costs and bulk discounts shown clearly, ready for committee evaluation." },
  { icon: FileSignature, title: "Formal quotation on letterhead", body: "Issued with all required tender attachments — PIN, VAT, CR12, TCC." },
  { icon: Truck, title: "On-award delivery", body: "Strict adherence to your delivery schedule, with tracking and proof of delivery." },
  { icon: Receipt, title: "Complete documentation", body: "Tax invoice, delivery note, and GRN issued together for clean accounting." },
];

const docs = [
  "Formal Quotation on Company Letterhead",
  "PIN Certificate",
  "VAT Registration Certificate",
  "Certificate of Incorporation",
  "CR12 (Company Registry Extract)",
  "Tax Compliance Certificate (KRA)",
  "Bank Details on Official Letterhead",
  "Company Profile",
  "AGPO Certificate (if applicable)",
];

const TenderServices = () => (
  <Layout>
    <PageHero eyebrow="Tender Services" title="We Understand Tenders.">
      Ronica Merchants has the documentation, pricing structure, and delivery
      capability to fulfil public and private sector tenders across Kenya.
    </PageHero>

    <section className="bg-background py-20">
      <div className="container-tight">
        <SectionHeader eyebrow="Tender Categories We Supply" title="What we deliver under tender." />
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {supplies.map((s) => (
            <div key={s} className="flex items-start gap-3 rounded-lg border border-border bg-card p-5">
              <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0 text-success" />
              <span className="text-primary font-medium">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-surface py-20">
      <div className="container-tight">
        <SectionHeader eyebrow="How We Work" title="A predictable, documented workflow." />
        <ol className="mt-12 space-y-5">
          {workflow.map((w, i) => (
            <li key={w.title} className="flex gap-5 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
                {i + 1}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <w.icon className="h-5 w-5 text-accent" />
                  <h3 className="text-lg font-bold text-primary">{w.title}</h3>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{w.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section className="bg-background py-20">
      <div className="container-tight">
        <SectionHeader
          eyebrow="Documents We Provide on Request"
          title="A complete tender compliance pack."
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {docs.map((d) => (
            <div key={d} className="flex items-center gap-3 rounded-lg border border-border bg-card px-5 py-4">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
              <span className="font-medium text-primary">{d}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-primary text-primary-foreground py-20">
      <div className="container-tight text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Have a tender or LPO? Contact us now.</h2>
        <p className="mt-4 text-primary-foreground/80">We respond to all enquiries within 24 business hours.</p>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="gold" size="lg">
            <Link to="/contact">Submit Your BOQ / Tender Enquiry <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  </Layout>
);

export default TenderServices;