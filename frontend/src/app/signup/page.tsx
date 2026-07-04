"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Lock, MapPin, Sprout, Users, CreditCard, Eye, EyeOff, ArrowRight, Leaf, ChevronLeft, ChevronRight } from "lucide-react";
import TypewriterText from "@/src/components/TypewriterText";

/* ═══════ MULTI-STEP SIGN UP FIELDS ═══════ */
const signUpSteps = [
  {
    title: "Personal",
    fields: [
      { name: "firstName", label: "First Name", type: "text", icon: User },
      { name: "lastName", label: "Last Name", type: "text", icon: User },
      { name: "email", label: "Email Address", type: "email", icon: Mail },
      { name: "phone", label: "Phone Number", type: "tel", icon: Phone },
      { name: "age", label: "Age", type: "number", icon: User },
      { name: "nic", label: "NIC Number", type: "text", icon: CreditCard },
    ]
  },
  {
    title: "Farm",
    fields: [
      { name: "farmAddress", label: "Farm Address", type: "text", icon: MapPin },
      { name: "farming", label: "Farming Type", type: "text", icon: Sprout },
      { name: "members", label: "Team Size", type: "number", icon: Users },
    ]
  },
  {
    title: "Security",
    fields: [
      { name: "username", label: "Username", type: "text", icon: User },
      { name: "password", label: "Password", type: "password", icon: Lock },
      { name: "confirmPassword", label: "Confirm Password", type: "password", icon: Lock },
    ]
  }
];

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

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (step < signUpSteps.length - 1) {
      setStep(step + 1);
    } else {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match!");
        return;
      }
      
      setIsLoading(true);
      try {
        const payload = {
          fullName: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
          email: formData.email,
          phone: formData.phone,
          nic: formData.nic,
          age: parseInt(formData.age) || null,
          address: formData.farmAddress,
          farmingType: formData.farming,
          teamSize: parseInt(formData.members) || 1,
          username: formData.username,
          passwordHash: formData.password, 
          role: "FARMER",
          status: "ACTIVE"
        };

        const response = await fetch("http://localhost:8081/Api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          router.push("/login");
        } else {
          setError("Failed to create account. Email or NIC might already exist.");
        }
      } catch (err) {
        setError("Failed to connect to the server.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const currentFields = signUpSteps[step].fields;

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
              Join the <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-600">
                Future
              </span>
            </h1>

            <div className="h-[120px] max-w-md border-l border-green-500/50 pl-6">
              <TypewriterText 
                text="“Create your enterprise account to connect your farm's data, manage resources efficiently, and maximize yield like never before.”"
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
            <h2 className="text-2xl text-white font-gelasio tracking-wide">Sign Up</h2>
            <Link href="/login" className="text-sm text-green-400 hover:text-green-300 transition-colors tracking-widest uppercase">
              Sign In
            </Link>
          </div>

          {/* MIDDLE - FORM & STEPPER */}
          <div className="my-auto py-12 lg:py-0 flex flex-col gap-6">
            {/* STEP INDICATOR */}
            <div className="flex items-center justify-between">
              {signUpSteps.map((s, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 flex-1 animate-fade-slide-up">
                  <div className={`w-8 h-8 rounded-none border flex items-center justify-center text-xs transition-colors duration-500 ${
                    idx < step ? "bg-green-500/80 border-green-500 text-white" : 
                    idx === step ? "bg-white/20 border-white/40 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]" : 
                    "bg-transparent border-white/10 text-white/30"
                  }`}>
                    {idx < step ? "✓" : idx + 1}
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider ${idx === step ? "text-white" : "text-white/40"}`}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 text-sm flex items-center justify-center -mt-2">
                  {error}
                </div>
              )}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-6"
                >
                  {currentFields.map((field) => {
                    const Icon = field.icon;
                    const isPassword = field.type === "password";

                    return (
                      <div key={field.name} className="relative group">
                        <Icon size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-green-400 transition-colors" strokeWidth={1.5} />
                        <input
                          type={isPassword ? (showPassword ? "text" : "password") : field.type}
                          required
                          placeholder={field.label}
                          value={formData[field.name] || ""}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          className="w-full bg-transparent border-0 border-b border-white/20 text-white pl-8 pr-12 py-3 text-sm focus:outline-none focus:border-green-400 focus:bg-white/5 transition-all duration-300 placeholder:text-white/30 font-light rounded-none"
                        />
                        {isPassword && (
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-4 mt-8">
                {step > 0 && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(step - 1)}
                    className="w-14 h-[56px] bg-white/5 hover:bg-white/10 border border-white/20 rounded-none text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md"
                  >
                    <ChevronLeft size={20} strokeWidth={1.5} />
                  </motion.button>
                )}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 h-[56px] bg-white/5 hover:bg-white/10 border border-white/20 rounded-none text-white flex items-center justify-center gap-3 transition-all duration-300 shadow-lg backdrop-blur-md group disabled:opacity-50"
                >
                  <span className="tracking-[0.2em] uppercase text-sm font-normal">
                    {isLoading ? "Processing..." : (step === signUpSteps.length - 1 ? "Create Account" : "Next Step")}
                  </span>
                  {!isLoading && (step === signUpSteps.length - 1 ? (
                    <ArrowRight size={18} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <ChevronRight size={18} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
                  ))}
                </motion.button>
              </div>
            </form>
          </div>

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
    </div>
  );
}
