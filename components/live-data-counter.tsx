"use client"

import { useState, useEffect } from "react"

interface LiveDataCounterProps {
  targetValue: number
  title: string
  duration?: number
}

export function LiveDataCounter({ targetValue, title, duration = 2 }: LiveDataCounterProps) {
  const [currentValue, setCurrentValue] = useState(0)

  useEffect(() => {
    const increment = targetValue / (duration * 60) // 60 FPS
    const timer = setInterval(() => {
      setCurrentValue((prev) => {
        if (prev >= targetValue) {
          clearInterval(timer)
          return targetValue
        }
        return Math.min(prev + increment, targetValue)
      })
    }, 1000 / 60)

    return () => clearInterval(timer)
  }, [targetValue, duration])

  return <div className="text-2xl font-bold">{Math.floor(currentValue).toLocaleString()}</div>
}
