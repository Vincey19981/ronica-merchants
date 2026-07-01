import { Phone } from "lucide-react";
import { SITE } from "@/lib/site";

export const TopBar = () => (
  <div className="bg-accent text-accent-foreground">
    <div className="container-wide flex flex-wrap items-center justify-between gap-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider sm:text-xs">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>PIN &amp; VAT Registered</span>
        <span className="hidden sm:inline opacity-50">·</span>
        <span className="hidden sm:inline">Tax Compliant</span>
        <span className="hidden md:inline opacity-50">·</span>
        <span className="hidden md:inline">LPO &amp; Tender Ready</span>
      </div>
      <a href={SITE.phoneHref} className="flex items-center gap-1.5 hover:underline">
        <Phone className="h-3.5 w-3.5" /> {SITE.phone}
      </a>
    </div>
  </div>
);