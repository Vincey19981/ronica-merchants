import { CheckCircle2, Target, Eye, Award } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeader } from "@/components/site/SectionHeader";

const compliance = [
  "PIN Certificate",
  "VAT Registration Certificate",
  "Certificate of Incorporation",
  "CR12 (Company Registry Extract)",
  "Tax Compliance Certificate (KRA)",
  "AGPO Certificate (where applicable)",
];

const team = [
  { name: "[Director Name]", role: "Managing Director" },
  { name: "[Procurement Lead]", role: "Head of Procurement & Tenders" },
  { name: "[Operations Lead]", role: "Operations & Logistics Manager" },
];

const About = () => (
  <Layout>
    <PageHero eyebrow="About Ronica Merchants" title="A procurement partner you can defend in any committee.">
      We exist to make tender supply painless — credible documentation, fair pricing,
      and on-time delivery. Every time.
    </PageHero>

    <section className="bg-background py-20">
      <div className="container-tight grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeader eyebrow="Our Story" title="Founded to serve the public and private sector." />
          <p className="mt-6 text-muted-foreground">
            Ronica Merchants was founded to address a recurring frustration in Kenyan
            procurement: suppliers who can't meet documentation requirements, deliver late,
            or change pricing after award. We built the company around three non-negotiables —
            compliance, consistency, and speed.
          </p>
          <p className="mt-4 text-muted-foreground">
            Today we serve ministries, county governments, schools, hospitals, NGOs, SACCOs
            and corporates across Kenya, supplying everything from a single ream of paper
            to fully kitted office setups under one LPO.
          </p>
        </div>
        <div className="space-y-5">
          {[
            { icon: Target, title: "Our Mission", body: "To be the most reliable office supply partner for tender-driven organizations in Kenya." },
            { icon: Eye, title: "Our Vision", body: "A procurement experience defined by trust, transparency and on-time delivery — every order, every time." },
            { icon: Award, title: "What Makes Us Different", body: "Compliance-first paperwork, breadth of product catalogue, and uncompromising delivery discipline." },
          ].map(({ icon: Icon, title, body }) => (
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
        <SectionHeader eyebrow="Our Team" title="The people behind the paperwork." />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {team.map((m) => (
            <div key={m.role} className="rounded-xl border border-border bg-card p-6 text-center shadow-[var(--shadow-card)]">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                {m.name.replace(/[^A-Z]/g, "").slice(0, 2) || "RM"}
              </div>
              <h3 className="mt-4 font-bold text-primary">{m.name}</h3>
              <p className="text-sm text-muted-foreground">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-background py-20">
      <div className="container-tight">
        <SectionHeader
          eyebrow="Compliance & Certifications"
          title="Every document a tender requires — ready on request."
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {compliance.map((c) => (
            <div key={c} className="flex items-center gap-3 rounded-lg border border-border bg-card px-5 py-4">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
              <span className="font-medium text-primary">{c}</span>
            </div>
          ))}
        </div>
        <p className="mt-8 rounded-lg border border-accent/30 bg-accent-soft/40 p-5 text-sm text-primary">
          <strong>Note:</strong> Full compliance documentation is available on request for tender
          submissions. Email us at info@ronicamerchants.co.ke or use the quotation form.
        </p>
      </div>
    </section>
  </Layout>
);

export default About;