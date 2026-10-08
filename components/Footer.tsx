import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, MessageCircle } from "lucide-react";
import { church, nav } from "@/lib/content";

export default function Footer() {
  return (
    <footer id="contact" className="bg-midnight text-parchment/75 pt-20">
      <div className="max-w-[1180px] mx-auto px-6 grid gap-11 md:grid-cols-[1.3fr_0.8fr_1fr] pb-14 border-b border-parchment/10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span
              className="relative w-10 h-10 rounded-full overflow-hidden shrink-0"
              style={{ boxShadow: "0 0 0 1px rgba(201,162,78,0.5)" }}
            >
              <Image src="/logo.jpg" alt="Covenant Baptist Church logo" fill sizes="40px" className="object-cover" />
            </span>
            <span className="font-serif text-parchment text-[15px]">
              Covenant Baptist
              <br />
              Church
            </span>
          </div>
          <p className="font-serif italic text-[15px] leading-relaxed text-parchment/70 max-w-[38ch]">
            &ldquo;{church.visionFull}&rdquo;
            <cite className="block not-italic mt-2.5 text-[11.5px] tracking-wide text-gold-light">
              {church.visionRef}
            </cite>
          </p>
        </div>

        <div>
          <h4 className="font-sans text-xs tracking-[0.14em] uppercase text-gold-light font-bold mb-5">Explore</h4>
          <ul>
            {nav.map((item) => (
              <li key={item.href} className="mb-3">
                <Link href={item.href} className="text-sm text-parchment/72 hover:text-gold-light transition">
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mb-3">
              <Link href="/prayer" className="text-sm text-parchment/72 hover:text-gold-light transition">
                Prayer Requests
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
              <span>{church.address}</span>
            </li>
            <li className="flex gap-2.5 mb-4 text-sm">
              <Phone size={15} className="shrink-0 text-gold" />
              <a href={`tel:${church.phone.replace(/\s/g, "")}`} className="hover:text-gold-light transition">
                {church.phone}
              </a>
            </li>
            <li className="flex gap-2.5 mb-4 text-sm">
              <MessageCircle size={15} className="shrink-0 text-gold" />
              <a
                href={`https://wa.me/${church.whatsapp}`}
                target="_blank"
                rel="noopener"
                className="hover:text-gold-light transition"
              >
                Message on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-6 flex flex-col gap-2.5 py-8 text-xs text-parchment/45">
        <span>&copy; 2026 Covenant Baptist Church, Byazhin-Kubwa, Abuja. All rights reserved.</span>
      </div>
    </footer>
  );
}
