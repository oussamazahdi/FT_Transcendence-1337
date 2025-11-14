import Navbar from '@/components/Navbar'

export default function RootLayout({
  children,
}: Readonly<{children: React.ReactNode;}>) {
  return (
    <>
      <Navbar />
      <div className="absolute top-35 text-white flex inset-x-0 justify-center mx-5">
        {children}
      </div>
    </>
  );
}
