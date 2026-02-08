import Navbar from "@/components/Navbar";
import { SocketProvider } from "@/contexts/socketContext.tsx";
import { ReactNode } from "react";
interface LayoutProps {
  children: ReactNode;
}
export default function RootLayout({ children }:LayoutProps) {
  return (
    <>
      <SocketProvider>
        <Navbar />
        <div className="relative mt-3 md:mt-5 text-white flex inset-x-0 justify-center mx-2">
            {children}
        </div>
      </SocketProvider>
    </>
  );
}


/**
 * 
 * 
 * 
 * 
 * last value +- value
 * last value - value > 0 : 0
 */







// UPDATE gamesettings SET player_xp -= 60 CASE player_xp <= 0 THEN SET player_xp = 0 END 