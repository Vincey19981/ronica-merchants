import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EnquiryCTA = ({ title = "Have a project or requirement in mind?", text = "Tell us about your organisation and the challenge you are working on. We will respond with a clear next step." }: { title?: string; text?: string }) => (
  <section className="bg-surface">
    <div className="container-wide section-pad">
      <div className="relative overflow-hidden rounded-sm bg-primary px-8 py-14 text-primary-foreground md:px-16">
        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-medium md:text-4xl">{title}</h2>
            <p className="mt-4 text-primary-foreground/75">{text}</p>
          </div>
          <Button asChild variant="gold" size="lg" className="shrink-0"><Link to="/contact">Start an enquiry <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
      </div>
    </div>
  </section>
);
