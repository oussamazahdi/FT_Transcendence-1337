"use client";

import { useState, useEffect } from "react";



export function CountdownTimer({
  totalMinutes,
  totalSeconds,
  startColor,
  endColor,
  size = "md",
  onFinish,
}) {
  const [remainingTime, setRemainingTime] = useState(
    totalMinutes * 60 + totalSeconds,
  );
  const [isRunning, setIsRunning] = useState(true);

  const totalTime = totalMinutes * 60 + totalSeconds;
  const progress = (remainingTime / totalTime) * 100;

  const interpolateColor = (color1, color2, factor) => {
    const parseHex = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
        : { r: 255, g: 255, b: 255 };
    };

    const c1 = parseHex(color1);
    const c2 = parseHex(color2);

    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);

    return `rgb(${r}, ${g}, ${b})`;
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => Math.max(0, +(prev - 0.1).toFixed(2)));
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (remainingTime <= 0 && isRunning) {
      setIsRunning(false);
      onFinish?.();
    }
  }, [remainingTime, isRunning]);

  useEffect(() => {
    setRemainingTime(totalMinutes * 60 + totalSeconds);
  }, [totalMinutes, totalSeconds]);

  const displayMinutes = Math.floor(remainingTime / 60);
  const displaySeconds = Math.floor(remainingTime % 60);
  const displayMillis = Math.floor((remainingTime % 1) * 100);

  const currentColor = interpolateColor(
    startColor,
    endColor,
    1 - progress / 100,
  );

  const sizeStyles = {
    sm: { height: "h-1", text: "text-xs" },
    md: { height: "h-2", text: "text-sm" },
    lg: { height: "h-3", text: "text-base" },
  };

  return (
    <div className="w-full space-y-2">
      <div
        className={`text-center font-mono font-semibold ${sizeStyles[size].text}`}
      >
        <span style={{ color: currentColor }}>
          {displayMinutes.toString().padStart(2, "0")}:
          {displaySeconds.toString().padStart(2, "0")}.
          {displayMillis.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="relative w-full bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`${sizeStyles[size].height} rounded-full transition-all duration-100 ease-linear`}
          style={{
            width: `${progress}%`,
            backgroundColor: currentColor,
            boxShadow: `0 0 12px ${currentColor}`,
          }}
        />
      </div>
    </div>
  );
}
