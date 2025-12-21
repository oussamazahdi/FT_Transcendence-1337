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
  subsets: ["latin"], // required
  weight: ["400", "500", "700"], // optional: choose the weights you need
});

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();
  // if(!user) 
  //   return redirect("/sign-in");
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
