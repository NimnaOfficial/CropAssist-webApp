"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff, ArrowRight, Leaf, Sprout, ChevronLeft } from "lucide-react";
import TypewriterText from "@/src/components/TypewriterText";
import LoadingPanel from "@/src/components/LoadingPanel";

interface LeafData {
  id: number;
  initialX: string;
  initialRotate: number;
  animateY: string;
  animateRotate: number;
  animateX: string;
  duration: number;
  delay: number;
  size: number;
}

/* ═══════ FLOATING LEAF COMPONENT ═══════ */
function FloatingLeaves() {
  const [leaves, setLeaves] = useState<LeafData[]>([]);

  useEffect(() => {
    const data = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      initialX: Math.random() * 100 + "%",
      initialRotate: Math.random() * 360,
      animateY: "120vh",
      animateRotate: Math.random() * 720 - 360,
      animateX: `${Math.random() * 100}%`,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 10,
      size: 16 + Math.random() * 20,
    }));
    setLeaves(data);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          initial={{ x: leaf.initialX, y: -50, rotate: leaf.initialRotate, opacity: 0 }}
          animate={{
            y: leaf.animateY,
            rotate: leaf.animateRotate,
            opacity: [0, 0.6, 0.6, 0],
            x: leaf.animateX
          }}
          transition={{
            duration: leaf.duration,
            repeat: Infinity,
            delay: leaf.delay,
            ease: "linear"
          }}
          className="absolute"
        >
          <Leaf size={leaf.size} className="text-green-300/40" strokeWidth={1} />
        </motion.div>
      ))}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingPanel, setShowLoadingPanel] = useState(false);
  const navigateDestRef = useRef("/dashboard");

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      setError("Please enter both username/email and password.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Send the login request to the backend
      const response = await fetch("http://localhost:8080/cropmgr_app/Api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrUsername: formData.username, password: formData.password })
      });

      if (response.ok) {
        // Parse the returned user object
        const user = await response.json();
        
        // Save the authenticated user session to localStorage so other pages (like dashboard) can use it
        localStorage.setItem("cropAssistUser", JSON.stringify(user));
        
        // Check if user must change their temporary credentials first
        if (user.mustChangePassword) {
          navigateDestRef.current = "/dashboard";
        } else if (user.role === "MANAGER") {
          navigateDestRef.current = "/manager";
        } else {
          navigateDestRef.current = "/dashboard";
        }
        setShowLoadingPanel(true);
        setTimeout(() => router.push(navigateDestRef.current), 2400);
      } else {
        setError("Invalid username/email or password.");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen relative font-sans font-light bg-black">
      
      {/* ═══════ FIXED BACKGROUND ═══════ */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center opacity-80"
        style={{ backgroundImage: "url('/login-bg.jpg')" }}
      />
      <div className="fixed inset-0 h-full bg-gradient-to-b from-green-950/60 via-black/80 to-black pointer-events-none" />
      <FloatingLeaves />

      {/* ═══════ MAIN CONTENT GRID ═══════ */}
      <div className="relative z-20 min-h-screen flex flex-col lg:flex-row w-full items-stretch justify-between p-0 gap-0">
        
        {/* LEFT SIDE — INFO & TYPING (Takes up 2/3) */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-full lg:w-2/3 flex flex-col justify-between text-white p-8 pt-12 lg:p-24 min-h-[40vh] lg:min-h-screen"
        >
          {/* TOP */}
          <Link href="/" className="inline-flex items-center gap-3 text-white/70 hover:text-green-400 transition-colors duration-300">
            <div className="w-10 h-10 border border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center rounded-none">
              <Sprout size={20} strokeWidth={1.5} />
            </div>
            <span className="text-xl tracking-widest uppercase font-gelasio">Crop Mgr Assist</span>
          </Link>

          {/* MIDDLE */}
          <div className="my-auto py-12 lg:py-0">
            <h1 className="text-5xl lg:text-7xl font-normal leading-tight mb-8 font-gelasio tracking-wide">
              Welcome <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-600">
                Back
              </span>
            </h1>

            <div className="h-[120px] max-w-md border-l border-green-500/50 pl-6">
              <TypewriterText 
                text="“Sign in to access your agricultural dashboard, monitor real-time crop yields, and streamline your entire farming enterprise.”"
                className="text-white/70 text-lg leading-relaxed font-gelasio"
                delay={0.5}
              />
            </div>
          </div>

          {/* BOTTOM - LEFT FOOTER */}
          <div className="text-white/30 text-xs tracking-widest uppercase font-light">
            © 2026 Crop Mgr Assist. All rights reserved.
          </div>
        </motion.div>

        {/* RIGHT SIDE — GLASSMORPHISM FORM (Takes up exactly 1/3, filling height/width) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="w-full lg:w-1/3 backdrop-blur-xl bg-white/10 lg:bg-white/5 border-t lg:border-t-0 lg:border-l border-white/20 lg:border-white/10 p-8 lg:p-16 flex flex-col justify-center lg:justify-between min-h-[60vh] lg:min-h-screen shadow-[0_-20px_40px_rgba(0,0,0,0.5)] lg:shadow-none rounded-t-[40px] lg:rounded-none z-30"
        >
          {/* TOP */}
          <div className="flex justify-between items-center pb-6 border-b border-white/10 mt-6 lg:mt-12">
            <h2 className="text-2xl text-white font-gelasio tracking-wide">Sign In</h2>
            <Link href="/signup" className="text-sm text-green-400 hover:text-green-300 transition-colors tracking-widest uppercase">
              Create Account
            </Link>
          </div>

          {/* MIDDLE - FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 my-auto py-12 lg:py-0">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 text-sm flex items-center justify-center">
                {error}
              </div>
            )}
            <div className="relative group">
              <User size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-green-400 transition-colors" strokeWidth={1.5} />
              <input
                type="text"
                required
                placeholder="Username or Email"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className="w-full bg-transparent border-0 border-b border-white/20 text-white pl-8 pr-6 py-3 text-sm focus:outline-none focus:border-green-400 focus:bg-white/5 transition-all duration-300 placeholder:text-white/30 font-light rounded-none"
              />
            </div>

            <div className="relative group">
              <Lock size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-green-400 transition-colors" strokeWidth={1.5} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full bg-transparent border-0 border-b border-white/20 text-white pl-8 pr-12 py-3 text-sm focus:outline-none focus:border-green-400 focus:bg-white/5 transition-all duration-300 placeholder:text-white/30 font-light rounded-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
              </button>
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 border border-white/20 bg-transparent group-hover:border-green-400 transition-colors rounded-none">
                  <input type="checkbox" className="opacity-0 absolute w-full h-full cursor-pointer peer" />
                  <div className="opacity-0 peer-checked:opacity-100 w-2.5 h-2.5 bg-green-400 transition-opacity rounded-none" />
                </div>
                <span className="text-sm text-white/60 group-hover:text-white/90 transition-colors font-light tracking-wide">Remember me</span>
              </label>
              <Link href="#" className="text-sm text-white/60 hover:text-green-400 transition-colors font-light tracking-wide">
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white py-4 flex items-center justify-center gap-3 transition-all duration-300 shadow-lg backdrop-blur-md group rounded-none disabled:opacity-50"
            >
              <span className="tracking-[0.2em] uppercase text-sm font-normal">{isLoading ? "Signing In..." : "Sign In"}</span>
              {!isLoading && <ArrowRight size={18} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />}
            </motion.button>
          </form>

          {/* BOTTOM */}
          <div className="flex flex-col items-center gap-6 mb-6 lg:mb-12">
            <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm uppercase tracking-widest font-light cursor-pointer">
              <ChevronLeft size={16} strokeWidth={1.5} /> Go Back
            </button>
            
            {/* FOOTER */}
            <div className="flex gap-6 text-[10px] text-white/30 uppercase tracking-widest">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══════ LOADING PANEL ═══════ */}
      <LoadingPanel
        isVisible={showLoadingPanel}
        message={navigateDestRef.current === "/manager" ? "Loading Manager Dashboard" : "Loading Your Farm Dashboard"}
      />
    </div>
  );
}
