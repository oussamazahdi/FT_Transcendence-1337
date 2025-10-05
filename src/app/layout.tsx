import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import Background from '@/components/Background'
import Navbar from '@/components/Navbar'


// import { Bitcount_Prop_Single } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Ft_transcendence",
  description: "42 ft_transcendence is a full-stack web application project from 42 School that challenges students to \
  build a real-time multiplayer Pong game with authentication, chat, and responsive UI. It combines modern web \
  technologies, backend architecture, and advanced features like WebSockets, OAuth, and two-factor authentication, \
  showcasing skills in fullstack development, security, and scalability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Background>
          <Navbar />
          <div className="absolute top-35 text-white flex inset-x-0 justify-center mx-5">
            {children}
          </div>
        </Background>
      </body>
    </html>
  );
}
