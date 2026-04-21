import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const BottomCTA = () => (
  <section className="bg-surface border-y border-border">
    <div className="container-wide py-12 flex flex-col items-center gap-5 text-center md:flex-row md:justify-between md:text-left">
      <div>
        <h3 className="text-2xl font-bold text-primary">Have a tender, BOQ or LPO?</h3>
        <p className="mt-1 text-muted-foreground">
          Send us your requirements — we respond with a formal quotation within 24 business hours.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild variant="gold" size="lg">
          <Link to="/contact">Request a Quote <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href={SITE.phoneHref}><Phone className="mr-2 h-4 w-4" /> Call Us</a>
        </Button>
      </div>
    </div>
  </section>
);