import { NextRequest, NextResponse } from "next/server";
import {
  jupiterFetch,
  convertPnlPoint,
  type JupiterPnlPoint,
} from "@/lib/jupiter";

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get("wallet");
  const interval = request.nextUrl.searchParams.get("interval") || "1w";

  if (!wallet) {
    return NextResponse.json(
      { error: "Missing wallet parameter" },
      { status: 400 }
    );
  }

  const validIntervals = ["24h", "1w", "1m"];
  if (!validIntervals.includes(interval)) {
    return NextResponse.json(
      { error: "Invalid interval. Use: 24h, 1w, 1m" },
      { status: 400 }
    );
  }

  try {
    const res = await jupiterFetch<{
      ownerPubkey: string;
      history: JupiterPnlPoint[];
    }>(`/profiles/${wallet}/pnl-history?interval=${interval}&count=100`);

    const history = (res.history || []).map(convertPnlPoint);

    return NextResponse.json(
      { history },
      {
        headers: {
          "Cache-Control": "private, max-age=30, stale-while-revalidate=15",
        },
      }
    );
  } catch (err) {
    // Profile-based endpoints return 404 for new wallets — return empty data
    const errMsg = err instanceof Error ? err.message : "";
    if (errMsg.includes("404")) {
      return NextResponse.json({ history: [] });
    }

    console.error("PnL chart API error:", err);
    return NextResponse.json(
      {
        error: errMsg || "Failed to fetch PnL history",
      },
      { status: 500 }
    );
  }
}
