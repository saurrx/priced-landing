"use client";

import { useState, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import useSWR from "swr";
import { ArrowLeft, TrendingUp } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PortfolioSummary from "@/components/PortfolioSummary";
import PositionCard from "@/components/PositionCard";
import PnlChart from "@/components/PnlChart";
import HistoryTimeline from "@/components/HistoryTimeline";
import ClosePositionModal from "@/components/ClosePositionModal";
import ConnectWalletModal from "@/components/ConnectWalletModal";
import { useToast } from "@/components/Toast";
import { signAndSendTransaction, getSolscanUrl } from "@/lib/transactions";
import { fetcher } from "@/lib/fetcher";
import { friendlyError } from "@/lib/errors";
import type { Position, Profile } from "@/lib/jupiter";

const POSITIONS_PER_PAGE = 10;

type Tab = "positions" | "history";

export default function PortfolioPage() {
  const { publicKey, connected } = useWallet();
  const wallet = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("positions");
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [closeModal, setCloseModal] = useState<{
    open: boolean;
    position: Position | null;
  }>({ open: false, position: null });
  const [claimingPosition, setClaimingPosition] = useState<string | null>(null);
  const [activeLimit, setActiveLimit] = useState(POSITIONS_PER_PAGE);
  const [settledLimit, setSettledLimit] = useState(POSITIONS_PER_PAGE);

  const walletAddress = publicKey?.toBase58();

  const {
    data: portfolioData,
    isLoading,
    mutate,
  } = useSWR<{ positions: Position[]; profile: Profile }>(
    walletAddress ? `/api/portfolio?wallet=${walletAddress}` : null,
    fetcher,
    { refreshInterval: 30000 }
  );

  const positions = portfolioData?.positions ?? [];
  const profile = portfolioData?.profile;

  const claimablePositions = positions.filter(
    (p) => p.claimable && !p.claimed
  );
  const activePositions = positions.filter(
    (p) => p.marketStatus === "open" && !p.claimable
  );
  const settledPositions = positions.filter(
    (p) => p.marketStatus !== "open" && !(p.claimable && !p.claimed)
  );

  const handleClaim = useCallback(
    async (position: Position) => {
      if (!publicKey) return;

      setClaimingPosition(position.pubkey);

      try {
        const res = await fetch("/api/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            positionPubkey: position.pubkey,
            walletPubkey: publicKey.toBase58(),
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to create claim transaction");
        }

        const { transaction } = await res.json();
        const signature = await signAndSendTransaction(
          transaction,
          wallet,
          connection
        );

        toast("success", "Claimed successfully!", {
          label: "View on Solscan",
          href: getSolscanUrl(signature),
        });
        mutate();
      } catch (err) {
        if (
          err instanceof Error &&
          err.message.includes("User rejected")
        ) {
          // User cancelled, do nothing
        } else {
          toast("error", friendlyError(err));
        }
      } finally {
        setClaimingPosition(null);
      }
    },
    [publicKey, wallet, connection, mutate, toast]
  );

  // Not connected state
  if (!connected) {
    return (
      <>
        <Nav />
        <div className="flex min-h-screen flex-col items-center justify-center px-6">
          <h1 className="gradient-text text-center text-3xl font-black tracking-tight sm:text-5xl">
            Your predictions,
            <br />
            one dashboard.
          </h1>
          <p className="mt-4 max-w-md text-center text-text-secondary">
            Connect your Solana wallet to view positions, track PnL, and claim
            winnings.
          </p>
          <button
            onClick={() => setConnectModalOpen(true)}
            className="mt-8 rounded-full bg-accent-amber px-8 py-4 text-base font-bold text-bg-deepest transition-opacity hover:opacity-90"
          >
            Connect Wallet
          </button>
        </div>
        <ConnectWalletModal
          isOpen={connectModalOpen}
          onClose={() => setConnectModalOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-6 pt-24 pb-16">
        {/* Back navigation */}
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-text-tertiary transition-colors hover:text-text-primary"
          >
            <ArrowLeft size={14} />
            Back to Home
          </a>
        </div>

        {/* Tab navigation */}
        <div className="mb-8 flex gap-1 border-b border-border-subtle">
          {(["positions", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 pb-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "text-text-primary"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-amber" />
              )}
            </button>
          ))}
        </div>

        {/* Positions tab */}
        <div className={activeTab !== "positions" ? "hidden" : ""}>
          {/* Summary cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-2xl bg-bg-elevated/50"
                />
              ))}
            </div>
          ) : profile ? (
            <PortfolioSummary positions={positions} profile={profile} />
          ) : null}

          {/* PnL Chart */}
          {walletAddress && (
            <div className="mt-6">
              <PnlChart wallet={walletAddress} visible={activeTab === "positions"} />
            </div>
          )}

          {/* Claimable positions */}
          {claimablePositions.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-lg font-black text-accent-amber">
                Claimable Winnings
              </h2>
              <div className="flex flex-col gap-3">
                {claimablePositions.map((pos) => (
                  <PositionCard
                    key={pos.pubkey}
                    position={pos}
                    onClaim={handleClaim}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Active positions */}
          {activePositions.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-lg font-black text-text-primary">
                Active Positions
              </h2>
              <div className="flex flex-col gap-3">
                {activePositions.slice(0, activeLimit).map((pos) => (
                  <PositionCard
                    key={pos.pubkey}
                    position={pos}
                    onClose={(p) =>
                      setCloseModal({ open: true, position: p })
                    }
                  />
                ))}
              </div>
              {activePositions.length > activeLimit && (
                <button
                  onClick={() =>
                    setActiveLimit((l) => l + POSITIONS_PER_PAGE)
                  }
                  className="mt-3 w-full rounded-xl border border-border-subtle py-3 text-sm text-text-secondary transition-all hover:border-border-hover hover:text-text-primary"
                >
                  Load More ({activePositions.length - activeLimit} remaining)
                </button>
              )}
            </div>
          )}

          {/* Settled positions */}
          {settledPositions.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-lg font-black text-text-secondary">
                Settled
              </h2>
              <div className="flex flex-col gap-3">
                {settledPositions.slice(0, settledLimit).map((pos) => (
                  <PositionCard key={pos.pubkey} position={pos} />
                ))}
              </div>
              {settledPositions.length > settledLimit && (
                <button
                  onClick={() =>
                    setSettledLimit((l) => l + POSITIONS_PER_PAGE)
                  }
                  className="mt-3 w-full rounded-xl border border-border-subtle py-3 text-sm text-text-secondary transition-all hover:border-border-hover hover:text-text-primary"
                >
                  Load More ({settledPositions.length - settledLimit} remaining)
                </button>
              )}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && positions.length === 0 && (
            <div className="mt-8 flex flex-col items-center rounded-2xl border border-border-subtle p-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bg-elevated">
                <TrendingUp size={28} className="text-text-tertiary" />
              </div>
              <h3 className="mt-6 text-lg font-black text-text-primary">
                No positions yet
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-secondary">
                Install the Priced Chrome extension to see live prediction
                market odds on tweets and trade in one click.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href="#waitlist"
                  className="rounded-full bg-accent-amber px-6 py-3 text-sm font-bold text-bg-deepest transition-opacity hover:opacity-90"
                >
                  Add to Chrome
                </a>
                <a
                  href="/"
                  className="rounded-full border border-border-subtle px-6 py-3 text-sm font-medium text-text-secondary transition-all hover:border-border-hover hover:text-text-primary"
                >
                  Learn More
                </a>
              </div>
            </div>
          )}
        </div>

        {/* History tab -- always mounted to keep SWR cache warm */}
        <div className={activeTab === "history" ? "" : "hidden"}>
          {walletAddress && <HistoryTimeline wallet={walletAddress} />}
        </div>
      </main>

      <Footer />

      {/* Close position modal */}
      <ClosePositionModal
        position={closeModal.position}
        isOpen={closeModal.open}
        onClose={() => setCloseModal({ open: false, position: null })}
        onSuccess={() => mutate()}
      />

      {/* Claiming overlay */}
      {claimingPosition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deepest/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border-subtle bg-bg-surface p-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-text-tertiary border-t-accent-amber" />
            <p className="text-sm text-text-secondary">
              Claiming winnings...
            </p>
          </div>
        </div>
      )}
    </>
  );
}
