"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SliderProps {
  className?: string
  label?: string
  defaultValue?: number
  value?: number
  onChange?: (value: number) => void
  minValue?: number
  maxValue?: number
  step?: number
  showSteps?: boolean
  size?: "sm" | "md" | "lg"
  color?: "foreground" | "primary" | "secondary"
  disabled?: boolean
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      label,
      defaultValue = 0,
      value: controlledValue,
      onChange,
      minValue = 0,
      maxValue = 1,
      step = 0.1,
      showSteps = false,
      size = "md",
      color = "foreground",
      disabled = false,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const sliderRef = React.useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = React.useState(false)

    // ✅ Ensure we always have a valid value
    const value =
      controlledValue !== undefined ? controlledValue : internalValue

    // ✅ Clamp value to valid range (prevents out-of-track position)
    const clampedValue = Math.min(Math.max(value, minValue), maxValue)

    // ✅ Calculate percentage safely
    const percentage =
      ((clampedValue - minValue) / (maxValue - minValue)) * 100 || 0

    const sizeConfig = {
      sm: { track: "h-1", thumb: "w-3 h-3", step: "w-1.5 h-1.5" },
      md: { track: "h-1.5", thumb: "w-4 h-4", step: "w-2 h-2" },
      lg: { track: "h-2", thumb: "w-5 h-5", step: "w-2.5 h-2.5" },
    } as const

    const steps = React.useMemo(() => {
      if (!showSteps) return []
      const stepCount = Math.floor((maxValue - minValue) / step) + 1
      return Array.from({ length: stepCount }, (_, i) => {
        const stepValue = minValue + i * step
        const stepPercentage =
          ((stepValue - minValue) / (maxValue - minValue)) * 100
        return { value: stepValue, percentage: stepPercentage }
      })
    }, [minValue, maxValue, step, showSteps])

    const updateValue = React.useCallback(
      (clientX: number) => {
        if (!sliderRef.current || disabled) return

        const rect = sliderRef.current.getBoundingClientRect()
        const relativeX = Math.max(0, Math.min(rect.width, clientX - rect.left))
        const percent = (relativeX / rect.width) * 100
        let newValue = minValue + (percent / 100) * (maxValue - minValue)

        newValue = Math.round(newValue / step) * step
        newValue = Math.max(minValue, Math.min(maxValue, newValue))

        if (controlledValue === undefined) {
          setInternalValue(newValue)
        }
        onChange?.(newValue)
      },
      [minValue, maxValue, step, disabled, controlledValue, onChange]
    )

    const handleMouseDown = (e: React.MouseEvent) => {
      if (disabled) return
      setIsDragging(true)
      updateValue(e.clientX)
    }

    React.useEffect(() => {
      if (!isDragging) return

      const handleMouseMove = (e: MouseEvent) => updateValue(e.clientX)
      const handleMouseUp = () => setIsDragging(false)

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }, [isDragging, updateValue])

    // ✅ Keep thumb position correct when resizing the window
    React.useEffect(() => {
      const handleResize = () => {
        if (sliderRef.current && controlledValue === undefined) {
          setInternalValue((v) =>
            Math.min(Math.max(v, minValue), maxValue)
          )
        }
      }
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [minValue, maxValue, controlledValue])

    return (
      <div ref={ref} className={cn("w-full select-none", className)}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-base font-normal text-white">{label}</span>
          )}
          <span className="text-base font-normal text-white">
            {clampedValue.toFixed(1)}
          </span>
        </div>

        {/* Track */}
        <div
          ref={sliderRef}
          className={cn(
            "relative w-full cursor-pointer",
            disabled && "opacity-60"
          )}
          onMouseDown={handleMouseDown}
        >
          <div
            className={cn(
              "relative w-full rounded-full bg-gray-600",
              sizeConfig[size].track
            )}
          >
            {/* Filled track */}
            <div
              className={cn(
                "absolute left-0 top-0 h-full rounded-full transition-all duration-150 ease-out",
                color === "foreground" && "bg-[#D9D9D9]",
                color === "primary" && "bg-blue-500",
                color === "secondary" && "bg-green-500"
              )}
              style={{ width: `${percentage}%` }}
            />

            {/* Steps */}
            {showSteps &&
              steps.map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full",
                    sizeConfig[size].step,
                    s.percentage <= percentage
                      ? "bg-white"
                      : "bg-gray-400"
                  )}
                  style={{ left: `${s.percentage}%` }}
                />
              ))}
          </div>

          {/* ✅ Thumb */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white shadow-md transition-transform duration-100 ease-in-out",
              isDragging ? "scale-110" : "scale-100",
              disabled
                ? "cursor-not-allowed"
                : "cursor-grab active:cursor-grabbing",
              color === "foreground" && "bg-slate-800",
              color === "primary" && "bg-blue-500",
              color === "secondary" && "bg-green-500",
              sizeConfig[size].thumb
            )}
            style={{ left: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)

Slider.displayName = "Slider"

export { Slider }
