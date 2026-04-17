import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin — Claude Code Buddy Skin Store",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
