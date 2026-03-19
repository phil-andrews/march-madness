import type { Metadata } from "next";
import { Manrope, Noto_Serif } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/site-nav";
import { cn } from "@/lib/utils";

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-noto-serif",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pick-10 Tracker",
  description: "Live March Madness Pick-10 standings for a small group pool.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-serif", notoSerif.variable)}>
      <body className={`${manrope.variable} font-sans antialiased`}>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
