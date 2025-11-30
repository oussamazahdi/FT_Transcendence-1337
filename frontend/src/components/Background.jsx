"use client";
export default function Background({
  children,
}) {
  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 z-0">
        <img
          src="/BG.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
