import type { ReactNode } from "react";
import Image from "next/image";

type BackgroundProps = {
  children: ReactNode;
};

export default function Background({ children }: BackgroundProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 -z-10 ">
        <Image
          src="/BG.png"
          alt="Background"
          className="w-full h-full object-cover scale-110"
          width={1920}
          height={1080}
        />

        <div className="absolute inset-0 bg-black/20 backdrop-blur-xs"></div>
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
