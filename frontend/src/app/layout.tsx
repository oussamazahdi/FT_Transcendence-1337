import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import Background from "../components/Background";
import { UserProvider } from "@/contexts/authContext.tsx";
import { getCurrentUser } from "@/lib/auth";

import "./globals.css";
import GlobalErrorToast from "@/components/GlobalErrorToast";
import { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300","400", "500","600", "700", "800", "900"],
});

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }:RootLayoutProps) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${poppins.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider initialUser={user}>
          <GlobalErrorToast />
          <Background>{children}</Background>
        </UserProvider>
      </body>
    </html>
  );
}
