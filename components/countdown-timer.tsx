"use client"

import { useState, useEffect } from "react"

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const targetDate = new Date("2025-09-15T23:59:59Z").getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="countdown-banner bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg text-center mb-6 border border-yellow-200 dark:border-yellow-800">
      <h3 className="font-bold text-lg text-yellow-800 dark:text-yellow-200">Submission Deadline</h3>
      <div className="text-2xl font-mono font-bold my-2 text-yellow-900 dark:text-yellow-100">
        {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
      </div>
      <p className="text-yellow-700 dark:text-yellow-300">September 15, 2025</p>
    </div>
  )
}
