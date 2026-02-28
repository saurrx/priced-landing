import type { Metadata } from "next";
import WalletProvider from "@/providers/WalletProvider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://priced.seerum.ai"),
  title: {
    default: "Priced — Every opinion has a price",
    template: "%s | Priced",
  },
  description:
    "Chrome extension that surfaces live prediction market odds on tweets. See real-time odds, trade in one click via Solana Blinks. Powered by Jupiter.",
  keywords: [
    "prediction markets",
    "Solana",
    "Chrome extension",
    "Jupiter",
    "trading",
    "Blinks",
    "crypto",
    "odds",
    "Twitter",
    "X",
  ],
  alternates: { canonical: "https://priced.seerum.ai" },
  openGraph: {
    title: "Priced by Seerum",
    description: "See live odds on tweets. Trade without leaving X.",
    url: "https://priced.seerum.ai",
    siteName: "Priced",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Priced — Every opinion has a price",
    description:
      "See live prediction market odds on tweets. Trade in one click via Solana.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link
          rel="preload"
          href="/fonts/Satoshi-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Satoshi-Black.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Priced",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Chrome",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              description:
                "Chrome extension that surfaces live prediction market odds on tweets. Trade in one click via Solana Blinks.",
              url: "https://priced.seerum.ai",
            }),
          }}
        />
      </head>
      <body className="antialiased">
          <WalletProvider>{children}</WalletProvider>
        </body>
    </html>
  );
}
