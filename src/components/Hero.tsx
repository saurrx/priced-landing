"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/lib/useIsMobile";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Volume2, VolumeX } from "lucide-react";

const MeshGradient = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.MeshGradient),
  { ssr: false }
);

const CTA_URL = "https://chromewebstore.google.com/detail/priced-by-seerum/gdlbhdololkgfmgbicopfkhcmilpcfkp";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
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
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
    >
      {/* Shader background or mobile fallback gradient */}
      {!isMobile ? (
        <div className="pointer-events-none absolute inset-0 z-0">
          <MeshGradient
            colors={["#14f195", "#0a2540", "#f2f810", "#06080c"]}
            speed={isVisible ? 0.08 : 0}
            style={{ width: "100%", height: "100%", opacity: 0.3 }}
          />
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-trading-green/[0.06] via-transparent to-accent-amber/[0.04]" />
      )}

      <ContainerScroll
        titleComponent={
          <h1 className="gradient-text text-5xl leading-[1.1] font-black tracking-tight sm:text-7xl">
            See the market behind
            <br />
            every opinion.
          </h1>
        }
        footerComponent={
          <div className="pt-8 pb-16 text-center">
            <a
              href={CTA_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => console.log("cta_click", { location: "hero" })}
              className="inline-block rounded-full bg-accent-amber px-8 py-4 text-base font-bold text-bg-deepest transition-opacity hover:opacity-90"
            >
              Add to Chrome — It&apos;s Free
            </a>
          </div>
        }
      >
        {/* Product demo video */}
        <div className="relative h-full w-full overflow-hidden rounded-2xl">
          {/* Shimmer skeleton — visible until video is ready */}
          <div
            className={`absolute inset-0 z-10 transition-opacity duration-700 ${
              videoReady ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-text-tertiary">Loading demo…</p>
            </div>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
          </div>

          {/* Mute/unmute toggle */}
          {videoReady && (
            <button
              onClick={() => setIsMuted((m) => !m)}
              className="absolute top-3 right-3 z-20 rounded-full bg-black/60 p-2 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-white"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          )}

          {/* Video — lazy-mounted on first intersection, stays mounted after */}
          {(isVisible || videoReady) && (
            <video
              ref={videoRef}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                videoReady ? "opacity-100" : "opacity-0"
              }`}
              src="https://videowithsubtitles.s3.us-east-2.amazonaws.com/rjzrjoybpndmceo.mp4"
              autoPlay
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
              onCanPlay={() => setVideoReady(true)}
            />
          )}
        </div>
      </ContainerScroll>

    </section>
  );
}
