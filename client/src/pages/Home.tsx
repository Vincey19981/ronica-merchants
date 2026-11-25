import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Compass, Layers, ShieldCheck, Target, Workflow, Scale } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/anim/Reveal";
import { EnquiryCTA } from "@/components/site/EnquiryCTA";
import { DIVISIONS, INDUSTRIES } from "@/lib/content";
import { usePageMeta } from "@/hooks/use-page-meta";
import hero from "@/assets/hero-workspace.jpg";

const WHY = [
  { icon: Target, title: "Problem-first thinking", text: "We start with your operational challenge, not a product to sell." },
  { icon: Layers, title: "Integrated capability", text: "Technology, infrastructure, business and supply under one partner." },
  { icon: ShieldCheck, title: "Accountable delivery", text: "Clear scope, documented commitments and transparent communication." },
  { icon: Scale, title: "Scalable by design", text: "Solutions sized for today, structured to grow with you." },
];
const STEPS = [
  { title: "Understand", text: "We listen, assess your environment and define the real requirement." },
  { title: "Design", text: "We propose a practical solution with clear scope, timelines and cost." },
  { title: "Deliver", text: "We implement, configure or supply — with documented handover." },
  { title: "Support", text: "We stay engaged to maintain, improve and scale what we deliver." },
];

const Home = () => {
  usePageMeta("Technology, Infrastructure & Business Solutions in Kenya", "Ronica Merchants Limited delivers IT solutions, technology consulting, IT infrastructure services, business automation and strategic procurement for organisations in Kenya.");
  return (
    <Layout>
      <section className="relative flex min-h-[calc(100vh-72px)] items-end overflow-hidden bg-primary text-primary-foreground">
        <img src={hero} alt="Modern corporate workspace beside a glass-walled server room at dusk" width={1920} height={1088} className="animate-hero-zoom absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="hero-lines absolute inset-0 opacity-60" aria-hidden />
        <div className="container-wide relative pb-20 pt-32 md:pb-28">
          <p className="eyebrow animate-fade-in">Ronica Merchants Limited · Nairobi, Kenya</p>
          <h1 className="mt-6 max-w-4xl animate-fade-in text-4xl font-extrabold leading-[1.05] sm:text-5xl md:text-7xl">
            Building Smarter Businesses Through Technology &amp; Innovation.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-primary-foreground/80">
            We help organisations navigate operational challenges through technology, infrastructure and integrated business solutions.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="light" size="lg"><Link to="/solutions">Explore Our Solutions <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild variant="lightOutline" size="lg"><Link to="/contact">Let's Discuss Your Project</Link></Button>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4"><p className="eyebrow">Who we are</p></Reveal>
          <Reveal className="lg:col-span-8" delay={100}>
            <p className="text-2xl font-semibold leading-snug text-primary md:text-4xl">
              A Kenyan solutions company bringing together technology, infrastructure, enterprise thinking and strategic supply — so organisations can operate with more clarity and less friction.
            </p>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 font-semibold text-brand-blue hover:gap-3 transition-all">About Ronica <ArrowRight className="h-4 w-4" /></Link>
          </Reveal>
        </div>
      </section>

      <section className="section-pad bg-surface">
        <div className="container-wide">
          <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div><p className="eyebrow">Our solutions</p><h2 className="mt-3 text-3xl font-bold text-primary md:text-5xl">Four business divisions.</h2></div>
            <Link to="/solutions" className="inline-flex items-center gap-2 font-semibold text-brand-blue">View all solutions <ArrowRight className="h-4 w-4" /></Link>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {DIVISIONS.map((d, i) => (
              <Reveal key={d.id} delay={i * 80}>
                <Link to={`/solutions#${d.id}`} className="group relative block h-[380px] overflow-hidden rounded-md bg-primary text-primary-foreground">
                  <img src={d.image} alt={d.alt} loading="lazy" width={1280} height={896} className="absolute inset-0 h-full w-full object-cover opacity-50 transition-all duration-700 group-hover:scale-105 group-hover:opacity-35" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
                  <div className="relative flex h-full flex-col justify-between p-8">
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-semibold text-accent">{d.no}</span>
                      <ArrowUpRight className="h-6 w-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold md:text-3xl">{d.title}</h3>
                      <p className="mt-3 max-w-md text-primary-foreground/75">{d.summary}</p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <Reveal><p className="eyebrow">Why organisations choose Ronica</p><h2 className="mt-3 max-w-2xl text-3xl font-bold text-primary md:text-5xl">A partner built around your outcomes.</h2></Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={i * 80} className="group h-full bg-background p-8 transition-colors hover:bg-surface">
                <w.icon className="h-7 w-7 text-brand-blue transition-transform group-hover:-translate-y-1" strokeWidth={1.6} />
                <h3 className="mt-6 text-lg font-bold text-primary">{w.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{w.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="hero-lines absolute inset-0" aria-hidden />
        <div className="container-wide section-pad relative grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Technology &amp; innovation</p>
            <h2 className="mt-3 text-3xl font-bold md:text-5xl">Introducing NEXORA.</h2>
            <p className="mt-6 text-lg leading-8 text-primary-foreground/75">An enterprise IT and asset management platform being developed to simplify technology operations, improve asset visibility and support organisational IT management.</p>
            <span className="mt-6 inline-flex rounded-full border border-accent/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">Product in development</span>
            <div className="mt-8"><Button asChild variant="gold"><Link to="/technology">Explore our innovation work <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-md border border-primary-foreground/15 bg-primary-foreground/5 p-6 backdrop-blur">
              <div className="flex items-center gap-2 border-b border-primary-foreground/10 pb-4"><span className="h-2.5 w-2.5 rounded-full bg-accent" /><span className="text-sm font-semibold">NEXORA · concept preview</span></div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {["Asset register", "Lifecycle", "Visibility"].map((t) => <div key={t} className="rounded bg-primary-foreground/10 p-4 text-xs text-primary-foreground/70">{t}<div className="mt-3 h-1.5 rounded bg-accent/60" /></div>)}
              </div>
              <div className="mt-3 space-y-2">{[80, 55, 68].map((w) => <div key={w} className="h-2 rounded bg-primary-foreground/10"><div className="h-2 rounded bg-brand-blue" style={{ width: `${w}%` }} /></div>)}</div>
              <p className="mt-5 text-xs text-primary-foreground/50">Illustrative concept only. Not a live product.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <Reveal><p className="eyebrow">Our approach</p><h2 className="mt-3 text-3xl font-bold text-primary md:text-5xl">How we deliver.</h2></Reveal>
          <ol className="mt-14 grid gap-10 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 100} className="relative border-t-2 border-border pt-6">
                <span className="absolute -top-[2px] left-0 h-[2px] w-12 bg-accent" />
                <span className="text-sm font-semibold text-muted-foreground">0{i + 1}</span>
                <h3 className="mt-2 text-xl font-bold text-primary">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-pad bg-surface">
        <div className="container-wide grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow">Industries</p>
            <h2 className="mt-3 text-3xl font-bold text-primary md:text-4xl">Sectors we aim to support.</h2>
            <Link to="/industries" className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-blue">Explore industries <ArrowRight className="h-4 w-4" /></Link>
          </Reveal>
          <ul className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:col-span-8">
            {INDUSTRIES.map((ind) => (
              <li key={ind.title} className="group flex items-center justify-between bg-background p-6 transition-colors hover:bg-primary hover:text-primary-foreground">
                <span className="font-semibold">{ind.title}</span><Compass className="h-5 w-5 text-accent opacity-0 transition-opacity group-hover:opacity-100" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <EnquiryCTA title="Let's build something that works for your organisation." />
    </Layout>
  );
};
export default Home;
