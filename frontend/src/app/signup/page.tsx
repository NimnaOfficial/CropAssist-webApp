"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, Lock, MapPin, Sprout, Users, CreditCard, Eye, EyeOff, ArrowRight, Leaf, ChevronLeft, ChevronRight } from "lucide-react";
import TypewriterText from "@/src/components/TypewriterText";
import LoadingPanel from "@/src/components/LoadingPanel";
import Select3D from "@/src/components/Select3D";

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
      { name: "country", label: "Country", type: "select", icon: MapPin },
      { name: "province", label: "Province", type: "select", icon: MapPin },
      { name: "district", label: "District", type: "select", icon: MapPin },
      { name: "area", label: "Area/Town", type: "text", icon: MapPin },
      { name: "addressLine", label: "Street Address", type: "text", icon: MapPin },
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
  const [showLoadingPanel, setShowLoadingPanel] = useState(false);

  const locationData: Record<string, string[]> = {
    "Central": ["Kandy", "Matale", "Nuwara Eliya"],
    "Eastern": ["Ampara", "Batticaloa", "Trincomalee"],
    "North Central": ["Anuradhapura", "Polonnaruwa"],
    "North Western": ["Kurunegala", "Puttalam"],
    "Northern": ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
    "Sabaragamuwa": ["Kegalle", "Ratnapura"],
    "Southern": ["Galle", "Hambantota", "Matara"],
    "Uva": ["Badulla", "Monaragala"],
    "Western": ["Colombo", "Gampaha", "Kalutara"]
  };

  const handleChange = (name: string, value: string) => {
    // Prevent typing numbers in name fields
    if (name === "firstName" || name === "lastName") {
      value = value.replace(/[0-9]/g, "");
    }
    
    // Reset district if province changes
    if (name === "province") {
      setFormData(prev => ({ ...prev, [name]: value, district: "" }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = async (currentStep: number): Promise<boolean> => {
    setError("");

    if (currentStep === 0) {
      if (!formData.firstName || formData.firstName.trim().length < 2) { setError("First name must be at least 2 characters."); return false; }
      if (!formData.lastName || formData.lastName.trim().length < 2) { setError("Last name must be at least 2 characters."); return false; }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email || !emailRegex.test(formData.email)) { setError("Please enter a valid email address."); return false; }
      
      const phoneRegex = /^(?:0|0094|\+94)?(?:7|1)\d{8}$/;
      if (!formData.phone || !phoneRegex.test(formData.phone)) { setError("Please enter a valid phone number (e.g., 0712345678 or +94712345678)."); return false; }
      
      const ageNum = parseInt(formData.age);
      if (!formData.age || isNaN(ageNum) || ageNum < 18 || ageNum > 100) { setError("Age must be between 18 and 100."); return false; }
      
      const nicRegex = /^([0-9]{9}[xXvV]|[0-9]{12})$/;
      if (!formData.nic || !nicRegex.test(formData.nic)) { setError("Please enter a valid NIC number."); return false; }
    }
    else if (currentStep === 1) {
      if (!formData.country) { setError("Please select a Country."); return false; }
      if (!formData.province) { setError("Please select a Province."); return false; }
      if (!formData.district) { setError("Please select a District."); return false; }
      if (!formData.area || formData.area.trim().length < 2) { setError("Please enter an Area/Town."); return false; }
      if (!formData.addressLine || formData.addressLine.trim().length < 2) { setError("Please enter a Street Address."); return false; }
      if (!formData.farming || formData.farming.trim().length < 2) { setError("Please enter a valid farming type."); return false; }
      const teamNum = parseInt(formData.members);
      if (!formData.members || isNaN(teamNum) || teamNum < 1) { setError("Team size must be at least 1."); return false; }
    }
    else if (currentStep === 2) {
      if (!formData.username || formData.username.trim().length < 4) { setError("Username must be at least 4 characters."); return false; }
      
      // Async uniqueness check
      try {
        const usersRes = await fetch("http://localhost:8080/cropmgr_app/Api/users");
        if (usersRes.ok) {
          const allUsers = await usersRes.json();
          if (Array.isArray(allUsers) && allUsers.some((u: any) => u.username === formData.username)) {
            setError("Username is already taken. Please choose another.");
            return false;
          }
        }
      } catch(e) {
        // Backend unreachable, ignore for now
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!formData.password || !passwordRegex.test(formData.password)) {
        setError("Password must be 8+ characters with uppercase, lowercase, number, and special character.");
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match!");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const isValid = await validateStep(step);
    if (!isValid) return;

    if (step < signUpSteps.length - 1) {
      setStep(step + 1);
    } else {
      
      setIsLoading(true);
      try {
        const fullAddress = `${formData.addressLine || ''}, ${formData.area || ''}, ${formData.district || ''}, ${formData.province || ''}, ${formData.country || ''}`;

        const payload = {
          fullName: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
          email: formData.email,
          phone: formData.phone,
          nic: formData.nic,
          age: parseInt(formData.age) || null,
          address: fullAddress,
          farmingType: formData.farming,
          teamSize: parseInt(formData.members) || 1,
          username: formData.username,
          passwordHash: formData.password, 
          role: "FARMER",
          status: "ACTIVE"
        };

        const response = await fetch("http://localhost:8080/cropmgr_app/Api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          setShowLoadingPanel(true);
          setTimeout(() => router.push("/login"), 2400);
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
                      <div key={field.name} className="relative group flex flex-col gap-1">
                        <div className="relative">
                          <Icon size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-green-400 transition-colors" strokeWidth={1.5} />
                          {field.type === "select" ? (
                            <Select3D
                              value={formData[field.name] || ""}
                              onChange={(val) => handleChange(field.name, val)}
                              options={
                                field.name === "country" ? ["Sri Lanka"] :
                                field.name === "province" ? Object.keys(locationData) :
                                field.name === "district" ? (locationData[formData.province] || []) : []
                              }
                              placeholder={field.label}
                              className="border-0 border-b border-white/20 pb-1 text-white placeholder:text-white/30 pl-8 font-light"
                            />
                          ) : (
                            <input
                              type={isPassword ? (showPassword ? "text" : "password") : field.type}
                              required
                              placeholder={field.label}
                              value={formData[field.name] || ""}
                              onChange={(e) => handleChange(field.name, e.target.value)}
                              className="w-full bg-transparent border-0 border-b border-white/20 text-white pl-8 pr-12 py-3 text-sm focus:outline-none focus:border-green-400 focus:bg-white/5 transition-all duration-300 placeholder:text-white/30 font-light rounded-none"
                            />
                          )}
                          
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

                        {field.name === "password" && (
                          <div className="mt-2 flex flex-col gap-1 text-xs text-white/50 pl-8 font-normal">
                            <p className={(formData.password?.length >= 8) ? "text-green-400" : ""}>{(formData.password?.length >= 8) ? "✓" : "○"} At least 8 characters</p>
                            <p className={/[A-Z]/.test(formData.password || "") ? "text-green-400" : ""}>{/[A-Z]/.test(formData.password || "") ? "✓" : "○"} 1 Uppercase letter</p>
                            <p className={/[a-z]/.test(formData.password || "") ? "text-green-400" : ""}>{/[a-z]/.test(formData.password || "") ? "✓" : "○"} 1 Lowercase letter</p>
                            <p className={/\d/.test(formData.password || "") ? "text-green-400" : ""}>{/\d/.test(formData.password || "") ? "✓" : "○"} 1 Number</p>
                            <p className={/[@$!%*?&]/.test(formData.password || "") ? "text-green-400" : ""}>{/[@$!%*?&]/.test(formData.password || "") ? "✓" : "○"} 1 Special character (@$!%*?&)</p>
                          </div>
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

      {/* ═══════ LOADING PANEL ═══════ */}
      <LoadingPanel
        isVisible={showLoadingPanel}
        message="Account Created Successfully"
      />
    </div>
  );
}
