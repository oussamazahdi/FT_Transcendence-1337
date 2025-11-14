"use client"

// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import Background from '../components/Background' // Adjusted path
import { usePathname } from "next/navigation";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],   // required
  weight: ["400", "500", "700"], // optional: choose the weights you need
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();
  // const hideNavBar = pathName === "/game/pingPong/local-game"
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${poppins.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Background>
          {children}
        </Background>
      </body>
    </html>
  );
}