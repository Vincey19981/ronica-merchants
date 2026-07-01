import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Linkedin, Facebook, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { NAV_LINKS, SITE } from "@/lib/site";

export const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container-wide section-pad" style={{ fontSize: "14px", lineHeight: "24px" }}>
      <div className="grid gap-10 md:grid-cols-3">
        <div>
          <div className="inline-block bg-white/5 p-3" style={{ borderRadius: "6px" }}>
            <Logo light />
          </div>
          <p className="mt-4 text-primary-foreground/80">
            {SITE.tagline} A trusted Kenyan supplier of office products
            for public and private sector tenders.
          </p>
          <p className="mt-3 text-[12px] text-primary-foreground/60">
            {SITE.pin} | {SITE.vat}
          </p>
        </div>

        <div>
          <h4 className="text-accent uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", fontWeight: 600 }}>
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-primary-foreground/80 hover:text-accent transition-colors duration-150">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-accent uppercase" style={{ fontSize: "11px", letterSpacing: "0.08em", fontWeight: 600 }}>
            Contact
          </h4>
          <ul className="mt-4 space-y-3 text-primary-foreground/80">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />{SITE.address}</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-accent shrink-0" />{SITE.phone}</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-accent shrink-0" />{SITE.email}</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-3 text-[12px] text-primary-foreground/60 md:flex-row md:items-center md:justify-between">
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
              className="flex h-8 w-8 items-center justify-center border border-white/10 text-white/70 transition-colors duration-200 hover:border-accent hover:text-accent"
              style={{ borderRadius: "6px" }}
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
