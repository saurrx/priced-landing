"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Position } from "@/lib/jupiter";
import { signAndSendTransaction, getSolscanUrl } from "@/lib/transactions";

interface ClosePositionModalProps {
  position: Position | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function formatUsd(value: number): string {
  if (Math.abs(value) < 0.005) return "$0.00";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  return `${sign}$${abs.toFixed(2)}`;
}

export default function ClosePositionModal({
  position,
  isOpen,
  onClose,
  onSuccess,
}: ClosePositionModalProps) {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [status, setStatus] = useState<
    "idle" | "signing" | "confirming" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);

  const handleClose = async () => {
    if (!position || !wallet.publicKey) return;

    setStatus("signing");
    setError(null);

    try {
      const res = await fetch("/api/close-position", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          positionPubkey: position.pubkey,
          walletPubkey: wallet.publicKey.toBase58(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create close transaction");
      }

      const { transaction } = await res.json();

      setStatus("confirming");
      const signature = await signAndSendTransaction(
        transaction,
        wallet,
        connection
      );

      setTxSignature(signature);
      setStatus("success");

      setTimeout(() => {
        onSuccess();
        onClose();
        setStatus("idle");
        setTxSignature(null);
      }, 2000);
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes("User rejected")
      ) {
        setError("Transaction cancelled");
      } else {
        setError(
          err instanceof Error ? err.message : "Transaction failed"
        );
      }
      setStatus("error");
    }
  };

  if (!position) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deepest/80 px-4 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md rounded-2xl border border-border-subtle bg-bg-surface p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-black text-text-primary">
                Close Position
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-text-tertiary hover:text-text-primary"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-2 text-sm text-text-secondary">
              This will sell all your contracts at the current market price. Your
              wallet will prompt you to sign.
            </p>

            {/* Position details */}
            <div className="mt-5 rounded-xl bg-bg-elevated p-4">
              <p className="text-sm font-medium text-text-primary">
                {position.marketTitle}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-text-tertiary">Contracts</p>
                  <p className="mt-0.5 font-mono text-text-primary">
                    {position.contracts}
                  </p>
                </div>
                <div>
                  <p className="text-text-tertiary">Est. Proceeds</p>
                  <p className="mt-0.5 font-mono text-text-primary">
                    {formatUsd(position.value)}
                  </p>
                </div>
                <div>
                  <p className="text-text-tertiary">Est. PnL</p>
                  <p
                    className={`mt-0.5 font-mono font-bold ${
                      position.pnl >= 0
                        ? "text-trading-green"
                        : "text-trading-red"
                    }`}
                  >
                    {formatUsd(position.pnl)}
                  </p>
                </div>
                <div>
                  <p className="text-text-tertiary">Side</p>
                  <p
                    className={`mt-0.5 font-mono font-bold ${
                      position.isYes
                        ? "text-trading-green"
                        : "text-trading-red"
                    }`}
                  >
                    {position.isYes ? "YES" : "NO"}
                  </p>
                </div>
              </div>
            </div>

            {/* Status messages */}
            {status === "success" && txSignature && (
              <div className="mt-4 rounded-xl bg-trading-green/10 p-3 text-center text-sm text-trading-green">
                Position closed!{" "}
                <a
                  href={getSolscanUrl(txSignature)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  View on Solscan
                </a>
              </div>
            )}

            {error && (
              <p className="mt-4 text-center text-sm text-trading-red">
                {error}
              </p>
            )}

            {/* Actions */}
            <div className="mt-5 flex gap-3">
              <button
                onClick={onClose}
                disabled={status === "signing" || status === "confirming"}
                className="flex-1 rounded-full border border-border-subtle py-3 text-sm font-medium text-text-secondary transition-all hover:border-border-hover hover:text-text-primary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClose}
                disabled={status !== "idle" && status !== "error"}
                className="flex-1 rounded-full bg-trading-red py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {status === "signing"
                  ? "Signing..."
                  : status === "confirming"
                    ? "Confirming..."
                    : "Close & Sell"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
