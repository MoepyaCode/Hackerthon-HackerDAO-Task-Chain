import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Web3Provider } from "@/components/providers/web3-provider";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskChain - Gamify Developer Productivity",
  description: "TaskChain integrates with GitHub to track contributions, rank developers on leaderboards, and distribute crypto rewards and NFT badges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50`}
        >
          <Web3Provider>
            {children}
          </Web3Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}