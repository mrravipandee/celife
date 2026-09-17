import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { constructMetadata } from "@/config/seo";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = constructMetadata({
  title: "Celife CMS | Admin Dashboard",
  description: "Content Management Dashboard for Celife Health Solutions.",
  noIndex: true,
});

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="dashboard-root min-h-screen bg-[#F6F8F5] text-[#17201B] antialiased">
      <DashboardShell>{children}</DashboardShell>
    </div>
  );
}

