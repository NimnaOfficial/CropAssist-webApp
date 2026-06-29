import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Crop Mgr Assist",
  description: "Your agricultural enterprise dashboard",
};

export default function DashboardLayout({
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
