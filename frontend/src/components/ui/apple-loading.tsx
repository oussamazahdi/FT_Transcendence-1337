"use client";

interface AppleLoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function AppleLoader({ size = "md", className = "" }: AppleLoaderProps) {

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const barSizes = {
    sm: { width: 2, height: 5, radius: 1 },
    md: { width: 3, height: 8, radius: 1.5 },
    lg: { width: 4, height: 12, radius: 2 },
    xl: { width: 5, height: 16, radius: 2.5 },
  };

  const bars = Array.from({ length: 8 }, (_, i) => i);
  const { width, height, radius } = barSizes[size];

  return (
    <div
      className={`relative ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      {bars.map((index) => {
        const rotation = index * 45;
        const delay = index * 0.125;

        return (
          <div
            key={index}
            className="absolute left-1/2 top-1/2 origin-center"
            style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}
          >
            <div
              className="bg-foreground rounded-full"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                borderRadius: `${radius}px`,
                transform: `translateY(-${height * 0.85}px)`,
                animation: "apple-spinner-fade 1s ease-in-out infinite",
                animationDelay: `${delay}s`,
              }}
            />
          </div>
        );
      })}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
