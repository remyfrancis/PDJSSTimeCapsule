import type { Metadata } from "next";
import { Bebas_Neue, Noto_Sans } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Time Capsule - Preserve Your Memories",
  description: "Create digital time capsules to store your precious memories, photos, videos, and messages for the future.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${notoSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
