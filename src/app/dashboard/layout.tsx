import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { constructMetadata } from "@/config/seo";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = constructMetadata({
  title: "Admin Dashboard",
  description: "Internal workspace for THEDCO Hospitality Advisory.",
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

  return <DashboardShell>{children}</DashboardShell>;
}

