import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import { church } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact | Covenant Baptist Church",
  description: "Get in touch with Covenant Baptist Church, Byazhin-Kubwa, Abuja.",
};

export default function ContactPage() {
  const mapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(church.address)}`;

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
                  {church.address}
                  <br />
                  <a href={mapHref} target="_blank" rel="noopener" className="text-navy underline underline-offset-2">
                    Get directions
                  </a>
                </span>
              </li>
              <li className="flex gap-3 text-sm text-ink-soft">
                <Phone size={16} className="shrink-0 text-gold" />
                <a href={`tel:${church.phone.replace(/\s/g, "")}`} className="text-navy">
                  {church.phone}
                </a>
              </li>
              <li className="flex gap-3 text-sm text-ink-soft">
                <MessageCircle size={16} className="shrink-0 text-gold" />
                <a href={`https://wa.me/${church.whatsapp}`} target="_blank" rel="noopener" className="text-navy">
                  Message on WhatsApp
                </a>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
