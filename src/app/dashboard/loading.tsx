import React from "react";
import { LoadingState } from "@/components/ui/LoadingState";

export default function DashboardLoading() {
  return (
    <div className="w-full py-4 animate-in fade-in duration-150">
      <LoadingState variant="table" />
    </div>
  );
}
