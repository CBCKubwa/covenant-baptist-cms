"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp } from "@/lib/motion";

export default function Reveal({
  children,
  delay = 0,
  className = "",
  id,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  id?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      id={id}
      className={className}
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      transition={{ delay: reduce ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}
