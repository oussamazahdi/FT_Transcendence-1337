// "use client";


export default function Background({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background layer */}
      <div className="fixed inset-0 -z-10 ">
        <img
          src="/BG.png"
          alt="Background"
          className="w-full h-full object-cover scale-110"
        />

        {/* Optional dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-xs"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
