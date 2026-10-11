import { Phone } from "lucide-react";
import { SITE } from "@/lib/site";

export const TopBar = () => (
  <div className="bg-accent text-accent-foreground">
    <div className="container-wide flex items-center justify-between gap-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider sm:text-xs">
      <p className="min-w-0 truncate">
        KRA PIN Registered · eTIMS-Compliant · Tax Compliant · LPO &amp; Tender Ready
      </p>
      <a href={SITE.phoneHref} className="flex shrink-0 items-center gap-1.5 whitespace-nowrap hover:underline">
        <Phone className="h-3.5 w-3.5" /> {SITE.phone}
      </a>
    </div>
  </div>
);