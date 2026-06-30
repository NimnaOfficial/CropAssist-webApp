"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function TypewriterText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const [inView, setInView] = useState(false);
  const chars = text.split("");

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.5 }}
      onViewportEnter={() => setInView(true)}
      onViewportLeave={() => setInView(false)}
      className={className}
    >
      {chars.map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 5 },
            visible: { 
              opacity: 1, y: 0,
              transition: { duration: 0.08, delay: delay + index * 0.025 } 
            }
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="inline-block w-[2px] h-[1em] bg-green-500 ml-1 align-middle"
      />
    </motion.span>
  );
}
