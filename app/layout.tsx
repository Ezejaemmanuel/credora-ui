import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AsyncProvider } from "./async-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Credora - Decentralized Credit Intelligence",
  description: "Credora is a futuristic, AI-powered DeFi protocol enabling undercollateralized lending. AI that evaluates trust, not just tokens.",
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
        <AsyncProvider>
          {children}
        </AsyncProvider>
      </body>
    </html>
  );
}
