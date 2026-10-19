import SiteLogo from "@/components/SiteLogo";
import Link from "next/link";
import { MapPin, Phone, MessageCircle, Mail } from "lucide-react";
import { church, menuDefaults, nav as defaultNav } from "@/lib/content";
import type { ContactDetails } from "@/lib/settings";
import { splitLastWord } from "@/lib/site-content";

type FooterProps = {
  logoUrl?: string | null;
  /** Resolved contact details (admin values, else defaults) - see resolveContact(). */
  contact: ContactDetails;
  /** Vision statement edited in Admin -> Pages; blank = built-in verse. */
  vision?: string | null;
  /** Menu links with the admin's labels applied (Admin -> Menu & Footer). */
  navItems?: { label: string; href: string }[];
  prayerLabel?: string;
  /** The copyright line, already resolved ("{year}" replaced). */
  copyright?: string;
  /** Name beside the logo (Admin -> Church Info & Logo). */
  churchName?: string;
};

export default function Footer({ logoUrl, contact, vision, navItems = defaultNav, prayerLabel = menuDefaults.prayerLabel, copyright, churchName = church.name }: FooterProps) {
  const [nameTop, nameLast] = splitLastWord(churchName); // last word drops to a second line, as designed
  return (
    <footer id="contact" className="bg-midnight text-parchment/75 pt-20">
      <div className="max-w-[1180px] mx-auto px-6 grid gap-11 md:grid-cols-[1.3fr_0.8fr_1fr] pb-14 border-b border-parchment/10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <SiteLogo src={logoUrl} size={44} className="shrink-0" alt={`${churchName} logo`} />
            <span className="font-serif text-parchment text-[15px]">
              {nameTop}
              {nameLast && (
                <>
                  <br />
                  {nameLast}
                </>
              )}
            </span>
          </div>
          <p className="font-serif italic text-[15px] leading-relaxed text-parchment/70 max-w-[38ch]">
            &ldquo;{vision || church.visionFull}&rdquo;
            {/* The verse reference only belongs with the built-in verse, not with custom text. */}
            {!vision && (
              <cite className="block not-italic mt-2.5 text-[11.5px] tracking-wide text-gold-light">
                {church.visionRef}
              </cite>
            )}
          </p>
        </div>

        <div>
          <h4 className="font-sans text-xs tracking-[0.14em] uppercase text-gold-light font-bold mb-5">Explore</h4>
          <ul>
            {navItems.map((item) => (
              <li key={item.href} className="mb-3">
                <Link href={item.href} className="text-sm text-parchment/72 hover:text-gold-light transition">
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mb-3">
              <Link href="/prayer" className="text-sm text-parchment/72 hover:text-gold-light transition">
                {prayerLabel}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-sans text-xs tracking-[0.14em] uppercase text-gold-light font-bold mb-5">
            Visit &amp; Contact
          </h4>
          <ul>
            <li className="flex gap-2.5 mb-4 text-sm leading-relaxed">
              <MapPin size={15} className="shrink-0 mt-0.5 text-gold" />
              <span>{contact.address}</span>
            </li>
            <li className="flex gap-2.5 mb-4 text-sm">
              <Phone size={15} className="shrink-0 text-gold" />
              <a href={contact.phoneHref} className="hover:text-gold-light transition">
                {contact.phone}
              </a>
            </li>
            <li className="flex gap-2.5 mb-4 text-sm">
              <MessageCircle size={15} className="shrink-0 text-gold" />
              <a
                href={`https://wa.me/${contact.whatsapp}`}
                target="_blank"
                rel="noopener"
                className="hover:text-gold-light transition"
              >
                Message on WhatsApp
              </a>
            </li>
            {contact.email && (
              <li className="flex gap-2.5 mb-4 text-sm">
                <Mail size={15} className="shrink-0 text-gold" />
                <a href={`mailto:${contact.email}`} className="hover:text-gold-light transition break-all">
                  {contact.email}
                </a>
              </li>
            )}
            {contact.social.length > 0 && (
              <li className="flex flex-wrap gap-x-4 gap-y-1 text-sm pt-1">
                {contact.social.map((x) => (
                  <a key={x.label} href={x.url} target="_blank" rel="noopener noreferrer" className="text-gold-light hover:text-parchment transition">
                    {x.label}
                  </a>
                ))}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-6 flex flex-col gap-2.5 py-8 text-xs text-parchment/45">
        <span>{copyright}</span>
      </div>
    </footer>
  );
}
