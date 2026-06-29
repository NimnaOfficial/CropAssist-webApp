import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import Navbar from "@/src/components/Navbar";
import SmoothScrolling from "@/src/components/SmoothScrolling";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  title: "Crop Mgr Assist | Modern Enterprise",
  description: "Advanced agricultural management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SmoothScrolling>
            {/* GLOBAL ANIMATED NAVBAR */}
            <Navbar />

            {/* PAGE CONTENT — no pt-16 so hero expands to top */}
            <main className="min-h-screen">
              {children}
            </main>

            {/* GLOBAL FOOTER */}
            <footer className="bg-zinc-100 dark:bg-zinc-900/50 py-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs font-bold tracking-[0.1em] uppercase text-zinc-500 relative z-10 gap-6">
                <p>© 2026 Crop Mgr Assist. <span className="text-green-500">All rights reserved.</span></p>
                <div className="flex gap-8">
                  <Link href="/privacy" className="hover:text-green-500 transition-colors duration-300">Privacy Policy</Link>
                  <Link href="/terms" className="hover:text-green-500 transition-colors duration-300">Terms of Service</Link>
                </div>
              </div>
            </footer>
          </SmoothScrolling>
        </ThemeProvider>
      </body>
    </html>
  );
}