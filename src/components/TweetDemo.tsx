"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import TweetCard from "./TweetCard";
import PricedBar from "./PricedBar";

const GodRays = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.GodRays),
  { ssr: false }
);

export default function TweetDemo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          const timer = setTimeout(() => setExpanded(true), 1500);
          return () => clearTimeout(timer);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-6 py-24">
      {/* GodRays shader background */}
      {!isMobile && (
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
      )}

      <div className="relative z-10 mx-auto max-w-2xl">
        <h2 className="gradient-text mb-12 text-center text-3xl font-black tracking-tight sm:text-4xl">
          See it in action.
        </h2>

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
            source="Kalshi"
            expanded={expanded}
          />
        </div>

        <p className="mt-8 text-center text-sm text-text-secondary">
          92% match accuracy. Under 500ms.
        </p>
      </div>
    </section>
  );
}
