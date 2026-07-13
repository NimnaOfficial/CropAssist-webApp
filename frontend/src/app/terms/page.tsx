"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-32 pb-24 selection:bg-green-500/30">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-3xl mx-auto px-8"
            >
                <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 transition-colors mb-12 cursor-pointer">
                    <ArrowLeft size={16} /> Go Back
                </button>

                <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-white mb-4">
                    Terms of Service
                </h1>
                <p className="text-sm font-medium text-zinc-500 tracking-widest uppercase mb-16 border-b border-zinc-200 dark:border-zinc-800 pb-8">
                    Effective Date: June 2026
                </p>

                <div className="space-y-12 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and utilizing the Crop Mgr Assist platform, you agree to be bound by these Terms of Service. This platform is designed for enterprise agricultural management, and use of the system constitutes acceptance of our operational guidelines.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">2. Enterprise Responsibilities</h2>
                        <p>
                            Users are responsible for maintaining the confidentiality of their account credentials. The enterprise assumes liability for all actions executed under their registered worker or manager roles within the system.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">3. Platform Availability</h2>
                        <p>
                            While our microservice architecture is designed to prevent Single Points of Failure (SPOF), we do not guarantee 100% uninterrupted uptime. Scheduled maintenance and system upgrades will be communicated in advance.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">4. Limitation of Liability</h2>
                        <p>
                            Crop Mgr Assist provides data tracking and predictive tools. We are not liable for physical agricultural losses, weather events, or yield discrepancies that occur outside the scope of our software's digital tracking capabilities.
                        </p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
}
