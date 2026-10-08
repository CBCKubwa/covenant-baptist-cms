"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import type { Ministry } from "@/lib/ministries";

export default function MinistryAccordion({ ministry }: { ministry: Ministry }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-navy/10 rounded-md overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span>
          <span className="block font-serif text-lg text-navy">{ministry.name}</span>
          <span className="block mt-1 text-[13px] text-ink-soft">{ministry.blurb}</span>
        </span>
        <ChevronDown size={18} className={`shrink-0 text-gold transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-6 pb-7 pt-1 border-t border-navy/10 space-y-5">
          {ministry.image && (
            <div className="relative aspect-[16/9] rounded-sm overflow-hidden -mx-6 sm:mx-0 sm:mt-4">
              <Image
                src={ministry.image}
                alt={`${ministry.name} at Covenant Baptist Church`}
                fill
                sizes="(min-width: 820px) 780px, 100vw"
                className="object-cover object-[center_28%]"
              />
            </div>
          )}
          {ministry.sections.map((s) => (
            <div key={s.heading}>
              <span className="block text-[11px] font-bold tracking-[0.16em] uppercase text-gold mb-2">
                {s.heading}
              </span>
              {Array.isArray(s.body) ? (
                <ul className="space-y-1.5">
                  {s.body.map((line, i) => (
                    <li key={i} className="text-[13.5px] text-ink-soft leading-relaxed flex gap-2">
                      <span className="text-gold">&bull;</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[13.5px] text-ink-soft leading-relaxed">{s.body}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
