import { Layout } from "@/components/site/Layout";
import { PageIntro } from "@/components/site/PageIntro";
import { Reveal } from "@/components/anim/Reveal";
import { EnquiryCTA } from "@/components/site/EnquiryCTA";
import { usePageMeta } from "@/hooks/use-page-meta";
import img from "@/assets/division-business.jpg";

const VALUES = [
  ["Integrity", "We say what we can deliver, and we deliver what we say."],
  ["Innovation", "We look for better, simpler ways to solve real problems."],
  ["Accountability", "We own our commitments and communicate openly."],
  ["Excellence", "We hold our work to a professional, documented standard."],
  ["Reliability", "We aim to be the partner organisations can depend on."],
  ["Continuous improvement", "We learn from every engagement and keep refining."],
];

const About = () => {
  usePageMeta("About Ronica", "Ronica Merchants Limited is a Nairobi-based technology, infrastructure and business solutions company. Our vision, mission, values and approach.");
  return (
    <Layout>
      <PageIntro eyebrow="About Ronica" title="A forward-looking solutions company, grounded in Kenya." image={img}>
        We bring together technology, infrastructure, enterprise thinking and strategic supply to help organisations work better.
      </PageIntro>

      <section className="section-pad">
        <div className="container-wide grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4"><p className="eyebrow">Who we are</p></Reveal>
          <Reveal className="space-y-6 text-lg leading-8 text-muted-foreground lg:col-span-8">
            <p className="text-2xl font-semibold leading-snug text-primary md:text-3xl">Ronica Merchants Limited is a business solutions company based in Nairobi, focused on technology, infrastructure and strategic procurement.</p>
            <p>We work with organisations that want practical, dependable and scalable answers to operational challenges — from systems and networks to process improvement and equipment supply. Kenya is our foundation; East Africa and beyond is our long-term ambition.</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="container-wide section-pad grid gap-px overflow-hidden md:grid-cols-2">
          {[["Our Vision", "To become a trusted provider of innovative business, technology and infrastructure solutions across Africa and beyond."], ["Our Mission", "To empower organisations through practical solutions, dependable service delivery and responsible innovation."]].map(([t, d], i) => (
            <Reveal key={t} delay={i * 100} className="border-l-2 border-accent py-4 pl-8 md:pr-12">
              <p className="eyebrow">{t}</p>
              <p className="mt-4 text-2xl font-semibold leading-snug md:text-3xl">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <Reveal><p className="eyebrow">Our values</p><h2 className="mt-3 text-3xl font-bold text-primary md:text-5xl">What guides our work.</h2></Reveal>
          <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map(([t, d], i) => (
              <Reveal key={t} delay={i * 60} className="h-full bg-background p-8 transition-colors hover:bg-surface">
                <span className="text-sm font-semibold text-accent">0{i + 1}</span>
                <h3 className="mt-4 text-xl font-bold text-primary">{t}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-surface">
        <div className="container-wide grid gap-12 md:grid-cols-3">
          {[
            ["Our business philosophy", "Good solutions are practical. We favour clarity over complexity, and long-term value over quick wins."],
            ["Our approach", "Understand, design, deliver, support. Every engagement starts with listening and ends with a documented handover."],
            ["Our commitment to clients", "Honest scoping, transparent communication and accountable delivery — whatever the size of the engagement."],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 100}>
              <h2 className="text-xl font-bold text-primary">{t}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{d}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <EnquiryCTA />
    </Layout>
  );
};
export default About;
