"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const MeshGradient = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.MeshGradient),
  { ssr: false }
);

const CTA_URL = "#waitlist";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-24"
    >
      {/* Shader background */}
      {!isMobile && (
        <div className="pointer-events-none absolute inset-0 z-0">
          <MeshGradient
            colors={["#14f195", "#0a2540", "#f5a623", "#06080c"]}
            speed={isVisible ? 0.08 : 0}
            style={{ width: "100%", height: "100%", opacity: 0.3 }}
          />
        </div>
      )}

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <h1 className="gradient-text text-5xl leading-[1.1] font-black tracking-tight sm:text-7xl">
          Every opinion
          <br />
          has a price.
        </h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-text-secondary">
          See live prediction market odds on any tweet.
          <br className="hidden sm:block" />
          Trade in one click. Powered by Solana.
        </p>
        <a
          href={CTA_URL}
          onClick={() => console.log("cta_click", { location: "hero" })}
          className="mt-10 rounded-full bg-accent-amber px-8 py-4 text-base font-bold text-bg-deepest transition-opacity hover:opacity-90"
        >
          Add to Chrome — It&apos;s Free
        </a>

        {/* Video placeholder */}
        <div className="mt-16 w-full max-w-[800px]">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-text-tertiary">
                Product demo coming soon
              </p>
            </div>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
