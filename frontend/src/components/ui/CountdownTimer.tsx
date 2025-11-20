'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  totalMinutes: number
  totalSeconds: number
  startColor: string
  endColor: string
  size?: 'sm' | 'md' | 'lg'
}

export function CountdownTimer({
  totalMinutes,
  totalSeconds,
  startColor,
  endColor,
  size = 'md',
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
    if (!isRunning || remainingTime <= 0) return

    const interval = setInterval(() => {
      setRemainingTime((prev) => Math.max(0, prev - 0.1))
    }, 100)

    return () => clearInterval(interval)
  }, [isRunning, remainingTime])

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
