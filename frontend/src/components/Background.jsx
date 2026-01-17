"use client";
export default function Background({ children }) {
  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 z-0">
        <img
          src="/BG.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
