import { NextRequest, NextResponse } from "next/server";
import {
  jupiterFetch,
  convertPosition,
  convertProfile,
  type JupiterPosition,
  type JupiterProfile,
  type Profile,
} from "@/lib/jupiter";

const DEFAULT_PROFILE: Profile = {
  realizedPnl: 0,
  totalVolume: 0,
  predictionsCount: 0,
  correctPredictions: 0,
  wrongPredictions: 0,
  winRate: 0,
  totalActiveContracts: 0,
  totalPositionsValue: 0,
};

export async function GET(request: NextRequest) {
  const wallet = request.nextUrl.searchParams.get("wallet");

  if (!wallet) {
    return NextResponse.json(
      { error: "Missing wallet parameter" },
      { status: 400 }
    );
  }

  try {
    // Fetch positions and profile in parallel, but handle profile 404 gracefully
    const [positionsRes, profileResult] = await Promise.all([
      jupiterFetch<{ data: JupiterPosition[] }>(
        `/positions?ownerPubkey=${wallet}`
      ),
      jupiterFetch<JupiterProfile>(`/profiles/${wallet}`).catch(
        () => null
      ),
    ]);

    const positions = (positionsRes.data || []).map(convertPosition);
    const profile = profileResult
      ? convertProfile(profileResult)
      : DEFAULT_PROFILE;

    return NextResponse.json(
      { positions, profile },
      {
        headers: {
          "Cache-Control": "private, max-age=10, stale-while-revalidate=5",
        },
      }
    );
  } catch (err) {
    console.error("Portfolio API error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to fetch portfolio",
      },
      { status: 500 }
    );
  }
}
