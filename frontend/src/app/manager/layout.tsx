import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manager Dashboard | Crop Mgr Assist",
  description: "Agriculture enterprise manager dashboard",
};

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
