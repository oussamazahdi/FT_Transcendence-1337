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
        <div className="flex-1 overflow-hidden pt-4 flex justify-center mx-2 text-white">
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