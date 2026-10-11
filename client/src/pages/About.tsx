import { CheckCircle2, FileText, MapPin, PackageCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/site/SectionHeader";
import { SITE } from "@/lib/site";

const highlights = [
  { icon: MapPin, title: "Nairobi-based", body: "An independent supplier based in Nairobi, Kenya." },
  { icon: PackageCheck, title: "Tender supply range", body: "Office stationery, printer consumables, computers, networking equipment and software/antivirus." },
  { icon: FileText, title: "Quote-first process", body: "Requests are handled through clear quotations for LPO and BOQ review." },
];

const compliance = [
  "KRA PIN registered",
  "eTIMS-compliant",
  "Tax compliant",
  "Compliance documents available on request",
];

const About = () => (
  <Layout>
    <PageHero eyebrow="About Ronica Merchants" title="An independent Nairobi-based supplier.">
      Ronica Merchants supplies office and IT procurement requirements for government,
      county offices, schools, NGOs and corporates across Kenya.
    </PageHero>

    <section className="bg-background py-20">
      <div className="container-tight grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeader eyebrow="Who We Are" title="Short, clear and procurement-focused." />
          <p className="mt-6 text-muted-foreground">
            Ronica Merchants is a sole proprietorship based in {SITE.location}. We provide
            formal quotations for stationery, printer consumables, computers and accessories,
            networking equipment, and software/antivirus requirements.
          </p>
          <p className="mt-4 text-muted-foreground">
            The public website keeps business information intentionally minimal. Compliance
            documents are shared directly with requesting procurement teams when needed for a quote,
            LPO or tender submission.
          </p>
          <Button asChild variant="gold" className="mt-6">
            <Link to="/request-quote">Request a Quote</Link>
          </Button>
        </div>
        <div className="space-y-5">
          {highlights.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <Icon className="h-7 w-7 text-accent" />
              <h3 className="mt-3 text-lg font-bold text-primary">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-surface py-20">
      <div className="container-tight">
        <SectionHeader
          eyebrow="Compliance"
          title="Documents are available on request."
          description="We do not publish registration numbers, tax identifiers, bank details or personal details on the public website."
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {compliance.map((c) => (
            <div key={c} className="flex items-center gap-3 rounded-lg border border-border bg-card px-5 py-4">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
              <span className="font-medium text-primary">{c}</span>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-lg border border-accent/30 bg-accent-soft/40 p-5 text-sm text-primary">
          <p className="font-semibold">Compliance documents available on request.</p>
          <Link to="/request-quote" className="mt-2 inline-flex font-semibold text-primary underline decoration-accent underline-offset-4">
            Use the quote form
          </Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default About;