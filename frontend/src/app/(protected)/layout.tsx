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
