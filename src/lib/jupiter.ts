// Jupiter Prediction Market API types and fetch helpers

const JUPITER_BASE = "https://prediction-market-api.jup.ag/api/v1";

// Jupiter returns USD values where 1,000,000 = $1.00 (USDC 6 decimals).
// Values arrive as strings OR numbers depending on the endpoint, so always coerce.
export const convertPrice = (jupiterPrice: string | number): number =>
  Number(jupiterPrice) / 1_000_000;

// --- Types ---

// NOTE: Jupiter API returns most numeric values as strings (e.g. "479700000")
// and timestamps as Unix seconds (numbers). Types below use string | number
// to reflect reality; conversion helpers always call Number() for safety.

export interface JupiterPosition {
  pubkey: string;
  ownerPubkey: string;
  marketId: string;
  isYes: boolean;
  contracts: string | number;
  totalCostUsd: string | number;
  avgPriceUsd: string | number;
  valueUsd: string | number;
  markPriceUsd: string | number;
  sellPriceUsd: string | number;
  pnlUsd: string | number;
  pnlUsdPercent: string | number;
  pnlUsdAfterFees: string | number;
  pnlUsdAfterFeesPercent: string | number;
  feesPaidUsd: string | number;
  realizedPnlUsd: string | number;
  claimable: boolean;
  claimed: boolean;
  claimedUsd: string | number;
  payoutUsd: string | number;
  openedAt: number; // Unix seconds
  updatedAt: number; // Unix seconds
  claimableAt: string | null;
  settlementDate: string | null;
  eventId: string;
  eventMetadata: { title: string; imageUrl?: string } | null;
  marketMetadata: { title: string; status: string; result: string } | null;
}

export interface JupiterProfile {
  ownerPubkey: string;
  realizedPnlUsd: string | number;
  totalVolumeUsd: string | number;
  predictionsCount: string | number;
  correctPredictions: string | number;
  wrongPredictions: string | number;
  totalActiveContracts: string | number;
  totalPositionsValueUsd: string | number;
}

export interface JupiterHistoryEvent {
  id: string;
  eventType:
    | "order_created"
    | "order_closed"
    | "order_filled"
    | "order_failed"
    | "payout_claimed"
    | "position_updated"
    | "position_lost";
  signature: string;
  timestamp: number; // Unix seconds
  marketId: string;
  ownerPubkey: string;
  isYes: boolean;
  isBuy: boolean;
  contracts: string | number;
  filledContracts: string | number;
  avgFillPriceUsd: string | number;
  totalCostUsd: string | number;
  feeUsd: string | number;
  realizedPnl: string | number;
  payoutAmountUsd: string | number;
  marketMetadata: { title: string; status: string; result: string } | null;
  eventMetadata: { title: string; imageUrl?: string } | null;
}

export interface JupiterPnlPoint {
  timestamp: number; // Unix seconds
  realizedPnlUsd: string | number;
}

// --- Converted frontend types ---

export interface Position {
  pubkey: string;
  marketId: string;
  marketTitle: string;
  marketStatus: string;
  marketResult: string;
  isYes: boolean;
  contracts: number;
  totalCost: number;
  avgPrice: number;
  value: number;
  markPrice: number;
  pnl: number;
  pnlPercent: number;
  pnlAfterFees: number;
  realizedPnl: number;
  feesPaid: number;
  claimable: boolean;
  claimed: boolean;
  payout: number;
  openedAt: string;
}

export interface Profile {
  realizedPnl: number;
  totalVolume: number;
  predictionsCount: number;
  correctPredictions: number;
  wrongPredictions: number;
  winRate: number;
  totalActiveContracts: number;
  totalPositionsValue: number;
}

export interface HistoryEvent {
  id: string;
  eventType: string;
  signature: string;
  timestamp: string;
  marketTitle: string;
  isYes: boolean;
  isBuy: boolean;
  contracts: number;
  filledContracts: number;
  avgFillPrice: number;
  totalCost: number;
  fee: number;
  realizedPnl: number;
  payoutAmount: number;
}

export interface PnlPoint {
  timestamp: string;
  realizedPnl: number;
}

// --- Conversion helpers ---

export function convertPosition(raw: JupiterPosition): Position {
  return {
    pubkey: raw.pubkey,
    marketId: raw.marketId,
    marketTitle:
      raw.eventMetadata?.title ??
      raw.marketMetadata?.title ??
      "Unknown Market",
    marketStatus: raw.marketMetadata?.status ?? "unknown",
    marketResult: raw.marketMetadata?.result ?? "",
    isYes: raw.isYes,
    contracts: Number(raw.contracts),
    totalCost: convertPrice(raw.totalCostUsd),
    avgPrice: convertPrice(raw.avgPriceUsd),
    value: convertPrice(raw.valueUsd),
    markPrice: convertPrice(raw.markPriceUsd),
    pnl: convertPrice(raw.pnlUsd),
    pnlPercent: Number(raw.pnlUsdPercent),
    pnlAfterFees: convertPrice(raw.pnlUsdAfterFees),
    realizedPnl: convertPrice(raw.realizedPnlUsd),
    feesPaid: convertPrice(raw.feesPaidUsd),
    claimable: raw.claimable,
    claimed: raw.claimed,
    payout: convertPrice(raw.payoutUsd),
    openedAt: new Date(Number(raw.openedAt) * 1000).toISOString(),
  };
}

export function convertProfile(raw: JupiterProfile): Profile {
  const correct = Number(raw.correctPredictions);
  const wrong = Number(raw.wrongPredictions);
  const total = correct + wrong;
  return {
    realizedPnl: convertPrice(raw.realizedPnlUsd),
    totalVolume: convertPrice(raw.totalVolumeUsd),
    predictionsCount: Number(raw.predictionsCount),
    correctPredictions: correct,
    wrongPredictions: wrong,
    winRate: total > 0 ? correct / total : 0,
    totalActiveContracts: Number(raw.totalActiveContracts),
    totalPositionsValue: convertPrice(raw.totalPositionsValueUsd),
  };
}

export function convertHistoryEvent(raw: JupiterHistoryEvent): HistoryEvent {
  return {
    id: raw.id,
    eventType: raw.eventType,
    signature: raw.signature,
    timestamp: new Date(Number(raw.timestamp) * 1000).toISOString(),
    marketTitle:
      raw.eventMetadata?.title ??
      raw.marketMetadata?.title ??
      "Unknown Market",
    isYes: raw.isYes,
    isBuy: raw.isBuy,
    contracts: Number(raw.contracts),
    filledContracts: Number(raw.filledContracts),
    avgFillPrice: convertPrice(raw.avgFillPriceUsd),
    totalCost: convertPrice(raw.totalCostUsd),
    fee: convertPrice(raw.feeUsd),
    realizedPnl: convertPrice(raw.realizedPnl),
    payoutAmount: convertPrice(raw.payoutAmountUsd),
  };
}

export function convertPnlPoint(raw: JupiterPnlPoint): PnlPoint {
  return {
    timestamp: new Date(raw.timestamp * 1000).toISOString(),
    realizedPnl: convertPrice(Number(raw.realizedPnlUsd)),
  };
}

// --- Fetch helper ---

export async function jupiterFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const apiKey = process.env.JUPITER_API_KEY;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(apiKey ? { "x-api-key": apiKey } : {}),
  };

  const res = await fetch(`${JUPITER_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string>) },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Jupiter API ${res.status}: ${text}`);
  }

  return res.json();
}
