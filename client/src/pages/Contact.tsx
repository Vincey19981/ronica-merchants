import { Mail, MapPin, Phone } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PageIntro } from "@/components/site/PageIntro";
import { ContactForm } from "@/components/forms/ContactForm";
import { SITE } from "@/lib/site";
import { usePageMeta } from "@/hooks/use-page-meta";

const Contact = () => {
  usePageMeta("Contact", "Contact Ronica Merchants Limited in Nairobi about technology, infrastructure, business solutions or procurement requirements.");
  return (
    <Layout>
      <PageIntro eyebrow="Contact" title="Let's discuss your project.">
        Share a few details about your organisation and requirement. Our team will review your enquiry and respond.
      </PageIntro>
      <section className="section-pad">
        <div className="container-wide grid gap-12 lg:grid-cols-12">
          <aside className="space-y-8 lg:col-span-4">
            {[
              { icon: MapPin, label: "Office", value: SITE.address },
              { icon: Phone, label: "Telephone", value: SITE.phone, href: SITE.phoneHref },
              { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
            ].map((c) => (
              <div key={c.label} className="flex gap-4 border-b border-border pb-6">
                <c.icon className="mt-1 h-5 w-5 shrink-0 text-accent" />
                <div><p className="eyebrow text-muted-foreground">{c.label}</p>
                  {c.href ? <a href={c.href} className="mt-1 block break-all font-semibold text-primary hover:text-brand-blue">{c.value}</a> : <p className="mt-1 font-semibold text-primary">{c.value}</p>}
                </div>
              </div>
            ))}
          </aside>
          <div className="rounded-sm border border-border p-6 sm:p-10 lg:col-span-8">
            <h2 className="text-2xl font-medium text-primary">Send an enquiry</h2>
            <p className="mt-2 text-sm text-muted-foreground">All fields are required.</p>
            <div className="mt-8"><ContactForm /></div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
export default Contact;
