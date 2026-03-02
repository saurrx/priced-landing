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
  Github,
  BookOpen,
} from "lucide-react";
import ConnectWalletModal from "./ConnectWalletModal";
import { truncateAddress } from "@/lib/transactions";
import { useToast } from "@/components/Toast";

const CTA_URL = "https://github.com/saurrx/priced";

const XIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TelegramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const SOCIAL_LINKS = [
  { href: "https://github.com/saurrx/priced", label: "GitHub", icon: "github" },
  { href: "https://x.com/SeerumAI", label: "X", icon: "x" },
  { href: "https://github.com/saurrx/priced/blob/master/docs/ARCHITECTURE.md", label: "Docs", icon: "docs" },
  { href: "https://t.me/+dz78jeyPwk5lZTI1", label: "Telegram", icon: "telegram" },
] as const;

const XIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TelegramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const SOCIAL_LINKS = [
  { href: "https://github.com/saurrx/priced", label: "GitHub", icon: "github" },
  { href: "https://x.com/SeerumAI", label: "X", icon: "x" },
  { href: "https://github.com/saurrx/priced/blob/master/docs/ARCHITECTURE.md", label: "Docs", icon: "docs" },
  { href: "https://t.me/+dz78jeyPwk5lZTI1", label: "Telegram", icon: "telegram" },
] as const;

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
            {/* Social links — hidden on mobile, visible in footer */}
            <div className="hidden items-center gap-1 sm:flex">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="rounded-lg p-2 text-text-tertiary transition-colors hover:bg-bg-elevated hover:text-text-primary"
                >
                  {link.icon === "github" && <Github size={16} />}
                  {link.icon === "x" && <XIcon size={16} />}
                  {link.icon === "docs" && <BookOpen size={16} />}
                  {link.icon === "telegram" && <TelegramIcon size={16} />}
                </a>
              ))}
            </div>

            <div className="mx-1 hidden h-5 w-px bg-border-subtle sm:block" />

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
