import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { NAV_LINKS, SITE } from "@/lib/site";
import { DIVISIONS } from "@/lib/content";

export const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container-wide grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
      <div>
        <Logo light />
        <p className="mt-5 max-w-xs text-sm leading-6 text-primary-foreground/70">{SITE.tagline} Based in Nairobi, Kenya.</p>
        <p className="mt-4 text-xs text-primary-foreground/50">{SITE.pin} · {SITE.vat}</p>
      </div>
      <div>
        <h2 className="eyebrow">Company</h2>
        <ul className="mt-5 space-y-2.5 text-sm">
          {NAV_LINKS.map((l) => <li key={l.to}><Link to={l.to} className="text-primary-foreground/75 hover:text-accent">{l.label}</Link></li>)}
        </ul>
      </div>
      <div>
        <h2 className="eyebrow">Solutions</h2>
        <ul className="mt-5 space-y-2.5 text-sm">
          {DIVISIONS.map((d) => <li key={d.id}><Link to={`/solutions#${d.id}`} className="text-primary-foreground/75 hover:text-accent">{d.title}</Link></li>)}
        </ul>
      </div>
      <div>
        <h2 className="eyebrow">Contact</h2>
        <ul className="mt-5 space-y-3 text-sm text-primary-foreground/75">
          <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{SITE.address}</li>
          <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><a href={SITE.phoneHref} className="hover:text-accent">{SITE.phone}</a></li>
          <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><a href={`mailto:${SITE.email}`} className="break-all hover:text-accent">{SITE.email}</a></li>
        </ul>
        {Object.entries(SITE.social).some(([, v]) => v) && (
          <div className="mt-4 flex gap-4 text-sm">
            {Object.entries(SITE.social).filter(([, v]) => v).map(([k, v]) => <a key={k} href={v} target="_blank" rel="noreferrer" className="capitalize hover:text-accent">{k}</a>)}
          </div>
        )}
      </div>
    </div>
    <div className="border-t border-primary-foreground/10">
      <div className="container-wide flex flex-col gap-2 py-6 text-xs text-primary-foreground/50 sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} Ronica Merchants Limited. All rights reserved.</span>
        <Link to="/auth/login" className="hover:text-accent">Client portal</Link>
      </div>
    </div>
  </footer>
);
