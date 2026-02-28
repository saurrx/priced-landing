"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/lib/useIsMobile";

const SmokeRing = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.SmokeRing),
  { ssr: false }
);

const CTA_URL = "#waitlist";

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

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
    <section ref={sectionRef} className="relative overflow-hidden px-6 py-32">
      {/* SmokeRing shader background or mobile fallback */}
      {!isMobile ? (
        <div className="pointer-events-none absolute inset-0 z-0">
          <SmokeRing
            colorBack="#06080c"
            colors={["#14f195"]}
            speed={isVisible ? 0.2 : 0}
            noiseScale={3}
            radius={0.25}
            thickness={0.65}
            style={{ width: "100%", height: "100%", opacity: 0.2 }}
          />
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-trading-green/[0.05] via-transparent to-transparent" />
      )}

      {/* Amber divider line */}
      <div className="relative z-10 mx-auto mb-16 h-px w-16 bg-accent-amber" />

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="text-3xl font-black tracking-tight text-text-primary sm:text-5xl">
          Your feed is full of alpha.
        </h2>
        <p className="mt-4 text-2xl font-black tracking-tight sm:text-4xl">
          <span className="gradient-text-green">
            You&apos;re just not seeing it yet.
          </span>
        </p>
        <a
          href={CTA_URL}
          onClick={() => console.log("cta_click", { location: "final_cta" })}
          className="mt-10 rounded-full bg-accent-amber px-8 py-4 text-base font-bold text-bg-deepest transition-opacity hover:opacity-90"
        >
          Add to Chrome — It&apos;s Free
        </a>
      </div>
    </section>
  );
}
