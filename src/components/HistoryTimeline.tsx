"use client";

import useSWR from "swr";
import { Check, X, ArrowUpRight, ArrowDownLeft, Gift } from "lucide-react";
import type { HistoryEvent } from "@/lib/jupiter";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function formatUsd(value: number): string {
  if (Math.abs(value) < 0.005) return "$0.00";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  return `${sign}$${abs.toFixed(2)}`;
}

function getEventIcon(type: string) {
  switch (type) {
    case "order_filled":
      return <ArrowUpRight size={14} />;
    case "order_created":
      return <ArrowDownLeft size={14} />;
    case "payout_claimed":
      return <Gift size={14} />;
    case "position_lost":
      return <X size={14} />;
    default:
      return <Check size={14} />;
  }
}

function getEventLabel(event: HistoryEvent): string {
  switch (event.eventType) {
    case "order_filled":
      return `${event.isBuy ? "Bought" : "Sold"} ${event.filledContracts} ${event.isYes ? "YES" : "NO"} contracts`;
    case "order_created":
      return `${event.isBuy ? "Buy" : "Sell"} order placed`;
    case "order_closed":
      return "Order cancelled";
    case "order_failed":
      return "Order failed";
    case "payout_claimed":
      return `Claimed ${formatUsd(event.payoutAmount)}`;
    case "position_updated":
      return "Position updated";
    case "position_lost":
      return "Position lost";
    default:
      return event.eventType;
  }
}

function getEventColor(type: string): string {
  switch (type) {
    case "payout_claimed":
      return "text-trading-green bg-trading-green/10";
    case "position_lost":
    case "order_failed":
      return "text-trading-red bg-trading-red/10";
    default:
      return "text-text-secondary bg-bg-elevated";
  }
}

function formatTime(timestamp: string): string {
  const d = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);

  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD < 7) return `${diffD}d ago`;
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

interface HistoryTimelineProps {
  wallet: string;
}

export default function HistoryTimeline({ wallet }: HistoryTimelineProps) {
  const { data, isLoading } = useSWR<{ history: HistoryEvent[] }>(
    `/api/history?wallet=${wallet}`,
    fetcher
  );

  const history = data?.history ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-xl bg-bg-elevated/50"
          />
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-border-subtle p-12 text-center">
        <p className="text-sm text-text-tertiary">
          No trading history yet. Trade on X with the Priced extension to get
          started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {history.map((event) => (
        <div
          key={event.id}
          className="flex items-center gap-4 rounded-xl border border-border-subtle px-4 py-3 transition-colors hover:border-border-hover"
        >
          {/* Icon */}
          <div
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${getEventColor(event.eventType)}`}
          >
            {getEventIcon(event.eventType)}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-text-primary">
              {event.marketTitle}
            </p>
            <p className="text-xs text-text-tertiary">
              {getEventLabel(event)}
            </p>
          </div>

          {/* Amount + time */}
          <div className="flex-shrink-0 text-right">
            {event.totalCost > 0 && (
              <p
                className={`font-mono text-sm ${
                  event.realizedPnl > 0
                    ? "text-trading-green"
                    : event.realizedPnl < 0
                      ? "text-trading-red"
                      : "text-text-primary"
                }`}
              >
                {event.isBuy ? "-" : "+"}
                {formatUsd(event.totalCost)}
              </p>
            )}
            <p className="text-xs text-text-tertiary">
              {formatTime(event.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
