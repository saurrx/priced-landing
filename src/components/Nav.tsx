"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Wallet,
  ChevronDown,
  Copy,
  ExternalLink,
  LogOut,
} from "lucide-react";
import ConnectWalletModal from "./ConnectWalletModal";
import { truncateAddress } from "@/lib/transactions";
import { useToast } from "@/components/Toast";

const CTA_URL = "#waitlist";

export default function Nav() {
  const { publicKey, connected, disconnect } = useWallet();
  const router = useRouter();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click-outside handler for dropdown
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const handlePortfolioClick = () => {
    if (connected) {
      router.push("/portfolio");
    } else {
      setModalOpen(true);
    }
  };

  const handleCopyAddress = () => {
    if (!publicKey) return;
    navigator.clipboard.writeText(publicKey.toBase58());
    toast("success", "Address copied to clipboard");
    setDropdownOpen(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setDropdownOpen(false);
    router.push("/");
  };

  return (
    <>
      <nav className="fixed top-0 right-0 left-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-b-2xl border-b border-border-subtle bg-bg-deepest/70 px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-4">
          <a href="/" className="flex items-center gap-2.5">
            <img
              src="/logo.jpg"
              alt="Priced logo"
              className="h-8 w-8 rounded-lg"
            />
            <div className="flex flex-col leading-none">
              <span className="text-lg font-black tracking-tight text-accent-amber sm:text-xl">
                PRICED
              </span>
              <span className="text-[9px] font-medium tracking-wide text-text-tertiary sm:text-[10px]">
                by SeerumAI
              </span>
            </div>
          </a>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* My Portfolio — always visible */}
            <button
              onClick={handlePortfolioClick}
              className="flex items-center gap-1.5 rounded-full border border-border-subtle px-3 py-2 text-sm font-medium text-text-secondary transition-all hover:border-border-hover hover:text-text-primary sm:gap-2 sm:px-4 sm:py-2.5"
            >
              <Wallet size={16} />
              <span className="hidden sm:inline">My Portfolio</span>
              <span className="sm:hidden">Portfolio</span>
            </button>

            {/* Wallet dropdown (connected) */}
            {connected && publicKey && (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 rounded-full border border-border-subtle px-3 py-2 text-sm font-medium text-text-secondary transition-all hover:border-border-hover hover:text-text-primary sm:gap-2 sm:px-4 sm:py-2.5"
                >
                  <span className="h-2 w-2 flex-shrink-0 rounded-full bg-trading-green" />
                  <span className="font-mono text-xs">
                    {truncateAddress(publicKey.toBase58())}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`flex-shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border-subtle bg-bg-surface py-1 shadow-xl">
                    <button
                      onClick={handleCopyAddress}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
                    >
                      <Copy size={14} />
                      Copy Address
                    </button>
                    <a
                      href={`https://solscan.io/account/${publicKey.toBase58()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
                    >
                      <ExternalLink size={14} />
                      View on Solscan
                    </a>
                    <div className="mx-3 my-1 h-px bg-border-subtle" />
                    <button
                      onClick={handleDisconnect}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-trading-red transition-colors hover:bg-bg-elevated"
                    >
                      <LogOut size={14} />
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            )}
            <a
              href={CTA_URL}
              onClick={() => console.log("cta_click", { location: "nav" })}
              className="rounded-full bg-accent-amber px-3 py-2 text-xs font-bold text-bg-deepest transition-opacity hover:opacity-90 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <span className="hidden sm:inline">Add to Chrome</span>
              <span className="sm:hidden">Install</span>
            </a>
          </div>
        </div>
      </nav>
      <ConnectWalletModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
