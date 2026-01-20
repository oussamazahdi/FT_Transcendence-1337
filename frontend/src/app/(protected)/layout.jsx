import Navbar from "@/components/Navbar";
import { SocketProvider } from "@/contexts/socketContext";

export default function RootLayout({ children }) {
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
