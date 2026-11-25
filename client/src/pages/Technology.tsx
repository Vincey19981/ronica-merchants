import { Link } from "react-router-dom";
import { ArrowRight, Boxes, Cog, Lightbulb, Server, Sparkles } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PageIntro } from "@/components/site/PageIntro";
import { Reveal } from "@/components/anim/Reveal";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/use-page-meta";
import img from "@/assets/division-technology.jpg";

const PILLARS = [
  { icon: Lightbulb, t: "Innovation philosophy", d: "Build only what solves a real, observed problem — and keep it simple to adopt." },
  { icon: Cog, t: "Technology development", d: "Designing and building practical software for organisational needs." },
  { icon: Sparkles, t: "Business automation", d: "Removing repetitive manual work through well-designed workflows." },
  { icon: Server, t: "Enterprise systems", d: "Connecting the systems organisations already depend on." },
];

const Technology = () => {
  usePageMeta("Technology & Innovation", "Ronica's technology development, business automation and enterprise systems work, including NEXORA, an IT asset management platform in development.");
  return (
    <Layout>
      <PageIntro eyebrow="Technology & innovation" title="Practical technology, thoughtfully built." image={img}>
        Beyond delivering solutions, we are developing our own technology products to help organisations run their IT with more confidence.
      </PageIntro>
      <section className="section-pad">
        <div className="container-wide grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.t} delay={i * 80} className="h-full border-t border-border pt-8">
              <p.icon className="h-7 w-7 text-brand-blue" strokeWidth={1.6} />
              <h2 className="mt-6 text-lg font-medium text-primary">{p.t}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{p.d}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="container-wide section-pad relative grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Featured product</p>
            <h2 className="mt-3 text-4xl font-medium tracking-[0.1em] md:text-[56px]">NEXORA</h2>
            <span className="mt-5 inline-flex rounded-full border border-accent/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">Product in development</span>
            <p className="mt-6 text-lg leading-8 text-primary-foreground/80">An enterprise IT and asset management platform being developed to simplify technology operations, improve asset visibility and support organisational IT management.</p>
            <p className="mt-4 text-sm text-primary-foreground/60">NEXORA is not yet commercially available. Organisations interested in early conversations are welcome to get in touch.</p>
            <Button asChild variant="gold" className="mt-8"><Link to={`/contact?service=${encodeURIComponent("NEXORA (product in development)")}`}>Register interest <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </Reveal>
          <Reveal delay={100} className="grid gap-4 self-center sm:grid-cols-2">
            {[["Asset visibility", "A clearer view of IT assets across the organisation."], ["Operational simplicity", "Fewer spreadsheets, more structured IT management."], ["Lifecycle tracking", "Planned support for assets from acquisition to retirement."], ["Organisational fit", "Being designed around how teams actually work."]].map(([t, d]) => (
              <div key={t} className="rounded-sm border border-primary-foreground/15 bg-primary-foreground/5 p-6">
                <Boxes className="h-5 w-5 text-accent" /><h3 className="mt-4 font-medium">{t}</h3><p className="mt-2 text-sm text-primary-foreground/65">{d}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
      <section className="section-pad">
        <div className="container-wide max-w-3xl">
          <Reveal>
            <p className="eyebrow">Future innovation initiatives</p>
            <h2 className="mt-3 text-3xl font-medium text-primary md:text-4xl">Room to grow.</h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">We continue to explore tools in automation, operations visibility and enterprise integration. New initiatives will be shared here as they mature — we only announce what is real.</p>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
};
export default Technology;
