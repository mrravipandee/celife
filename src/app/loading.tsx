import React from "react";
import { Loader } from "@/components/ui/Loader";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader />
    </div>
  );
}
