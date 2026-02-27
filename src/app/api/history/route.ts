import { NextRequest, NextResponse } from "next/server";
import {
  jupiterFetch,
  convertHistoryEvent,
  type JupiterHistoryEvent,
} from "@/lib/jupiter";

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get("wallet");

  if (!wallet) {
    return NextResponse.json(
      { error: "Missing wallet parameter" },
      { status: 400 }
    );
  }

  try {
    const res = await jupiterFetch<{ data: JupiterHistoryEvent[] }>(
      `/history?ownerPubkey=${wallet}`
    );

    const history = (res.data || []).map(convertHistoryEvent);

    return NextResponse.json({ history });
  } catch (err) {
    // Return empty history for wallets that haven't traded
    const errMsg = err instanceof Error ? err.message : "";
    if (errMsg.includes("404")) {
      return NextResponse.json({ history: [] });
    }

    console.error("History API error:", err);
    return NextResponse.json(
      {
        error: errMsg || "Failed to fetch history",
      },
      { status: 500 }
    );
  }
}
