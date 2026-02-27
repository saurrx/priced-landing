"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ShaderBackgroundProps {
  children: ReactNode;
  fallbackClass?: string;
  className?: string;
}

export default function ShaderBackground({
  children,
  fallbackClass = "bg-bg-section",
  className = "",
}: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);

    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shouldRenderShader = !isMobile && hasWebGL;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Shader layer or fallback */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {shouldRenderShader && isVisible ? (
          children
        ) : (
          <div className={`h-full w-full ${fallbackClass}`} />
        )}
      </div>
    </div>
  );
}
