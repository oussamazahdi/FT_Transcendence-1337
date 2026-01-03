export default function Loading() {
  return (
    // 1. "grid place-items-center" is the modern way to center absolutely everything
    // 2. "h-screen" forces the box to be as tall as the screen so it can center vertically
    <div className="grid h-screen w-full place-items-center bg-black/50">
      
      {/* The Spinner */}
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/10 border-t-white"></div>
      
    </div>
  );
}