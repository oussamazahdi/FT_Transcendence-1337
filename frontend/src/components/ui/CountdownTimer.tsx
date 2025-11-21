'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  totalMinutes: number
  totalSeconds: number
  startColor: string
  endColor: string
  size?: 'sm' | 'md' | 'lg'

  onFinish?: () => void
}

export function CountdownTimer({
  totalMinutes,
  totalSeconds,
  startColor,
  endColor,
  size = 'md',
  onFinish,
}: CountdownTimerProps) {
  const [remainingTime, setRemainingTime] = useState(totalMinutes * 60 + totalSeconds)
  const [isRunning, setIsRunning] = useState(true)

  const totalTime = totalMinutes * 60 + totalSeconds
  const progress = (remainingTime / totalTime) * 100

  const interpolateColor = (color1: string, color2: string, factor: number) => {
    // Parse hex colors to RGB
    const parseHex = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 255, g: 255, b: 255 }
    }

    const c1 = parseHex(color1)
    const c2 = parseHex(color2)

    // Interpolate RGB values
    const r = Math.round(c1.r + (c2.r - c1.r) * factor)
    const g = Math.round(c1.g + (c2.g - c1.g) * factor)
    const b = Math.round(c1.b + (c2.b - c1.b) * factor)

    return `rgb(${r}, ${g}, ${b})`
  }

  useEffect(() => {
    // Start/stop the ticking interval based only on `isRunning`.
    // Do NOT depend on `remainingTime` here — that caused the interval
    // to be recreated every tick. The "finish" callback is handled
    // in a separate effect so it's called exactly once when time hits 0.
    if (!isRunning) return

    const interval = setInterval(() => {
      // Keep one or two decimals to avoid floating-point drift in display
      setRemainingTime((prev) => Math.max(0, +((prev - 0.1).toFixed(2))))
    }, 100)

    return () => clearInterval(interval)
  }, [isRunning])


  // 1. Handle countdown ticking
  // useEffect(() => {
  //   if (!isRunning || remainingTime <= 0) return;

  //   const interval = setInterval(() => {
  //     setRemainingTime((prev) => Math.max(0, prev - 0.1));
  //   }, 100);

  //   return () => clearInterval(interval);
  // }, [isRunning, remainingTime]);


  useEffect(() => {
    if (remainingTime <= 0 && isRunning) {
      setIsRunning(false);
      onFinish?.();
    }
  }, [remainingTime, isRunning]);


  // Reset remaining time if the input props change
  useEffect(() => {
    setRemainingTime(totalMinutes * 60 + totalSeconds)
  }, [totalMinutes, totalSeconds])


  const displayMinutes = Math.floor(remainingTime / 60)
  const displaySeconds = Math.floor(remainingTime % 60)
  const displayMillis = Math.floor((remainingTime % 1) * 100)

  const currentColor = interpolateColor(startColor, endColor, 1 - progress / 100)

  const sizeStyles = {
    sm: { height: 'h-1', text: 'text-xs' },
    md: { height: 'h-2', text: 'text-sm' },
    lg: { height: 'h-3', text: 'text-base' },
  }

  return (
    <div className="w-full space-y-2">
      <div className={`text-center font-mono font-semibold ${sizeStyles[size].text}`}>
        <span style={{ color: currentColor }}>
          {displayMinutes.toString().padStart(2, '0')}:
          {displaySeconds.toString().padStart(2, '0')}.
          {displayMillis.toString().padStart(2, '0')}
        </span>
      </div>

      <div className="relative w-full bg-gray-800 rounded-full overflow-hidden">
        {/* Progress fill with dynamic color */}
        <div
          className={`${sizeStyles[size].height} rounded-full transition-all duration-100 ease-linear`}
          style={{
            width: `${progress}%`,
            backgroundColor: currentColor,
            boxShadow: `0 0 12px ${currentColor}`,
          }}
        />
      </div>

      {/* <div className="flex gap-2 justify-center">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
        >
          {isRunning ? 'Pause' : 'Resume'}
        </button>
        <button
          onClick={() => {
            setRemainingTime(totalTime)
            setIsRunning(false)
          }}
          className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
        >
          Reset
        </button>
      </div> */}
    </div>
  )
}
