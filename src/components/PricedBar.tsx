"use client";

import { useState, useEffect } from "react";

interface PricedBarProps {
  market: string;
  yesPrice: number;
  noPrice: number;
  volume?: string;
  closesDate?: string;
  visible?: boolean;
  autoExpand?: boolean;
}

export default function PricedBar({
  market,
  yesPrice,
  noPrice,
  volume = "$28.7M",
  closesDate = "Dec 2026",
  visible = false,
  autoExpand = false,
}: PricedBarProps) {
  const [expanded, setExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (autoExpand) {
      setExpanded(true);
    }
  }, [autoExpand]);

  return (
    <div
      className={`overflow-hidden transition-all duration-500 ease-out ${
        visible ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="rounded-b-2xl border-x border-b border-[#2f3336] bg-[#1a1d21] overflow-hidden">
        {/* Collapsed header row — always visible */}
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="flex w-full items-center justify-between px-4 py-2.5 transition-colors hover:bg-white/[0.03] cursor-pointer"
        >
          {/* Left: green dot + market name */}
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-trading-green opacity-40" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-trading-green" />
            </span>
            <span className="truncate text-sm text-[#e7e9ea]">{market}</span>
          </div>

          {/* Right: YES / NO percentages + chevron */}
          <div className="ml-3 flex items-center gap-3 flex-shrink-0">
            <span className="font-mono text-sm font-bold text-trading-green">
              YES {yesPrice}%
            </span>
            <span className="font-mono text-sm font-bold text-trading-red">
              NO {noPrice}%
            </span>
            <svg
              className={`h-3.5 w-3.5 text-[#71767b] transition-transform duration-300 ${
                expanded ? "rotate-180" : ""
              }`}
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 4.5L6 7.5L9 4.5" />
            </svg>
          </div>
        </button>

        {/* Expanded panel */}
        <div
          className={`overflow-hidden transition-all duration-400 ease-out ${
            expanded ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-[#2f3336] px-4 pt-3 pb-3">
            {/* Market title */}
            <p className="text-[15px] font-bold text-[#e7e9ea] mb-3">
              {market}
            </p>

            {/* Buy buttons */}
            <div className="relative flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(true);
                  setTimeout(() => setShowTooltip(false), 2000);
                }}
                className="flex-1 rounded-lg border border-trading-green/30 bg-trading-green/[0.06] py-2.5 font-mono text-sm font-bold text-trading-green transition-all hover:bg-trading-green/15 hover:border-trading-green/50 cursor-pointer"
              >
                Buy YES <span className="text-trading-green/70">{yesPrice}¢</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(true);
                  setTimeout(() => setShowTooltip(false), 2000);
                }}
                className="flex-1 rounded-lg border border-trading-red/30 bg-trading-red/[0.06] py-2.5 font-mono text-sm font-bold text-trading-red transition-all hover:bg-trading-red/15 hover:border-trading-red/50 cursor-pointer"
              >
                Buy NO <span className="text-trading-red/70">{noPrice}¢</span>
              </button>

              {/* Tooltip */}
              {showTooltip && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-bg-elevated px-3 py-1.5 text-xs text-text-secondary shadow-lg border border-border-subtle">
                  Install Priced to trade &rarr;
                </div>
              )}
            </div>

            {/* Bottom info row */}
            <div className="mt-3 flex items-center justify-between text-xs text-[#71767b]">
              <span>
                Vol: {volume} &middot; Closes {closesDate}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent-amber text-[8px] font-black text-bg-deepest">
                  P
                </span>
                Powered by{" "}
                <span className="text-accent-amber font-medium">@praborhood</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
