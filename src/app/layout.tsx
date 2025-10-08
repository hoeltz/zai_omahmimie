import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Omah Mimie - Aplikasi Pendataan Properti",
  description: "Aplikasi responsif untuk pendataan properti dengan fitur export PDF dan Excel",
  keywords: ["properti", "real estate", "pendataan", "indonesia", "omah mimie"],
  authors: [{ name: "Omah Mimie Team" }],
  openGraph: {
    title: "Omah Mimie - Pendataan Properti",
    description: "Aplikasi responsif untuk pendataan properti",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Navigation />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
