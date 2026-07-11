"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════ FARMING & AGRICULTURAL QUOTES ═══════ */
const quotes = [
  { text: "The farmer is the only man in our economy who buys everything at retail, sells everything at wholesale, and pays the freight both ways.", author: "John F. Kennedy" },
  { text: "Agriculture is the most healthful, most useful, and most noble employment of man.", author: "George Washington" },
  { text: "To forget how to dig the earth and to tend the soil is to forget ourselves.", author: "Mahatma Gandhi" },
  { text: "The ultimate goal of farming is not the growing of crops, but the cultivation and perfection of human beings.", author: "Masanobu Fukuoka" },
  { text: "Agriculture is our wisest pursuit, because it will in the end contribute most to real wealth, good morals, and happiness.", author: "Thomas Jefferson" },
  { text: "He who plants a tree plants a hope.", author: "Lucy Larcom" },
  { text: "Farming is a profession of hope.", author: "Brett Brian" },
  { text: "The discovery of agriculture was the first big step toward a civilized life.", author: "Arthur Keith" },
  { text: "Life begins the day you start a garden.", author: "Chinese Proverb" },
  { text: "Plant seeds of happiness, hope, success, and love; it will all come back to you in abundance.", author: "Steve Maraboli" },
  { text: "A society grows great when old men plant trees whose shade they know they shall never sit in.", author: "Greek Proverb" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "In every gardener there is a child who believes in The Seed Fairy.", author: "Robert Brault" },
  { text: "Don't judge each day by the harvest you reap but by the seeds that you plant.", author: "Robert Louis Stevenson" },
  { text: "We have neglected the truth that a good farmer is a craftsman of the highest order, a kind of artist.", author: "Wendell Berry" },
  { text: "When tillage begins, other arts follow. The farmers, therefore, are the founders of human civilization.", author: "Daniel Webster" },
];

/* ═══════ LEAF SVG PATHS ═══════ */
function LeafIcon({ size = 20, rotation = 0, className = "" }: { size?: number; rotation?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path
        d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8.17 20C12.59 20 17.1 16.04 19 10C19 10 17 8 17 8Z"
        fill="currentColor"
        fillOpacity="0.6"
      />
      <path
        d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8.17 20C12.59 20 17.1 16.04 19 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6 12C6 12 9 9 12 8"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />
    </svg>
  );
}

/* ═══════ ANIMATED LEAF SPINNER ═══════ */
function LeafSpinner() {
  const leafCount = 8;
  const leaves = Array.from({ length: leafCount }, (_, i) => i);

  return (
    <div className="relative w-28 h-28">
      {/* Outer rotating ring */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        {leaves.map((i) => {
          const angle = (i / leafCount) * 360;
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 38 * Math.cos(rad);
          const y = 50 + 38 * Math.sin(rad);
          return (
            <motion.div
              key={i}
              className="absolute text-green-500/70 dark:text-green-400/70"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.7, 1.1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * (2 / leafCount),
                ease: "easeInOut",
              }}
            >
              <LeafIcon size={18} rotation={angle + 90} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Inner counter-rotating ring */}
      <motion.div
        className="absolute inset-[18%]"
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i / 5) * 360;
          const rad = (angle * Math.PI) / 180;
          const x = 50 + 38 * Math.cos(rad);
          const y = 50 + 38 * Math.sin(rad);
          return (
            <motion.div
              key={`inner-${i}`}
              className="absolute text-emerald-600/50 dark:text-emerald-400/50"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            >
              <LeafIcon size={12} rotation={angle - 45} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Center pulsing dot */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-500/50" />
      </motion.div>

      {/* Orbital glow ring */}
      <motion.div
        className="absolute inset-[-8%] rounded-full border border-green-500/10 dark:border-green-400/10"
        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-[-16%] rounded-full border border-green-500/5 dark:border-green-400/5"
        animate={{ scale: [1, 1.03, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </div>
  );
}

/* ═══════ FLOATING BACKGROUND LEAVES ═══════ */
function FloatingLeaves() {
  const leafData = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 10 + Math.random() * 18,
      rotation: Math.random() * 360,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 5,
      opacity: 0.03 + Math.random() * 0.07,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {leafData.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute text-green-500 dark:text-green-400"
          style={{
            left: `${leaf.x}%`,
            opacity: leaf.opacity,
          }}
          initial={{ y: "-10%", rotate: leaf.rotation }}
          animate={{
            y: "110%",
            rotate: leaf.rotation + 360,
            x: [0, 30, -20, 15, 0],
          }}
          transition={{
            duration: leaf.duration,
            repeat: Infinity,
            delay: leaf.delay,
            ease: "linear",
          }}
        >
          <LeafIcon size={leaf.size} />
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════ PROGRESS BAR ═══════ */
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-48 h-[3px] bg-zinc-200/30 dark:bg-white/5 rounded-full overflow-hidden mt-8">
      <motion.div
        className="h-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 rounded-full"
        style={{ backgroundSize: "200% 100%" }}
        initial={{ width: "0%" }}
        animate={{
          width: `${progress}%`,
          backgroundPosition: ["0% 0%", "100% 0%"],
        }}
        transition={{
          width: { duration: 0.5, ease: "easeOut" },
          backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" },
        }}
      />
    </div>
  );
}

/* ═══════ MAIN LOADING PANEL COMPONENT ═══════ */
interface LoadingPanelProps {
  isVisible: boolean;
  message?: string;
  onComplete?: () => void;
  duration?: number; // minimum display time in ms
}

export default function LoadingPanel({
  isVisible,
  message = "Preparing your experience",
  onComplete,
  duration = 2200,
}: LoadingPanelProps) {
  const [quote, setQuote] = useState(quotes[0]);
  const [progress, setProgress] = useState(0);
  const [shouldRender, setShouldRender] = useState(false);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pick a random quote when the panel becomes visible
  useEffect(() => {
    if (isVisible) {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      setProgress(0);
      setShouldRender(true);
      startTimeRef.current = Date.now();

      // Simulate progress
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const pct = Math.min((elapsed / duration) * 100, 100);
        setProgress(pct);

        if (pct >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      }, 50);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isVisible, duration]);

  // Handle exit after animation
  const handleExitComplete = () => {
    setShouldRender(false);
    onComplete?.();
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isVisible && shouldRender && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-zinc-50/95 dark:bg-[#050505]/95 backdrop-blur-2xl" />

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.03] via-transparent to-emerald-500/[0.03]" />

          {/* Floating background leaves */}
          <FloatingLeaves />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Leaf Spinner */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <LeafSpinner />
            </motion.div>

            {/* Loading Message */}
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 text-xs uppercase tracking-[0.3em] text-zinc-400 dark:text-white/30 font-light"
            >
              {message}
            </motion.p>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ProgressBar progress={progress} />
            </motion.div>

            {/* Quote */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 max-w-md text-center px-6"
            >
              <p className="text-sm text-zinc-500 dark:text-white/40 italic leading-relaxed font-light">
                &ldquo;{quote.text}&rdquo;
              </p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-zinc-400 dark:text-white/20">
                — {quote.author}
              </p>
            </motion.div>

            {/* Bottom brand */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-16 flex items-center gap-2"
            >
              <div className="w-5 h-5 text-green-500 dark:text-green-400">
                <LeafIcon size={20} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.35em] text-zinc-300 dark:text-white/15 font-light">
                CropAssist
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
