"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type HeroProps = {
  title: string;
  /** Small line under the headline (e.g. "Byazhin-Kubwa, Abuja") */
  tagline: string;
  subtitle: string;
  primaryLabel: string;
  secondaryLabel: string;
  imageSrc: string;
  /** true = admin-uploaded picture, which is simply centred (the bundled one is cropped toward the sign) */
  customImage: boolean;
};

/** Homepage banner. All wording and the picture come from Admin -> Pages (defaults in lib/content.ts). */
export default function Hero({ title, tagline, subtitle, primaryLabel, secondaryLabel, imageSrc, customImage }: HeroProps) {
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: reduce ? 0 : 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.5, ease: [0.22, 0.61, 0.36, 1] as const },
    },
  };

  return (
    <section className="relative min-h-[88vh] min-h-[88svh] flex items-end overflow-hidden bg-navy">
      <Image
        src={imageSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className={customImage ? "object-cover" : "object-cover object-[78%_35%]"}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(0deg, rgba(9,17,29,0.93) 0%, rgba(9,17,29,0.74) 45%, rgba(9,17,29,0.58) 100%)",
        }}
      />

      <motion.svg
        className="pointer-events-none absolute -top-[12%] right-[4%] w-[34vw] max-w-[380px] opacity-30"
        viewBox="0 0 600 600"
        fill="none"
        aria-hidden="true"
        animate={reduce ? {} : { rotate: 360 }}
        transition={reduce ? {} : { duration: 220, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="300" cy="300" r="270" stroke="#C9A24E" strokeWidth="1" strokeDasharray="3 12" opacity=".5" />
        <circle cx="300" cy="300" r="230" stroke="#C9A24E" strokeWidth="1" opacity=".28" />
      </motion.svg>

      <motion.div
        className="relative z-10 w-full max-w-[1180px] mx-auto px-6 pb-16 md:pb-20 pt-32"
        initial="hidden"
        animate="visible"
        variants={container}
      >
        <motion.h1 variants={item} className="text-parchment max-w-[720px]">
          <span className="block text-[clamp(2.1rem,5.6vw,4rem)] font-semibold tracking-tight font-serif leading-[1.08]">
            {title}
          </span>
        </motion.h1>
        <motion.p
          variants={item}
          className="mt-2 text-[13px] font-semibold tracking-[0.24em] uppercase text-gold-light"
        >
          {tagline}
        </motion.p>

        <motion.p
          variants={item}
          className="mt-5 max-w-[52ch] text-[clamp(1rem,1.9vw,1.15rem)] leading-relaxed text-parchment/90"
        >
          {subtitle}
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap gap-3 mt-8">
          <Link
            href="/visit"
            className="inline-flex items-center px-7 py-3.5 rounded text-[13px] font-bold tracking-wide uppercase bg-gold text-navy hover:bg-gold-light transition"
          >
            {primaryLabel}
          </Link>
          <Link
            href="/teachings"
            className="inline-flex items-center px-7 py-3.5 rounded text-[13px] font-bold tracking-wide uppercase border border-parchment/40 text-parchment hover:border-gold hover:text-gold-light transition"
          >
            {secondaryLabel}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
