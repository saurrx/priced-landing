"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { PnlPoint } from "@/lib/jupiter";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const intervals = [
  { label: "24h", value: "24h" },
  { label: "1W", value: "1w" },
  { label: "1M", value: "1m" },
];

interface PnlChartProps {
  wallet: string;
}

export default function PnlChart({ wallet }: PnlChartProps) {
  const [interval, setInterval] = useState("1w");

  const { data, isLoading } = useSWR<{ history: PnlPoint[] }>(
    `/api/pnl-chart?wallet=${wallet}&interval=${interval}`,
    fetcher
  );

  const chartData = data?.history ?? [];
  const isPositive =
    chartData.length > 0
      ? chartData[chartData.length - 1].realizedPnl >= 0
      : true;
  const strokeColor = isPositive ? "#14f195" : "#ff5555";
  const fillColor = isPositive ? "#14f195" : "#ff5555";

  return (
    <div className="rounded-2xl border border-border-subtle p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-text-secondary">
          PnL History
        </h3>
        <div className="flex gap-1 rounded-lg bg-bg-elevated p-1">
          {intervals.map((i) => (
            <button
              key={i.value}
              onClick={() => setInterval(i.value)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                interval === i.value
                  ? "bg-bg-surface text-text-primary"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="mt-4 h-48">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-text-tertiary border-t-accent-amber" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-text-tertiary">
            No PnL data yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={fillColor} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={fillColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="timestamp"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#4a5568" }}
                tickFormatter={(value: string) => {
                  const d = new Date(value);
                  return interval === "24h"
                    ? d.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : d.toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      });
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#4a5568" }}
                tickFormatter={(value: number) => `$${value.toFixed(0)}`}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#f0f2f5",
                }}
                formatter={(value: number | undefined) => [
                  value !== undefined ? `$${value.toFixed(2)}` : "$0.00",
                  "PnL",
                ]}
                labelFormatter={(label) =>
                  new Date(String(label)).toLocaleString()
                }
              />
              <Area
                type="monotone"
                dataKey="realizedPnl"
                stroke={strokeColor}
                strokeWidth={2}
                fill="url(#pnlGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
