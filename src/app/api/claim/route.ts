import { NextRequest, NextResponse } from "next/server";
import { jupiterFetch } from "@/lib/jupiter";

interface ClaimResponse {
  transaction: string;
  txMeta?: {
    blockhash: string;
    lastValidBlockHeight: number;
  };
  position?: {
    positionPubkey: string;
    marketPubkey: string;
    ownerPubkey: string;
    isYes: boolean;
    contracts: number;
    payoutAmountUsd: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { positionPubkey, walletPubkey } = await request.json();

    if (!positionPubkey || !walletPubkey) {
      return NextResponse.json(
        { error: "Missing positionPubkey or walletPubkey" },
        { status: 400 }
      );
    }

    const res = await jupiterFetch<ClaimResponse>(
      `/positions/${positionPubkey}/claim`,
      {
        method: "POST",
        body: JSON.stringify({ ownerPubkey: walletPubkey }),
      }
    );

    return NextResponse.json({ transaction: res.transaction });
  } catch (err) {
    console.error("Claim API error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to claim position",
      },
      { status: 500 }
    );
  }
}
