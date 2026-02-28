"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg-deepest px-6">
      <h1 className="text-2xl font-black text-text-primary">
        Something went wrong
      </h1>
      <p className="text-sm text-text-secondary">
        An unexpected error occurred.
      </p>
      <button
        onClick={reset}
        className="mt-4 flex items-center gap-2 rounded-full bg-accent-amber px-6 py-3 text-sm font-bold text-bg-deepest transition-opacity hover:opacity-90"
      >
        <RefreshCw size={14} />
        Try Again
      </button>
    </div>
  );
}
