"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("Root error boundary caught exception:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-6 text-white">
      <span className="text-xs uppercase tracking-[0.3em] text-primary">Error</span>
      <h1 className="text-3xl md:text-5xl font-serif max-w-xl leading-tight">
        Something went wrong.
      </h1>
      <p className="text-sm text-white/50 max-w-md leading-relaxed font-sans">
        We encountered an error processing your request. Please try again or contact us if the problem persists.
      </p>
      <div className="pt-4">
        <Button onClick={reset} variant="primary">
          Try Again
        </Button>
      </div>
    </div>
  );
}
