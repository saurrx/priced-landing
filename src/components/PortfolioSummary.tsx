import type { Position, Profile } from "@/lib/jupiter";
import { formatUsd, formatPercent } from "@/lib/format";

interface PortfolioSummaryProps {
  positions: Position[];
  profile: Profile;
}

export default function PortfolioSummary({
  positions,
  profile,
}: PortfolioSummaryProps) {
  const totalValue = positions.reduce((sum, p) => sum + p.value, 0);
  const totalCost = positions.reduce((sum, p) => sum + p.totalCost, 0);
  const unrealizedPnl = positions.reduce((sum, p) => sum + p.pnl, 0);
  const claimableTotal = positions
    .filter((p) => p.claimable && !p.claimed)
    .reduce((sum, p) => sum + p.payout, 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Portfolio Value */}
      <div className="rounded-2xl border border-border-subtle p-6 transition-colors hover:border-border-hover">
        <p className="text-sm text-text-secondary">Portfolio Value</p>
        <p className="mt-2 text-3xl font-black text-white">
          {formatUsd(totalValue)}
        </p>
        <div className="mt-3 flex gap-4 text-xs text-text-tertiary">
          <span>Cost: {formatUsd(totalCost)}</span>
          <span>{positions.length} positions</span>
        </div>
      </div>

      {/* Unrealized PnL */}
      <div className="rounded-2xl border border-border-subtle p-6 transition-colors hover:border-border-hover">
        <p className="text-sm text-text-secondary">Unrealized PnL</p>
        <p
          className={`mt-2 text-3xl font-black ${
            Math.abs(unrealizedPnl) < 0.005
              ? "text-white"
              : unrealizedPnl >= 0
                ? "text-trading-green"
                : "text-trading-red"
          }`}
        >
          {formatUsd(unrealizedPnl)}
        </p>
        <div className="mt-3 flex gap-4 text-xs text-text-tertiary">
          <span>Realized: {formatUsd(profile.realizedPnl)}</span>
          <span>Win rate: {formatPercent(profile.winRate)}</span>
        </div>
      </div>

      {/* Claimable Winnings */}
      <div
        className={`rounded-2xl border p-6 transition-colors ${
          claimableTotal > 0
            ? "border-accent-amber/30 shadow-[0_0_20px_rgba(245,166,35,0.08)]"
            : "border-border-subtle hover:border-border-hover"
        }`}
      >
        <p className="text-sm text-text-secondary">Claimable Winnings</p>
        <p
          className={`mt-2 text-3xl font-black ${
            claimableTotal > 0 ? "text-accent-amber" : "text-white"
          }`}
        >
          {formatUsd(claimableTotal)}
        </p>
        <div className="mt-3 text-xs text-text-tertiary">
          {positions.filter((p) => p.claimable && !p.claimed).length} positions
          ready to claim
        </div>
      </div>
    </div>
  );
}
