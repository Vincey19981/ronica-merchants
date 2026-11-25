import { Building2, GraduationCap, Globe2, Landmark, Rocket, Store } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PageIntro } from "@/components/site/PageIntro";
import { Reveal } from "@/components/anim/Reveal";
import { EnquiryCTA } from "@/components/site/EnquiryCTA";
import { INDUSTRIES } from "@/lib/content";
import { usePageMeta } from "@/hooks/use-page-meta";

const ICONS = [Building2, Globe2, Landmark, Store, GraduationCap, Rocket];

const Industries = () => {
  usePageMeta("Industries We Serve", "Target sectors for Ronica Merchants Limited: corporates, NGOs, government institutions, SMEs, education and technology-driven enterprises in Kenya.");
  return (
    <Layout>
      <PageIntro eyebrow="Industries we serve" title="Built for organisations with real operational demands.">
        These are the sectors we aim to support. They describe our focus, not a list of existing clients.
      </PageIntro>
      <section className="section-pad">
        <div className="container-wide grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((ind, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={ind.title} delay={i * 70}>
                <article className="group h-full rounded-sm border border-border bg-background p-8 transition-all hover:-translate-y-1 hover:border-brand-blue hover:shadow-[var(--shadow-elevated)]">
                  <Icon className="h-8 w-8 text-brand-blue" strokeWidth={1.5} />
                  <h2 className="mt-6 text-xl font-medium text-primary">{ind.title}</h2>
                  <p className="mt-3 leading-7 text-muted-foreground">{ind.text}</p>
                  <span className="mt-6 block h-0.5 w-10 bg-accent transition-all group-hover:w-20" />
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>
      <EnquiryCTA title="Working in one of these sectors?" />
    </Layout>
  );
};
export default Industries;
