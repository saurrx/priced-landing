import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://priced.seerum.ai"),
  title: "Priced — Every opinion has a price",
  description:
    "Chrome extension that surfaces live prediction market odds on tweets. Trade in one click via Solana Blinks.",
  openGraph: {
    title: "Priced by Seerum",
    description: "See live odds on tweets. Trade without leaving X.",
    url: "https://priced.seerum.ai",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Priced — Every opinion has a price",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
