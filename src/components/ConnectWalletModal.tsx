"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import type { Wallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConnectWalletModal({
  isOpen,
  onClose,
}: ConnectWalletModalProps) {
  const { wallets, select, connecting, connected } = useWallet();
  const router = useRouter();
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Navigate on successful connection
  useEffect(() => {
    if (connected && isOpen) {
      onClose();
      router.push("/portfolio");
    }
  }, [connected, isOpen, onClose, router]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleSelectWallet = useCallback(
    async (wallet: Wallet) => {
      if (wallet.readyState !== WalletReadyState.Installed) {
        // Open wallet website for installation
        if (wallet.adapter.url) {
          window.open(wallet.adapter.url, "_blank");
        }
        return;
      }

      setError(null);
      setConnectingWallet(wallet.adapter.name);

      try {
        select(wallet.adapter.name);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to connect wallet"
        );
        setConnectingWallet(null);
      }
    },
    [select]
  );

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setConnectingWallet(null);
      setError(null);
    }
  }, [isOpen]);

  // Deduplicate wallets by name (wallet-standard + adapters can create dupes)
  const uniqueWallets = wallets.filter(
    (w, i, arr) => arr.findIndex((x) => x.adapter.name === w.adapter.name) === i
  );

  // Separate installed vs not-installed wallets
  const installed = uniqueWallets.filter(
    (w) => w.readyState === WalletReadyState.Installed
  );
  const notInstalled = uniqueWallets.filter(
    (w) => w.readyState !== WalletReadyState.Installed
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deepest/80 px-4 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-md rounded-2xl border border-border-subtle bg-bg-surface p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black text-text-primary">
                  Connect Wallet
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  Connect your Solana wallet to view positions, track PnL, and
                  claim winnings.
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-text-tertiary transition-colors hover:text-text-primary"
              >
                <X size={20} />
              </button>
            </div>

            {/* Wallet list */}
            <div className="mt-6 flex flex-col gap-2">
              {installed.map((wallet) => (
                <button
                  key={wallet.adapter.name}
                  onClick={() => handleSelectWallet(wallet)}
                  disabled={connecting}
                  className="flex items-center gap-4 rounded-xl border border-border-subtle bg-bg-elevated/50 px-5 py-4 transition-all hover:border-border-hover disabled:opacity-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={wallet.adapter.icon}
                    alt={wallet.adapter.name}
                    className="h-8 w-8 rounded-lg"
                  />
                  <span className="flex-1 text-left text-sm font-medium text-text-primary">
                    {wallet.adapter.name}
                  </span>

                  {connectingWallet === wallet.adapter.name ? (
                    <span className="flex items-center gap-2 text-xs text-text-secondary">
                      <span className="h-3 w-3 animate-spin rounded-full border border-text-tertiary border-t-accent-amber" />
                      Connecting...
                    </span>
                  ) : (
                    <span className="rounded-full bg-trading-green/10 px-2 py-0.5 text-xs font-medium text-trading-green">
                      Detected
                    </span>
                  )}
                </button>
              ))}

              {notInstalled.length > 0 && (
                <>
                  <div className="my-2 h-px bg-border-subtle" />
                  {notInstalled.slice(0, 4).map((wallet) => (
                    <button
                      key={wallet.adapter.name}
                      onClick={() => handleSelectWallet(wallet)}
                      className="flex items-center gap-4 rounded-xl border border-border-subtle/50 px-5 py-4 opacity-50 transition-all hover:opacity-70"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={wallet.adapter.icon}
                        alt={wallet.adapter.name}
                        className="h-8 w-8 rounded-lg grayscale"
                      />
                      <span className="flex-1 text-left text-sm text-text-secondary">
                        {wallet.adapter.name}
                      </span>
                      <span className="text-xs text-text-tertiary">
                        Install →
                      </span>
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Error */}
            {error && (
              <p className="mt-4 text-center text-sm text-trading-red">
                {error}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
