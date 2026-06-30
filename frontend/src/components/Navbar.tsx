"use client";

import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { Sprout, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useCallback, useRef } from "react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useEffect(() => { setMounted(true); }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const handleNavClick = useCallback((e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 400);
  }, []);

  const navLinks = ["Home", "About", "Services", "Contact"];

  return (
    <>
      {/* ═══════════════════ MAIN NAVBAR (Always visible, glass mist on scroll) ═══════════════════ */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl border-b border-white/20 dark:border-white/5 shadow-lg shadow-black/5 dark:shadow-black/20' 
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between text-zinc-900 dark:text-zinc-50 transition-all duration-300">
          
          {/* Logo */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter drop-shadow-lg">
              <motion.div whileHover={{ rotate: 90 }} transition={{ type: "spring", stiffness: 200 }}>
                <Sprout className="text-green-600 dark:text-green-500" size={28} strokeWidth={2.5} />
              </motion.div>
              <span className="text-2xl">CROP<span className="font-light text-green-600 dark:text-green-500">MGR</span></span>
            </Link>
          </motion.div>

          {/* Desktop Links */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:flex items-center gap-8 text-xs font-bold tracking-[0.15em] uppercase drop-shadow-lg absolute left-1/2 -translate-x-1/2"
          >
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => handleNavClick(e, item.toLowerCase())}
                className="relative group transition-colors hover:text-green-600 dark:hover:text-green-500 py-2"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-green-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </motion.div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden md:flex items-center gap-4"
            >
              {mounted && (
                <motion.button
                  whileHover={{ scale: 1.15, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-10 h-10 flex items-center justify-center border border-zinc-300 dark:border-zinc-700 hover:border-green-500 dark:hover:bg-green-500/10 rounded-full transition-all duration-300"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </motion.button>
              )}
              <Link href="/login" className="px-6 py-2.5 border-2 border-zinc-900 dark:border-zinc-100 hover:bg-green-600 hover:border-green-600 hover:text-white dark:hover:bg-green-500 dark:hover:text-zinc-950 transition-all duration-300 rounded-sm">
                JOIN NOW
              </Link>
            </motion.div>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(prev => !prev)}
                className="w-10 h-10 flex flex-col items-center justify-center gap-[4px] bg-zinc-900 dark:bg-white rounded-full shadow-lg relative z-[70]"
              >
                <span className="block w-4 h-[2px] bg-zinc-50 dark:bg-zinc-950 rounded-full" />
                <span className="block w-4 h-[2px] bg-zinc-50 dark:bg-zinc-950 rounded-full" />
                <span className="block w-4 h-[2px] bg-zinc-50 dark:bg-zinc-950 rounded-full" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════ FULLSCREEN MENU OVERLAY (CIRCLE REVEAL) ═══════════════════ */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ clipPath: "circle(0px at calc(100% - 2.5rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)" }}
            exit={{ clipPath: "circle(0px at calc(100% - 2.5rem) 2.5rem)" }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
            className="fixed inset-0 z-[65] bg-zinc-950 dark:bg-zinc-950 flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-zinc-950 to-zinc-950 pointer-events-none" />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative z-10 flex flex-col items-center gap-0 w-full"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mb-12 flex items-center gap-3"
              >
                <Sprout className="text-green-500" size={24} strokeWidth={2} />
                <span className="text-sm tracking-[0.4em] uppercase text-white/40 font-bold">Menu</span>
              </motion.div>

              {navLinks.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex justify-center"
                >
                  <a
                    href={`#${item.toLowerCase()}`}
                    onClick={(e) => handleNavClick(e, item.toLowerCase())}
                    className="relative flex items-center justify-center w-full max-w-lg py-4 group"
                  >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                    <span className="text-4xl md:text-5xl font-black tracking-tight text-white/70 group-hover:text-green-400 transition-all duration-300 uppercase z-10">
                      {item}
                    </span>
                  </a>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-16 flex items-center gap-6"
              >
                {mounted && (
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="w-14 h-14 flex items-center justify-center border border-white/10 rounded-full hover:border-green-500 hover:bg-green-500/10 text-white/60 hover:text-green-400 transition-all duration-300 bg-white/5"
                  >
                    {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
                  </button>
                )}
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-10 py-4 bg-green-500 text-zinc-950 text-sm tracking-[0.2em] font-black uppercase hover:bg-green-400 transition-all duration-300 rounded-full shadow-lg hover:shadow-green-500/25"
                >
                  JOIN NOW
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
