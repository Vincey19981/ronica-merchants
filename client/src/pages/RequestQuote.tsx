import { useEffect } from "react";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { QuoteEnquiryForm } from "@/components/forms/QuoteEnquiryForm";
import { Clock, ShieldCheck, FileSpreadsheet } from "lucide-react";

const RequestQuote = () => {
  useEffect(() => {
    document.title = "Request a Quote — Ronica Merchants";
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta(
      "description",
      "Submit a Request for Quotation. Add multiple products, attach your BOQ, and receive a formal quotation within 24 business hours.",
    );
  }, []);

  return (
  <Layout>
    <PageHero eyebrow="Request for Quotation" title="Tell us what you need.">
      Add as many products as you like, attach your BOQ or tender document,
      and our procurement team will respond with a formal, line-by-line quotation
      within 24 business hours.
    </PageHero>

    <section className="bg-background py-12 sm:py-16">
      <div className="container-wide grid gap-10 lg:grid-cols-[1fr_360px]">
        <QuoteEnquiryForm />

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-base font-bold text-primary">Why request a quote?</h2>
            <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span><strong className="text-foreground">24-hour turnaround</strong> on all RFQs during business days.</span>
              </li>
              <li className="flex gap-3">
                <FileSpreadsheet className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span><strong className="text-foreground">Line-by-line BOQ pricing</strong> formatted for tender submission.</span>
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span><strong className="text-foreground">Confidential</strong> — your tender details are never shared.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-accent/30 bg-accent-soft/40 p-6 text-sm">
            <p className="font-bold text-primary">Prefer to talk?</p>
            <p className="mt-1 text-muted-foreground">
              Call our procurement desk for urgent tenders or large bulk orders.
            </p>
          </div>
        </aside>
      </div>
    </section>
  </Layout>
  );
};

export default RequestQuote;