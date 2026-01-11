import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import Background from "../components/Background"; // Adjusted path
import { UserProvider } from "@/contexts/authContext";
import { getCurrentUser } from "@/lib/auth";

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
  subsets: ["latin"],
  weight: ["100", "200", "300","400", "500","600", "700", "800", "900"],
});

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${poppins.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider initialUser={user}>
          <Background>{children}</Background>
        </UserProvider>
      </body>
    </html>
  );
}
