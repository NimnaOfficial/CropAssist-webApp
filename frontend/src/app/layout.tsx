import type { Metadata } from "next";
import { Inter, Outfit, Gelasio } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/components/ThemeProvider";
import SmoothScrolling from "@/src/components/SmoothScrolling";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const gelasio = Gelasio({ subsets: ["latin"], variable: "--font-gelasio", weight: ['400', '500', '600', '700'], style: ['normal', 'italic'] });

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
      <body className={`${inter.variable} ${outfit.variable} ${gelasio.variable} font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-500`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SmoothScrolling>
            {/* PAGE CONTENT */}
            <main className="min-h-screen">
              {children}
            </main>
          </SmoothScrolling>
        </ThemeProvider>
      </body>
    </html>
  );
}