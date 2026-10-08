"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { nav } from "@/lib/content";

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between transition-[padding,background,box-shadow] duration-300 ${
          scrolled ? "py-3 px-6 bg-midnight/85 backdrop-blur-md shadow-lg" : "py-6 px-6"
        }`}
      >
        <Link href="/" className="flex items-center gap-3 text-parchment">
          <span
            className="relative w-9 h-9 rounded-full overflow-hidden shrink-0"
            style={{ boxShadow: "0 0 0 1px rgba(201,162,78,0.5)" }}
          >
            <Image src="/logo.jpg" alt="Covenant Baptist Church logo" fill sizes="36px" className="object-cover" />
          </span>
          <span className="font-serif text-sm leading-tight">
            Covenant Baptist Church
            <small className="block font-sans text-[9.5px] tracking-[0.16em] text-gold-light font-semibold mt-0.5">
              Byazhin-Kubwa, Abuja
            </small>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-6">
          {nav.map((item) =>
            item.href.startsWith("#") ? (
              <a
                key={item.href}
                href={item.href}
                className="relative text-[13px] text-parchment/85 hover:text-parchment py-1 after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-gold hover:after:w-full after:transition-all"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-[13px] text-parchment/85 hover:text-parchment py-1 after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-gold hover:after:w-full after:transition-all"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <Link
          href="/visit"
          className="hidden md:inline-block px-5 py-2.5 rounded border border-gold text-gold-light text-xs font-semibold tracking-wide hover:bg-gold hover:text-navy transition active:scale-95"
        >
          Plan Your Visit
        </Link>

        <button
          className="md:hidden flex flex-col justify-center gap-[5px] w-6 h-6 z-[200]"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span
            className={`block h-0.5 w-full bg-parchment transition-transform duration-300 ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-full bg-parchment transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-full bg-parchment transition-transform duration-300 ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[150] bg-midnight flex flex-col items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {nav.map((item, i) =>
              item.href.startsWith("#") ? (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="font-serif text-2xl text-parchment"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.4 }}
                >
                  {item.label}
                </motion.a>
              ) : (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.4 }}
                >
                  <Link href={item.href} onClick={() => setOpen(false)} className="font-serif text-2xl text-parchment">
                    {item.label}
                  </Link>
                </motion.div>
              )
            )}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 + nav.length * 0.05, duration: 0.4 }}
            >
              <Link
                href="/visit"
                onClick={() => setOpen(false)}
                className="inline-block mt-2 px-8 py-3 rounded bg-gold text-navy font-sans font-bold text-sm tracking-wide"
              >
                Plan Your Visit
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
