import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, FileText, Calculator, FileSignature, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/site/SectionHeader";

const supplies = [
  "Office stationery for offices and schools",
  "Printer consumables and accessories",
  "Computers and office IT accessories",
  "Networking equipment and cabling",
  "Software and antivirus requirements",
];

const workflow = [
  { icon: FileText, title: "Share your BOQ or item list", body: "Use the quote form and attach a BOQ file when available." },
  { icon: Calculator, title: "We prepare a clear quotation", body: "Line items and quantities are organised for LPO or tender review." },
  { icon: FileSignature, title: "You review and confirm", body: "We clarify specifications, quantities and deadlines before supply." },
  { icon: Receipt, title: "Documentation on request", body: "KRA PIN registered, eTIMS-compliant and tax compliant documents are shared directly when required." },
];

const docs = [
  "Formal quotation",
  "KRA PIN registered documentation",
  "Tax compliance documentation",
  "eTIMS-compliant documentation",
  "Compliance documents available on request",
];

const TenderServices = () => (
  <Layout>
    <PageHero eyebrow="Tender Services" title="Quotations for LPO and BOQ requests.">
      Ronica Merchants supports government offices, county offices, schools,
      NGOs and corporates with clear supply quotations across Kenya.
    </PageHero>

    <section className="bg-background py-20">
      <div className="container-tight">
        <SectionHeader eyebrow="Tender Categories We Supply" title="What we quote for." />
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
        <SectionHeader eyebrow="How We Work" title="A simple quotation workflow." />
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
          eyebrow="Compliance"
          title="Compliance documents available on request."
          description="We keep sensitive registration, banking and personal information off the public website."
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
        <h2 className="text-3xl font-bold sm:text-4xl">Have a tender, LPO or BOQ?</h2>
        <p className="mt-4 text-primary-foreground/80">Send the requirements and we will reply within 24 hours.</p>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="gold" size="lg">
            <Link to="/request-quote">Request a Quote <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  </Layout>
);

export default TenderServices;