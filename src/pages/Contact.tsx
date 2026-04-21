import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { SITE } from "@/lib/site";

const Contact = () => (
  <Layout hideBottomCta>
    <PageHero eyebrow="Contact & Quotation Request" title="Send us your tender. We'll respond in 24 hours.">
      Procurement officers, secretariat staff, and corporate buyers — start a formal
      quotation request below, or reach us directly by phone or email.
    </PageHero>

    <section className="bg-background py-16">
      <div className="container-tight grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
            <h2 className="text-lg font-bold text-primary">Reach Us</h2>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3"><MapPin className="h-5 w-5 mt-0.5 shrink-0 text-accent" /><span className="text-muted-foreground">{SITE.address}</span></li>
              <li className="flex gap-3"><Phone className="h-5 w-5 mt-0.5 shrink-0 text-accent" /><a href={SITE.phoneHref} className="text-primary font-medium hover:text-accent">{SITE.phone}</a></li>
              <li className="flex gap-3"><Mail className="h-5 w-5 mt-0.5 shrink-0 text-accent" /><a href={`mailto:${SITE.email}`} className="text-primary font-medium hover:text-accent break-all">{SITE.email}</a></li>
              <li className="flex gap-3"><Clock className="h-5 w-5 mt-0.5 shrink-0 text-accent" /><span className="text-muted-foreground">{SITE.hours}</span></li>
            </ul>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-card)]">
            <iframe
              title="Ronica Merchants location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=36.78%2C-1.32%2C36.86%2C-1.26&layer=mapnik"
              className="h-64 w-full border-0"
              loading="lazy"
            />
          </div>

          <div className="rounded-xl border border-accent/30 bg-accent-soft/40 p-5 text-sm text-primary">
            <strong>Urgent tender?</strong> Call us directly for fastest response. We respond
            to all written enquiries within 24 business hours.
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-[var(--shadow-card)]">
            <h2 className="text-2xl font-bold text-primary">Quotation Request Form</h2>
            <p className="mt-2 text-sm text-muted-foreground">All fields marked * are required.</p>
            <div className="mt-6">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Contact;