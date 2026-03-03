"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const STORE_URL =
  "https://chromewebstore.google.com/detail/priced-by-seerum/gdlbhdololkgfmgbicopfkhcmilpcfkp";
const DISMISS_KEY = "priced-banner-dismissed";

export default function Banner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "true");
  }, []);

  if (dismissed) return null;

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  };

  return (
    <a
      href={STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-0 right-0 left-0 z-50 flex items-center justify-center gap-2 bg-trading-green px-4 py-2.5 text-center text-sm font-semibold text-bg-deepest transition-opacity hover:opacity-95"
    >
      <span>
        <span className="hidden sm:inline">Our extension is now live on Chrome Web Store — </span>
        <span className="sm:hidden">Now live on Chrome Web Store — </span>
        <span className="underline underline-offset-2">Install Now</span>
      </span>
      <button
        onClick={handleDismiss}
        className="absolute right-3 flex items-center justify-center rounded-full p-0.5 transition-colors hover:bg-black/10 sm:right-4"
        aria-label="Dismiss banner"
      >
        <X size={16} />
      </button>
    </a>
  );
}
