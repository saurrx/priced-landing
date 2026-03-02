"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/lib/useIsMobile";
import TweetCard from "./TweetCard";
import PricedBar from "./PricedBar";

const GodRays = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.GodRays),
  { ssr: false }
);

export default function TweetDemo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [barVisible, setBarVisible] = useState(false);
  const [autoExpand, setAutoExpand] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let barTimer: ReturnType<typeof setTimeout>;
    let expandTimer: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          // Step 1: PricedBar slides in (collapsed) after 1.2s
          barTimer = setTimeout(() => setBarVisible(true), 1200);
          // Step 2: Auto-expand the panel after another 1.5s
          expandTimer = setTimeout(() => setAutoExpand(true), 2700);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(barTimer);
      clearTimeout(expandTimer);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-6 py-24">
      {/* GodRays shader background or mobile fallback */}
      {!isMobile ? (
        <div className="pointer-events-none absolute inset-0 z-0">
          <GodRays
            colorBack="#06080c"
            colorBloom="#14f195"
            colors={["#14f19520", "#0a254080", "#ffffff10", "#14f19540"]}
            density={0.2}
            spotty={0.2}
            intensity={0.4}
            bloom={0.2}
            speed={isVisible ? 0.15 : 0}
            style={{ width: "100%", height: "100%", opacity: 0.15 }}
          />
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-trading-green/[0.04] via-transparent to-transparent" />
      )}

      <div className="relative z-10 mx-auto max-w-2xl">
        <h2 className="gradient-text mb-4 text-center text-3xl font-black tracking-tight sm:text-4xl">
          See it in action.
        </h2>

        <p className="mx-auto mb-12 max-w-lg text-center text-base leading-relaxed text-text-secondary">
          Priced surfaces prediction market odds on the tweets you&apos;re already
          reading. Bet YES or NO without leaving your feed. One click, on-chain,
          through Solana Blinks.
        </p>

        <div className="mx-auto max-w-xl">
          <TweetCard
            author="Elon Musk"
            handle="elonmusk"
            avatar="E"
            text="I think there's a >50% chance we land on Mars by 2030."
            timestamp="4h"
          />
          <PricedBar
            market="Humans on Mars by 2030?"
            yesPrice={12}
            noPrice={88}
            volume="$28.7M"
            closesDate="Dec 2026"
            visible={barVisible}
            autoExpand={autoExpand}
          />
        </div>

        <p className="mt-8 text-center text-sm text-text-tertiary">
          Click the arrow to expand — just like on Twitter.
        </p>
      </div>
    </section>
  );
}
