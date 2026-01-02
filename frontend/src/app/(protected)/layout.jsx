import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="relative mt-3 md:mt-5 text-white flex inset-x-0 justify-center">
        {children}
      </div>
    </>
  );
}
