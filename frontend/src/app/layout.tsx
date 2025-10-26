import type { Metadata } from "next";
import { Geist, Geist_Mono, Schoolbell } from "next/font/google";
import "./globals.css";
import Clouds from "@/components/Clouds";
import { TransitionProvider } from "@/contexts/TransitionContext";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const schoolbell = Schoolbell({
  weight: "400",
  variable: "--font-schoolbell",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dootle",
  description: "Draw a character and generate AI stories",
  icons: {
    icon: '/DootlePencil.png',
    apple: '/DootlePencil.png',
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
        <link rel="icon" href="/DootlePencil.png" type="image/png" />
        <link rel="apple-touch-icon" href="/DootlePencil.png" />
        <link rel="shortcut icon" href="/DootlePencil.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${schoolbell.variable} antialiased`}
      >
        <AuthProvider>
          <TransitionProvider>
            <Clouds />
            {children}
          </TransitionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
