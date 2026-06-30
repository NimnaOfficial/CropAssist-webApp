"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPage() {
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
                    Privacy Policy
                </h1>
                <p className="text-sm font-medium text-zinc-500 tracking-widest uppercase mb-16 border-b border-zinc-200 dark:border-zinc-800 pb-8">
                    Last Updated: June 2026
                </p>

                <div className="space-y-12 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">1. Data Collection</h2>
                        <p>
                            Crop Mgr Assist collects information necessary to provide enterprise-grade agricultural management services. This includes account details, yield data, resource allocation metrics, and system usage logs. We do not collect extraneous personal data outside the scope of platform functionality.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">2. Use of Information</h2>
                        <p>
                            The data collected is utilized strictly for the operational integrity of your enterprise dashboard. This includes predictive yield analytics, role-based access verification, and system optimization. Your agricultural data remains your intellectual property.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">3. Data Security & Microservices</h2>
                        <p>
                            We utilize a strict microservice architecture. User authentication data is isolated in a dedicated secure database, separate from your agricultural records. All data transfers are encrypted, and access is governed by strict Role-Based Access Control (RBAC) protocols.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">4. Contact</h2>
                        <p>
                            For privacy-related inquiries regarding your enterprise data, please contact our security team via the primary contact form on our landing page.
                        </p>
                    </section>
                </div>
            </motion.div>
        </div>
    );
}