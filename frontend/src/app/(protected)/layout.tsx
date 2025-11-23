import Navbar from '@/components/Navbar'

export default function RootLayout({
  children,
}: Readonly<{children: React.ReactNode;}>) {
  return (
    <>
      <Navbar />
      <div className="relative mt-5 text-white flex inset-x-0 justify-center">
        {children}
      </div>
    </>
  );
}
