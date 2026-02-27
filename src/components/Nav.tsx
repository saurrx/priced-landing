"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { Wallet } from "lucide-react";
import ConnectWalletModal from "./ConnectWalletModal";
import { truncateAddress } from "@/lib/transactions";

const CTA_URL = "#waitlist";

export default function Nav() {
  const { publicKey, connected } = useWallet();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const handlePortfolioClick = () => {
    if (connected) {
      router.push("/portfolio");
    } else {
      setModalOpen(true);
    }
  };

  return (
    <>
      <nav className="fixed top-0 right-0 left-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-b-2xl border-b border-border-subtle bg-bg-deepest/70 px-6 py-4 backdrop-blur-xl">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-accent-amber">
              PRICED
            </span>
          </a>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePortfolioClick}
              className="flex items-center gap-2 rounded-full border border-border-subtle px-4 py-2.5 text-sm font-medium text-text-secondary transition-all hover:border-border-hover hover:text-text-primary"
            >
              {connected && publicKey ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-trading-green" />
                  <span className="font-mono text-xs">
                    {truncateAddress(publicKey.toBase58())}
                  </span>
                </>
              ) : (
                <>
                  <Wallet size={16} />
                  <span>My Portfolio</span>
                </>
              )}
            </button>
            <a
              href={CTA_URL}
              onClick={() => console.log("cta_click", { location: "nav" })}
              className="rounded-full bg-accent-amber px-5 py-2.5 text-sm font-bold text-bg-deepest transition-opacity hover:opacity-90"
            >
              Add to Chrome
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
