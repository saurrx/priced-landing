import { NextRequest, NextResponse } from "next/server";
import { jupiterFetch } from "@/lib/jupiter";

interface ClosePositionResponse {
  transaction: string;
  txMeta?: {
    blockhash: string;
    lastValidBlockHeight: number;
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

    const res = await jupiterFetch<ClosePositionResponse>(
      `/positions/${positionPubkey}`,
      {
        method: "DELETE",
        body: JSON.stringify({ ownerPubkey: walletPubkey }),
      }
    );

    return NextResponse.json({ transaction: res.transaction });
  } catch (err) {
    console.error("Close position API error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to close position",
      },
      { status: 500 }
    );
  }
}
