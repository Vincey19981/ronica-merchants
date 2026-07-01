import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Layout } from "@/components/site/Layout";

const ActiveTenders = () => (
  <Layout>
    <section className="section-pad bg-background">
      <div className="container-tight">
        <h1 className="text-3xl text-primary sm:text-4xl" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>
          Active Tenders &amp; Opportunities
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          We respond to all tender enquiries within 24 hours. Send us your BOQ or tender
          document to get a formal quotation on letterhead.
        </p>

        <article className="mt-10 border border-border bg-card p-6 sm:p-8" style={{ borderRadius: "6px" }}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase text-muted-foreground" style={{ letterSpacing: "0.08em" }}>
                Stationery &amp; Paper
              </p>
              <h2 className="mt-2 text-xl text-primary sm:text-2xl" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>
                Open — Office Supplies Framework
              </h2>
            </div>
            <span
              className="bg-accent px-3 py-1 text-[11px] uppercase text-primary"
              style={{ borderRadius: "6px", letterSpacing: "0.08em", fontWeight: 500 }}
            >
              Accepting Enquiries
            </span>
          </div>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[11px] uppercase text-muted-foreground" style={{ letterSpacing: "0.08em" }}>Category</dt>
              <dd className="mt-1 text-foreground">Stationery &amp; Paper</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase text-muted-foreground" style={{ letterSpacing: "0.08em" }}>Closing</dt>
              <dd className="mt-1 text-foreground">Rolling basis</dd>
            </div>
          </dl>
          <div className="mt-6">
            <Button asChild variant="gold">
              <Link to="/request-quote">
                Submit Enquiry <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </article>

        <aside className="mt-8 border border-accent/40 bg-accent/5 p-6" style={{ borderRadius: "6px" }}>
          <p className="text-primary" style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>
            Are you a procurement officer?
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            We can respond to your institution's specific tender requirements. Contact us
            with your LPO or BOQ document.
          </p>
        </aside>
      </div>
    </section>
  </Layout>
);

export default ActiveTenders;