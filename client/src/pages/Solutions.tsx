import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PageIntro } from "@/components/site/PageIntro";
import { Reveal } from "@/components/anim/Reveal";
import { Button } from "@/components/ui/button";
import { DIVISIONS } from "@/lib/content";
import { usePageMeta } from "@/hooks/use-page-meta";
import hero from "@/assets/hero-workspace.jpg";

const Solutions = () => {
  usePageMeta("Our Solutions", "IT solutions, digital transformation, business automation, IT infrastructure services and strategic procurement from Ronica Merchants Limited, Kenya.");
  return (
    <Layout>
      <PageIntro eyebrow="Our solutions" title="Four divisions. One accountable partner." image={hero}>
        Explore how we support organisations across technology, enterprise operations, infrastructure and commercial supply.
      </PageIntro>
      <nav className="sticky top-[72px] z-40 border-b border-border bg-background/95 backdrop-blur" aria-label="Divisions">
        <div className="container-wide flex gap-6 overflow-x-auto py-3 text-sm font-medium">
          {DIVISIONS.map((d) => <a key={d.id} href={`#${d.id}`} className="whitespace-nowrap text-muted-foreground hover:text-primary"><span className="text-accent">{d.no}</span> {d.title}</a>)}
        </div>
      </nav>
      {DIVISIONS.map((d, i) => (
        <section key={d.id} id={d.id} className={`scroll-mt-32 section-pad ${i % 2 ? "bg-surface" : ""}`}>
          <div className="container-wide grid items-center gap-12 lg:grid-cols-2">
            <Reveal className={i % 2 ? "lg:order-2" : ""}>
              <div className="overflow-hidden rounded-md">
                <img src={d.image} alt={d.alt} loading="lazy" width={1280} height={896} className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <p className="eyebrow">{d.no} — Division</p>
              <h2 className="mt-3 text-3xl font-bold text-primary md:text-4xl">{d.title}</h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">{d.summary}</p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {d.services.map((s) => <li key={s} className="flex gap-3 text-sm text-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{s}</li>)}
              </ul>
              <Button asChild variant="navy" className="mt-10"><Link to={`/contact?service=${encodeURIComponent(d.title)}`}>Enquire about {d.title.split(" ")[0]} <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
              <p className="mt-4 text-xs text-muted-foreground">Service availability is confirmed per engagement.</p>
            </Reveal>
          </div>
        </section>
      ))}
    </Layout>
  );
};
export default Solutions;
