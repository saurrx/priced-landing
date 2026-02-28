"use client";

import type { Position } from "@/lib/jupiter";
import { formatUsd } from "@/lib/format";

interface PositionCardProps {
  position: Position;
  onClose?: (position: Position) => void;
  onClaim?: (position: Position) => void;
}

export default function PositionCard({
  position,
  onClose,
  onClaim,
}: PositionCardProps) {
  const isClaimable = position.claimable && !position.claimed;
  const isActive = position.marketStatus === "open";

  return (
    <div
      className={`rounded-2xl border p-5 transition-all ${
        isClaimable
          ? "border-accent-amber/30 shadow-[0_0_24px_rgba(245,166,35,0.06)]"
          : "border-border-subtle hover:border-border-hover"
      }`}
    >
      {/* Market title + side badge */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-medium leading-snug text-text-primary">
          {position.marketTitle}
        </h3>
        <span
          className={`flex-shrink-0 rounded-md px-2 py-0.5 font-mono text-xs font-bold ${
            position.isYes
              ? "bg-trading-green/15 text-trading-green"
              : "bg-trading-red/15 text-trading-red"
          }`}
        >
          {position.isYes ? "YES" : "NO"}
        </span>
      </div>

      {/* Price details */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
        <div>
          <p className="text-text-tertiary">Entry</p>
          <p className="mt-0.5 font-mono text-text-primary">
            {formatUsd(position.avgPrice)}
          </p>
        </div>
        <div>
          <p className="text-text-tertiary">Current</p>
          <p className="mt-0.5 font-mono text-text-primary">
            {formatUsd(position.markPrice)}
          </p>
        </div>
        <div>
          <p className="text-text-tertiary">Contracts</p>
          <p className="mt-0.5 font-mono text-text-primary">
            {position.contracts}
          </p>
        </div>
        <div>
          <p className="text-text-tertiary">Value</p>
          <p className="mt-0.5 font-mono text-text-primary">
            {formatUsd(position.value)}
          </p>
        </div>
      </div>

      {/* PnL + actions */}
      <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-4">
        <div>
          <p className="text-xs text-text-tertiary">PnL</p>
          <p
            className={`font-mono text-sm font-bold ${
              Math.abs(position.pnl) < 0.005
                ? "text-text-secondary"
                : position.pnl >= 0
                  ? "text-trading-green"
                  : "text-trading-red"
            }`}
          >
            {formatUsd(position.pnl)}{" "}
            <span className="text-xs font-normal">
              ({position.pnlPercent >= 0 ? "+" : ""}
              {position.pnlPercent.toFixed(1)}%)
            </span>
          </p>
        </div>

        <div className="flex gap-2">
          {isClaimable && onClaim && (
            <button
              onClick={() => onClaim(position)}
              className="rounded-full bg-accent-amber px-4 py-2 text-xs font-bold text-bg-deepest transition-opacity hover:opacity-90"
            >
              Claim {formatUsd(position.payout)}
            </button>
          )}
          {isActive && onClose && (
            <button
              onClick={() => onClose(position)}
              className="rounded-full border border-border-subtle px-4 py-2 text-xs font-medium text-text-secondary transition-all hover:border-trading-red/50 hover:text-trading-red"
            >
              Close Position
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
