import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface Select3DProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  className?: string;
  icon?: React.ReactNode;
}

export default function Select3D({ value, onChange, options, placeholder, className = "", icon }: Select3DProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-full cursor-pointer flex items-center justify-between"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {icon && <div className="shrink-0">{icon}</div>}
          <span className="truncate">{value || placeholder}</span>
        </div>
        <ChevronDown size={14} className={`shrink-0 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} />
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10, rotateX: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10, rotateX: 15 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{ transformOrigin: "top center", transformPerspective: 1000 }}
            className="absolute left-0 top-[calc(100%+8px)] w-full max-h-56 overflow-y-auto bg-white/90 dark:bg-zinc-900/95 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] z-[100] py-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {options.map((opt) => (
              <div 
                key={opt} 
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className="px-4 py-3 text-sm hover:bg-green-500/10 cursor-pointer transition-colors text-zinc-700 dark:text-white/80 active:bg-green-500/20"
              >
                {opt}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
