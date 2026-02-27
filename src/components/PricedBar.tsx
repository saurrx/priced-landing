"use client";

import { useState } from "react";

interface PricedBarProps {
  market: string;
  yesPrice: number;
  noPrice: number;
  source?: string;
  expanded?: boolean;
}

export default function PricedBar({
  market,
  yesPrice,
  noPrice,
  source = "Kalshi",
  expanded = false,
}: PricedBarProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className={`overflow-hidden transition-all duration-500 ease-out ${
        expanded ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="flex items-center justify-between rounded-b-2xl border-x border-b border-[#2f3336] bg-[#1a1d21] px-4 py-3">
        {/* Left: label + market */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="flex-shrink-0 text-xs font-black tracking-wider text-accent-amber">
            PRICED
          </span>
          <span className="truncate text-sm text-[#e7e9ea]">{market}</span>
          <span className="flex-shrink-0 text-xs text-[#71767b]">
            via {source}
          </span>
        </div>

        {/* Right: YES / NO buttons */}
        <div className="relative ml-3 flex gap-2">
          <button
            onClick={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="rounded-lg bg-trading-green/15 px-3 py-1.5 font-mono text-sm font-bold text-trading-green transition-colors hover:bg-trading-green/25"
          >
            YES {yesPrice}¢
          </button>
          <button
            onClick={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="rounded-lg bg-trading-red/15 px-3 py-1.5 font-mono text-sm font-bold text-trading-red transition-colors hover:bg-trading-red/25"
          >
            NO {noPrice}¢
          </button>

          {/* Tooltip */}
          {showTooltip && (
            <div className="absolute -top-10 right-0 whitespace-nowrap rounded-lg bg-bg-elevated px-3 py-1.5 text-xs text-text-secondary shadow-lg">
              Install Priced to trade &rarr;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
