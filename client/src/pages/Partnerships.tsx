import { Link } from "react-router-dom";
import { ArrowRight, FileText, Handshake, Layers, Network, Truck, Wrench } from "lucide-react";
import { Layout } from "@/components/site/Layout";
import { PageIntro } from "@/components/site/PageIntro";
import { Reveal } from "@/components/anim/Reveal";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/use-page-meta";
import img from "@/assets/division-procurement.jpg";

const ITEMS = [
  { icon: Handshake, t: "Corporate partnerships", d: "Long-term relationships with organisations that need a dependable solutions partner." },
  { icon: Layers, t: "Institutional procurement", d: "Structured, well-documented supply for institutions and public bodies." },
  { icon: Truck, t: "Vendor and supplier relationships", d: "Working with manufacturers and distributors to source reliably." },
  { icon: Network, t: "Project-based engagements", d: "Defined-scope projects with clear deliverables and timelines." },
  { icon: Wrench, t: "Technical service partnerships", d: "Collaborations to deliver installation, support and maintenance." },
  { icon: FileText, t: "Requests for quotations and proposals", d: "Send us an RFQ or RFP and we will respond with a clear, compliant submission." },
];

const Partnerships = () => {
  usePageMeta("Partnerships & Procurement", "Engage Ronica Merchants Limited for corporate partnerships, institutional procurement, project engagements and requests for quotations or proposals.");
  return (
    <Layout>
      <PageIntro eyebrow="Partnerships & procurement" title="Ways to work with Ronica." image={img}>
        Whether you are an organisation with a requirement or a partner with complementary capability, we welcome serious conversations.
      </PageIntro>
      <section className="section-pad">
        <div className="container-wide grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((it, i) => (
            <Reveal key={it.t} delay={i * 70} className="h-full rounded-sm border border-border p-8 transition-colors hover:bg-surface">
              <it.icon className="h-7 w-7 text-brand-blue" strokeWidth={1.6} />
              <h2 className="mt-6 text-lg font-medium text-primary">{it.t}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{it.d}</p>
            </Reveal>
          ))}
        </div>
        <div className="container-wide mt-12 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="navy" size="lg"><Link to={`/contact?service=${encodeURIComponent("Partnership or proposal")}`}>Propose a partnership <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          <Button asChild variant="outline" size="lg"><Link to={`/contact?service=${encodeURIComponent("Procurement & Commercial Supply")}`}>Request a quotation</Link></Button>
        </div>
      </section>
    </Layout>
  );
};
export default Partnerships;
