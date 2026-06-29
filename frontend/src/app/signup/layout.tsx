import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Crop Mgr Assist",
  description: "Access your agricultural enterprise dashboard",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen z-50 bg-zinc-950">
      {children}
    </div>
  );
}
