import { Layout } from "@/components/site/Layout";
import { Hero } from "@/components/site/home/Hero";
import { TickerBar } from "@/components/site/home/TickerBar";
import { WhyUs } from "@/components/site/home/WhyUs";
import { CategoryGrid } from "@/components/site/home/CategoryGrid";
import { ProcessTimeline } from "@/components/site/home/ProcessTimeline";
import { StatsCounter } from "@/components/site/home/StatsCounter";
import { Testimonials } from "@/components/site/home/Testimonials";
import { WaveDivider } from "@/components/site/WaveDivider";

const Home = () => (
  <Layout>
    <Hero />
    <TickerBar />
    <WhyUs />
    <CategoryGrid />
    <ProcessTimeline />
    <StatsCounter />
    <Testimonials />
    <WaveDivider fill="hsl(var(--surface))" />
  </Layout>
);

export default Home;