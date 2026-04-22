import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Linkedin, Facebook, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { NAV_LINKS, SITE } from "@/lib/site";

export const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container-wide py-14">
      <div className="grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2 max-w-md">
          <div className="rounded-md bg-white/5 p-3 inline-block">
            <Logo light />
          </div>
          <p className="mt-4 text-sm text-primary-foreground/80">
            {SITE.tagline} A trusted Kenyan supplier of office products
            for public and private sector tenders.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-wider">
            {["PIN Registered", "VAT Compliant", "Tax Compliant", "LPO Ready"].map((b) => (
              <span key={b} className="rounded border border-accent/40 bg-accent/10 px-2 py-1 text-accent">
                ✓ {b}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-accent">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-primary-foreground/80 hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-accent">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />{SITE.address}</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-accent shrink-0" />{SITE.phone}</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-accent shrink-0" />{SITE.email}</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-6 flex flex-col gap-3 text-xs text-primary-foreground/60 md:flex-row md:items-center md:justify-between">
        <p>{SITE.pin} &nbsp;·&nbsp; {SITE.vat}</p>
        <div className="flex items-center gap-3">
          {[
            { Icon: Linkedin, href: "#", label: "LinkedIn" },
            { Icon: Facebook, href: "#", label: "Facebook" },
            { Icon: MessageCircle, href: "#", label: "WhatsApp" },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-white/70 transition-all hover:border-accent hover:text-accent hover:bg-accent/10"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
        <p>© {new Date().getFullYear()} Ronica Merchants. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
);