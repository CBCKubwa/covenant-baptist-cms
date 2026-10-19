import { pageMetadata } from "@/lib/seo";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, MessageCircle, Mail } from "lucide-react";
import { getSiteSettings, resolveContact } from "@/lib/settings";

export const revalidate = 60;

/** Search-engine title/description: editable in Admin -> Search Appearance. */
export const generateMetadata = () => pageMetadata("/contact");

export default async function ContactPage() {
  // Everything here comes from Admin -> Church Info (with built-in defaults).
  const contact = resolveContact(await getSiteSettings());

  return (
    <>
      <PageHeader eyebrow="Get in Touch" title="Contact Us" description="Reach out however's easiest for you." />
      <section className="bg-white py-16 md:py-24 px-6">
        <div className="max-w-[1180px] mx-auto grid gap-12 md:grid-cols-[0.85fr_1fr]">
          <Reveal>
            <ul className="space-y-5">
              <li className="flex gap-3 text-sm text-ink-soft">
                <MapPin size={16} className="shrink-0 mt-0.5 text-gold" />
                <span>
                  {contact.address}
                  <br />
                  <a href={contact.mapsUrl} target="_blank" rel="noopener" className="text-navy underline underline-offset-2">
                    Get directions
                  </a>
                </span>
              </li>
              <li className="flex gap-3 text-sm text-ink-soft">
                <Phone size={16} className="shrink-0 text-gold" />
                <a href={contact.phoneHref} className="text-navy">
                  {contact.phone}
                </a>
              </li>
              <li className="flex gap-3 text-sm text-ink-soft">
                <MessageCircle size={16} className="shrink-0 text-gold" />
                <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener" className="text-navy">
                  Message on WhatsApp
                </a>
              </li>
              {contact.email && (
                <li className="flex gap-3 text-sm text-ink-soft">
                  <Mail size={16} className="shrink-0 text-gold" />
                  <a href={`mailto:${contact.email}`} className="text-navy">
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.social.length > 0 && (
                <li className="flex flex-wrap gap-x-5 gap-y-2 pt-2 text-sm">
                  {contact.social.map((s) => (
                    <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="text-navy underline underline-offset-2">
                      {s.label}
                    </a>
                  ))}
                </li>
              )}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm whatsapp={contact.whatsapp} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
