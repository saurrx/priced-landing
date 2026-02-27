// Jupiter Prediction Market API types and fetch helpers

const JUPITER_BASE = "https://prediction-market-api.jup.ag/api/v1";

// Jupiter returns USD values where 1,000,000 = $1.00 (USDC 6 decimals)
export const convertPrice = (jupiterPrice: number): number =>
  jupiterPrice / 1_000_000;

// --- Types ---

export interface JupiterPosition {
  pubkey: string;
  ownerPubkey: string;
  marketId: string;
  isYes: boolean;
  contracts: number;
  totalCostUsd: number;
  avgPriceUsd: number;
  valueUsd: number;
  markPriceUsd: number;
  sellPriceUsd: number;
  pnlUsd: number;
  pnlUsdPercent: number;
  pnlUsdAfterFees: number;
  pnlUsdAfterFeesPercent: number;
  feesPaidUsd: number;
  realizedPnlUsd: number;
  claimable: boolean;
  claimed: boolean;
  claimedUsd: number;
  payoutUsd: number;
  openedAt: string;
  updatedAt: string;
  claimableAt: string | null;
  settlementDate: string | null;
  eventId: string;
  eventMetadata: { title: string; imageUrl?: string } | null;
  marketMetadata: { title: string; status: string; result: string } | null;
}

export interface JupiterProfile {
  ownerPubkey: string;
  realizedPnlUsd: number;
  totalVolumeUsd: number;
  predictionsCount: number;
  correctPredictions: number;
  wrongPredictions: number;
  totalActiveContracts: number;
  totalPositionsValueUsd: number;
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
  timestamp: string;
  marketId: string;
  ownerPubkey: string;
  isYes: boolean;
  isBuy: boolean;
  contracts: number;
  filledContracts: number;
  avgFillPriceUsd: number;
  totalCostUsd: number;
  feeUsd: number;
  realizedPnl: number;
  payoutAmountUsd: number;
  marketMetadata: { title: string; status: string; result: string } | null;
  eventMetadata: { title: string; imageUrl?: string } | null;
}

export interface JupiterPnlPoint {
  timestamp: string;
  realizedPnlUsd: number;
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
    contracts: raw.contracts,
    totalCost: convertPrice(raw.totalCostUsd),
    avgPrice: convertPrice(raw.avgPriceUsd),
    value: convertPrice(raw.valueUsd),
    markPrice: convertPrice(raw.markPriceUsd),
    pnl: convertPrice(raw.pnlUsd),
    pnlPercent: raw.pnlUsdPercent,
    pnlAfterFees: convertPrice(raw.pnlUsdAfterFees),
    realizedPnl: convertPrice(raw.realizedPnlUsd),
    feesPaid: convertPrice(raw.feesPaidUsd),
    claimable: raw.claimable,
    claimed: raw.claimed,
    payout: convertPrice(raw.payoutUsd),
    openedAt: raw.openedAt,
  };
}

export function convertProfile(raw: JupiterProfile): Profile {
  const total = raw.correctPredictions + raw.wrongPredictions;
  return {
    realizedPnl: convertPrice(raw.realizedPnlUsd),
    totalVolume: convertPrice(raw.totalVolumeUsd),
    predictionsCount: raw.predictionsCount,
    correctPredictions: raw.correctPredictions,
    wrongPredictions: raw.wrongPredictions,
    winRate: total > 0 ? raw.correctPredictions / total : 0,
    totalActiveContracts: raw.totalActiveContracts,
    totalPositionsValue: convertPrice(raw.totalPositionsValueUsd),
  };
}

export function convertHistoryEvent(raw: JupiterHistoryEvent): HistoryEvent {
  return {
    id: raw.id,
    eventType: raw.eventType,
    signature: raw.signature,
    timestamp: raw.timestamp,
    marketTitle:
      raw.eventMetadata?.title ??
      raw.marketMetadata?.title ??
      "Unknown Market",
    isYes: raw.isYes,
    isBuy: raw.isBuy,
    contracts: raw.contracts,
    filledContracts: raw.filledContracts,
    avgFillPrice: convertPrice(raw.avgFillPriceUsd),
    totalCost: convertPrice(raw.totalCostUsd),
    fee: convertPrice(raw.feeUsd),
    realizedPnl: convertPrice(raw.realizedPnl),
    payoutAmount: convertPrice(raw.payoutAmountUsd),
  };
}

export function convertPnlPoint(raw: JupiterPnlPoint): PnlPoint {
  return {
    timestamp: raw.timestamp,
    realizedPnl: convertPrice(raw.realizedPnlUsd),
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
