"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sprout, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-transparent pointer-events-none">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between pointer-events-auto text-zinc-900 dark:text-zinc-50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter drop-shadow-lg">
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Sprout className="text-green-600 dark:text-green-500" size={24} />
            </motion.div>
            <span>CROP<span className="font-light text-green-600 dark:text-green-500">MGR</span></span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden md:flex items-center gap-8 text-xs font-bold tracking-[0.15em] uppercase drop-shadow-lg"
        >
          {["Home", "About", "Services", "Contact"].map((item) => (
            <Link key={item} href={`/#${item.toLowerCase()}`} className="relative group transition-colors hover:text-green-600 dark:hover:text-green-500">
              {item}
              <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-green-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}

          {/* THEME TOGGLE */}
          {mounted && (
            <motion.button
              whileHover={{ scale: 1.15, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 flex items-center justify-center border border-zinc-300 dark:border-zinc-700 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-500/10 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </motion.button>
          )}

          <Link href="/login" className="px-5 py-2 border border-zinc-900 dark:border-zinc-100 hover:bg-green-600 hover:border-green-600 hover:text-white dark:hover:bg-green-500 dark:hover:border-green-500 dark:hover:text-zinc-950 transition-all duration-300">
            JOIN NOW
          </Link>
        </motion.div>
      </div>
    </nav>
  );
}
