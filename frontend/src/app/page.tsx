"use client";

import { useState } from "react";
import { Sprout, ArrowRight, ArrowLeft, Leaf, BarChart3, ShieldCheck, Mail, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";

const backgrounds = [
  "https://images.wallpaperscraft.com/image/single/tree_stones_light_1359768_3840x2400.jpg",
  "https://images.wallpaperscraft.com/image/single/forest_fog_trees_126479_3840x2400.jpg",
  "https://images7.alphacoders.com/118/thumb-1920-1184570.jpg"
];

/* Agriculture-themed background for Services section */
const servicesBg = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80";

export default function LandingPage() {
  const [currentBg, setCurrentBg] = useState(0);
  const [formResult, setFormResult] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const nextBg = () => setCurrentBg((prev) => (prev === backgrounds.length - 1 ? 0 : prev + 1));
  const prevBg = () => setCurrentBg((prev) => (prev === 0 ? backgrounds.length - 1 : prev - 1));

  /* ===== Web3Forms Contact Handler ===== */
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormLoading(true);
    setFormResult("");
    const formData = new FormData(event.currentTarget);
    formData.append("access_key", "d0cf40c6-4dc6-4123-bcd2-9bc2f2dc7983");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setFormResult(data.success ? "success" : "error");
      if (data.success) (event.target as HTMLFormElement).reset();
    } catch {
      setFormResult("error");
    }
    setFormLoading(false);
  };

  /* ===== Smooth fade-in/out variants ===== */
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 80, scale: 0.96, filter: "blur(6px)" },
    visible: {
      opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const staggerContainer: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } }
  };

  const staggerItem: Variants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const arrowVariants: Variants = {
    rest: { x: 0 },
    hover: { x: 8, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <div className="w-full bg-zinc-50 dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50 overflow-x-hidden">

      {/* ════════════════════ HERO SECTION ════════════════════ */}
      <section id="home" className="relative w-full h-screen overflow-hidden">

        {/* Animated Background Crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBg}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ backgroundImage: `url('${backgrounds[currentBg]}')` }}
          />
        </AnimatePresence>

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50 z-[1]" />

        {/* LEFT ULTRA GLASSMORPHISM OVERLAY */}
        <div className="absolute top-0 left-0 w-full lg:w-[55%] h-full backdrop-blur-[80px] bg-white/40 dark:bg-zinc-950/50 z-10" />

        {/* HERO CONTENT */}
        <div className="absolute inset-0 z-30 flex flex-col justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, filter: "blur(20px)", y: 60 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full px-8 lg:px-32"
          >
            {/* Subtitle with animated line */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex items-center gap-4 mb-6 ml-1"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="h-[1px] bg-green-500"
              />
              <p className="text-zinc-800 dark:text-white/90 text-xs font-bold tracking-[0.4em] uppercase animate-text-reveal">
                Amazing <span className="text-green-600 dark:text-green-400">Enterprise</span>
              </p>
            </motion.div>

            {/* THE MASKING ILLUSION */}
            <div className="relative font-space">
              <motion.h1
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="absolute top-0 left-0 w-full text-[14vw] lg:text-[11vw] font-black leading-[0.85] tracking-tighter bg-cover bg-center bg-no-repeat bg-fixed transition-all duration-1000"
                style={{
                  backgroundImage: `url('${backgrounds[currentBg]}')`,
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  clipPath: "inset(0 50% 0 0)",
                }}
              >
                CROP MGR <br /> ASSIST
              </motion.h1>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-[14vw] lg:text-[11vw] font-black leading-[0.85] tracking-tighter text-zinc-900 dark:text-white drop-shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
                style={{ clipPath: "inset(0 0 0 50%)" }}
              >
                CROP MGR <br /> ASSIST
              </motion.h1>
            </div>

            {/* Hero tagline & CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="w-full lg:w-[40%] mt-14 ml-1 pointer-events-auto"
            >
              <p
                className="text-zinc-700 dark:text-zinc-200 text-lg italic leading-relaxed mb-10 max-w-md border-l-2 border-green-500 pl-6 font-serif-elegant"
              >
                &ldquo;There is a moment in the life of any aspiring agriculturist that it is time to scale their enterprise with the right tools.&rdquo;
              </p>
              <motion.div initial="rest" whileHover="hover" animate="rest" className="inline-block">
                <Link
                  href="#about"
                  className="group relative overflow-hidden inline-flex items-center gap-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs uppercase tracking-[0.2em] px-10 py-5 hover:bg-green-600 dark:hover:bg-green-500 transition-all duration-500 shadow-2xl"
                >
                  <span className="relative z-10 flex items-center gap-4">
                    Explore
                    <motion.span variants={arrowVariants}>
                      <ArrowRight size={16} />
                    </motion.span>
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT SIDE PAGINATION */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-6 z-40">
          <div className="w-[1px] h-24 bg-white/30" />
          {backgrounds.map((_, idx) => (
            <motion.div
              key={idx}
              animate={{
                backgroundColor: currentBg === idx ? "rgba(34, 197, 94, 1)" : "rgba(255, 255, 255, 0.3)",
                scale: currentBg === idx ? 1.5 : 1
              }}
              className="w-2 h-2 rotate-45 cursor-pointer"
              onClick={() => setCurrentBg(idx)}
            />
          ))}
          <div className="w-[1px] h-24 bg-white/30" />
        </div>

        {/* BOTTOM RIGHT CAROUSEL CONTROLS */}
        <div className="absolute bottom-0 right-0 lg:right-16 flex z-40 backdrop-blur-md bg-white/10 dark:bg-black/20">
          <motion.button
            whileHover={{ backgroundColor: "rgba(39, 39, 42, 0.9)", color: "#ffffff" }}
            whileTap={{ scale: 0.95 }}
            onClick={prevBg}
            className="w-20 h-20 flex items-center justify-center text-white transition-colors border-r border-white/10"
          >
            <ArrowLeft size={24} />
          </motion.button>
          <motion.button
            whileHover={{ backgroundColor: "rgba(34, 197, 94, 0.9)", color: "#ffffff" }}
            whileTap={{ scale: 0.95 }}
            onClick={nextBg}
            className="w-20 h-20 flex items-center justify-center text-white transition-colors"
          >
            <ArrowRight size={24} />
          </motion.button>
        </div>

        {/* BOTTOM GRADIENT FADE — seamless blend into next section */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 to-transparent z-30 pointer-events-none" />
      </section>

      {/* ════════════════════ ABOUT SECTION ════════════════════ */}
      <section id="about" className="relative w-full py-40 px-8 lg:px-32 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeUp}
          className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-[1px] bg-green-500" />
              <h3 className="text-green-600 dark:text-green-500 text-xs font-bold tracking-[0.4em] uppercase">About Us</h3>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl lg:text-7xl font-black tracking-tight mb-10 font-space"
            >
              Rooted in Tech. <br />Growing the Future.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-12 text-xl border-l-2 border-green-500 pl-8 font-serif-elegant"
            >
              &ldquo;Crop Mgr Assist bridges the gap between traditional farming and modern enterprise architecture. We provide a robust, microservice-driven platform designed specifically to handle large-scale agricultural data with absolute precision.&rdquo;
            </motion.p>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              variants={staggerContainer}
              className="flex flex-wrap items-center gap-12"
            >
              {[
                { icon: <Leaf className="text-green-600 dark:text-green-500" size={24} />, label: "Sustainable" },
                { icon: <ShieldCheck className="text-green-600 dark:text-green-500" size={24} />, label: "Secure Data" }
              ].map((item) => (
                <motion.div key={item.label} variants={staggerItem} whileHover={{ scale: 1.05, y: -5 }} className="flex items-center gap-6 group cursor-pointer">
                  <div className="w-16 h-16 border border-zinc-300 dark:border-white/20 flex items-center justify-center group-hover:border-green-500 group-hover:bg-green-500/10 transition-all duration-500 shadow-xl backdrop-blur-md animate-pulse-glow">
                    {item.icon}
                  </div>
                  <span className="font-black tracking-widest text-sm uppercase">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[600px] w-full border border-zinc-200 dark:border-white/10 shadow-2xl group overflow-hidden"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <div className="absolute inset-0 bg-green-500/10 dark:bg-green-900/40 mix-blend-multiply z-10 transition-opacity duration-700 group-hover:opacity-0" />
              <img src={backgrounds[1]} alt="Agriculture Enterprise" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* BOTTOM GRADIENT FADE INTO SERVICES */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-green-900/20 dark:from-green-950/30 to-transparent pointer-events-none" />
      </section>

      {/* ════════════════════ SERVICES SECTION ════════════════════ */}
      <section id="services" className="relative w-full py-40 px-8 lg:px-32 overflow-hidden">

        {/* Agriculture Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-15 dark:opacity-10"
          style={{ backgroundImage: `url('${servicesBg}')` }}
        />
        <div className="absolute inset-0 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-sm" />

        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#22c55e08_1px,transparent_1px),linear-gradient(to_bottom,#22c55e08_1px,transparent_1px)] bg-[size:40px_40px]" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeUp}
          className="text-center max-w-4xl mx-auto mb-28 relative z-10"
        >
          <div className="flex items-center justify-center gap-6 mb-6">
            <motion.div initial={{ width: 0 }} whileInView={{ width: 48 }} viewport={{ once: false }} transition={{ duration: 0.8 }} className="h-[1px] bg-green-500" />
            <h3 className="text-green-600 dark:text-green-500 text-xs font-bold tracking-[0.4em] uppercase">Our Services</h3>
            <motion.div initial={{ width: 0 }} whileInView={{ width: 48 }} viewport={{ once: false }} transition={{ duration: 0.8 }} className="h-[1px] bg-green-500" />
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: false }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl lg:text-7xl font-black tracking-tight font-space"
          >
            Enterprise Solutions
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10"
        >
          {[
            { title: "Yield Tracking", icon: <BarChart3 size={40} />, desc: "Monitor crop growth and predict harvest outputs with precision data grids and robust analytics." },
            { title: "Resource Management", icon: <Sprout size={40} />, desc: "Allocate water, fertilizer, and labor efficiently across all active fields to maximize total yield." },
            { title: "Secure Operations", icon: <ShieldCheck size={40} />, desc: "Role-based access control ensures your critical agricultural data is only visible to authorized personnel." }
          ].map((service, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              whileHover={{ y: -12, scale: 1.02 }}
              className="backdrop-blur-3xl bg-white/70 dark:bg-zinc-950/70 p-14 border border-zinc-200/50 dark:border-white/10 transition-all duration-500 hover:border-green-500 dark:hover:border-green-500 group relative overflow-hidden shadow-2xl animate-pulse-glow"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700 ease-out" />
              <div className="w-20 h-20 border border-zinc-300 dark:border-white/20 flex items-center justify-center text-zinc-400 group-hover:text-green-500 group-hover:border-green-500 transition-all duration-500 mb-10 shadow-lg backdrop-blur-md bg-white/50 dark:bg-black/30">
                {service.icon}
              </div>
              <motion.h4
                className="text-3xl font-black mb-6 font-space group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-500"
              >
                {service.title}
              </motion.h4>
              <p className="text-zinc-600 dark:text-zinc-300 text-lg leading-relaxed border-l-2 border-zinc-200 dark:border-zinc-700 pl-4 group-hover:border-green-500 transition-colors duration-500 font-serif-elegant">
                &ldquo;{service.desc}&rdquo;
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* BOTTOM GRADIENT FADE INTO CONTACT */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 to-transparent pointer-events-none" />
      </section>

      {/* ════════════════════ CONTACT SECTION ════════════════════ */}
      <section id="contact" className="relative w-full py-40 px-8 lg:px-32 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={fadeUp}
          className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-20 relative z-10"
        >
          {/* LEFT SIDE — Info */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-[1px] bg-green-500" />
              <h3 className="text-green-600 dark:text-green-500 text-xs font-bold tracking-[0.4em] uppercase">Contact</h3>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: false }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl lg:text-7xl font-black tracking-tight mb-10 font-space"
            >
              Ready to Scale? <br />Let&apos;s Connect.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-zinc-700 dark:text-zinc-300 leading-relaxed mb-12 text-xl border-l-2 border-green-500 pl-8 font-serif-elegant"
            >
              &ldquo;Reach out to our team of agricultural engineers. We&apos;re ready to integrate our platform into your existing enterprise architecture seamlessly.&rdquo;
            </motion.p>
          </div>

          {/* RIGHT SIDE — Web3Forms */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1"
          >
            <form onSubmit={onSubmit} className="flex flex-col gap-8 relative z-10 backdrop-blur-3xl bg-white/50 dark:bg-zinc-950/50 p-12 border border-zinc-200/50 dark:border-white/10 shadow-2xl">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-green-400 to-green-600" />

              <div className="flex flex-col gap-3">
                <label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-2">Full Name</label>
                <input id="name" name="name" type="text" required placeholder="John Doe" className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/10 px-8 py-5 focus:outline-none focus:border-green-500 focus:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all duration-300" />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-2">Email Address</label>
                <input id="email" name="email" type="email" required placeholder="john@enterprise.com" className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/10 px-8 py-5 focus:outline-none focus:border-green-500 focus:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all duration-300" />
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-2">Message</label>
                <textarea id="message" name="message" required placeholder="How can we help?" rows={5} className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/10 px-8 py-5 focus:outline-none focus:border-green-500 focus:shadow-[0_0_20px_rgba(34,197,94,0.15)] transition-all duration-300 resize-none" />
              </div>

              <motion.button
                type="submit"
                disabled={formLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-black py-6 flex items-center justify-center gap-4 hover:bg-green-600 dark:hover:bg-green-500 hover:text-white dark:hover:text-zinc-950 transition-all duration-500 uppercase tracking-[0.3em] text-sm mt-2 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mail size={20} />
                {formLoading ? "Sending..." : "Send Message"}
              </motion.button>

              {/* Form Result Feedback */}
              <AnimatePresence>
                {formResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex items-center gap-3 px-6 py-4 text-sm font-bold uppercase tracking-wider ${
                      formResult === "success"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/30"
                        : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30"
                    }`}
                  >
                    {formResult === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    {formResult === "success" ? "Message sent successfully!" : "Something went wrong. Try again."}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </motion.div>

        {/* BOTTOM GRADIENT FADE INTO FOOTER */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-zinc-100 dark:from-zinc-900/50 to-transparent pointer-events-none" />
      </section>

    </div>
  );
}