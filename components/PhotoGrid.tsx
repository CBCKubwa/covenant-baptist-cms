"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

type Photo = { src: string; caption: string; alt: string };

export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();

  if (photos.length === 0) {
    return (
      <div className="border border-dashed border-navy/20 rounded-md py-16 flex flex-col items-center justify-center text-center px-6">
        <ImageOff size={26} className="text-ink-soft/50 mb-4" />
        <p className="text-ink-soft text-sm max-w-[36ch]">
          No photos yet. Once albums are added from the admin, they&rsquo;ll appear here in this same grid, with a
          full lightbox.
        </p>
      </div>
    );
  }

  const close = () => setActiveIndex(null);
  const prev = () => setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : i));
  const next = () => setActiveIndex((i) => (i !== null && i < photos.length - 1 ? i + 1 : i));

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            onClick={() => setActiveIndex(i)}
            className="relative aspect-square rounded-sm overflow-hidden group"
            aria-label={`Open photo: ${photo.caption}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover group-hover:scale-105 transition duration-300"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[300] bg-midnight/96 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={photos[activeIndex].caption}
          >
            <button
              className="absolute top-6 right-6 text-parchment/80 hover:text-parchment"
              onClick={close}
              aria-label="Close"
            >
              <X size={26} />
            </button>

            {activeIndex > 0 && (
              <button
                className="absolute left-3 md:left-8 text-parchment/70 hover:text-parchment"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous photo"
              >
                <ChevronLeft size={32} />
              </button>
            )}
            {activeIndex < photos.length - 1 && (
              <button
                className="absolute right-3 md:right-8 text-parchment/70 hover:text-parchment"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next photo"
              >
                <ChevronRight size={32} />
              </button>
            )}

            <motion.div
              className="relative w-full max-w-3xl max-h-[76vh] aspect-[4/3]"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: reduce ? 1 : 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: reduce ? 1 : 0.97, opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.2 }}
            >
              <Image
                src={photos[activeIndex].src}
                alt={photos[activeIndex].alt}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </motion.div>
            <p className="absolute bottom-6 left-0 right-0 text-center text-parchment/60 text-[12.5px]">
              {photos[activeIndex].caption}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
