import { Download, FileText, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";

const ActiveTenders = () => (
  <Layout>
    <PageHero eyebrow="Active Tenders & Quotations" title="Tenders we are actively pursuing.">
      We participate in public and private sector tenders across Kenya. If your
      organization has an upcoming procurement need, reach out early — we move fast
      and our compliance documentation is always ready.
    </PageHero>

    <section className="bg-background py-16">
      <div className="container-tight">
        <div className="rounded-xl border border-border bg-card p-10 text-center shadow-[var(--shadow-card)] sm:p-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Inbox className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-primary sm:text-3xl">
            Current Active Tenders
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            We are currently preparing our tender listings. Contact us directly with
            your BOQ or tender document and we will respond within 24 hours.
          </p>
          <Button asChild variant="gold" size="lg" className="mt-8">
            <Link to="/request-quote">Submit a Tender Enquiry</Link>
          </Button>
        </div>
      </div>
    </section>

    <section className="bg-surface py-16">
      <div className="container-tight">
        <h2 className="text-2xl font-bold text-primary gold-underline">Downloads</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {[
            { title: "Quotation Request Form", body: "Standard form for submitting your enquiry by email.", file: "Quotation-Request-Form.pdf" },
            { title: "Company Profile", body: "Overview of services, capabilities, and compliance documentation.", file: "Ronica-Company-Profile.pdf" },
          ].map((d) => (
            <div key={d.title} className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-primary">{d.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d.body}</p>
                <Button asChild variant="goldOutline" size="sm" className="mt-4">
                  <a href="#" download={d.file}>
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default ActiveTenders;