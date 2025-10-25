import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Clouds from "@/components/Clouds";
import CloudTransition from "@/components/CloudTransition";
import { TransitionProvider } from "@/contexts/TransitionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Character Story Generator",
  description: "Draw a character and generate AI stories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TransitionProvider>
          <Clouds />
          <CloudTransition />
          {children}
        </TransitionProvider>
      </body>
    </html>
  );
}
