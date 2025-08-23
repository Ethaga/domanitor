"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Clock, Droplets } from "lucide-react"

// Doma Contract Display Component
export function DomaContracts() {
  return (
    <Card className="p-4 border rounded-lg bg-gray-50">
      <CardHeader>
        <CardTitle className="font-bold mb-2">Doma Protocol Contracts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm mb-1">
          Tokenization: <span className="font-mono">0x8a1...c4d</span>
        </p>
        <p className="text-sm mb-1">
          Fractionalization: <span className="font-mono">0xe9f...a2b</span>
        </p>
        <a
          href="https://docs.doma.xyz/contracts"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 text-sm hover:underline inline-flex items-center gap-1"
        >
          <ExternalLink className="h-3 w-3" />
          View Documentation
        </a>
      </CardContent>
    </Card>
  )
}

// Countdown Timer Component
export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const deadline = new Date("2025-09-15T23:59:59Z")

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = deadline.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="countdown-banner bg-yellow-50 border-yellow-200">
      <CardContent className="p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-yellow-600" />
          <h3 className="font-bold text-lg">Submission Deadline</h3>
        </div>
        <div className="text-2xl font-mono font-bold my-2 text-yellow-800">
          {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
        </div>
        <p className="text-gray-600">September 15, 2025</p>
      </CardContent>
    </Card>
  )
}

// Faucet Component
export function FaucetButton() {
  const [claimed, setClaimed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    setLoading(true)
    // Simulate faucet claim
    setTimeout(() => {
      setClaimed(true)
      setLoading(false)
      alert("100 DOMA-TEST tokens claimed!")
    }, 2000)
  }

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <div>
              <p className="font-medium text-sm">DOMA Testnet Faucet</p>
              <p className="text-xs text-gray-500">Get 100 DOMA-TEST tokens</p>
            </div>
          </div>
          <Button
            onClick={handleClick}
            disabled={claimed || loading}
            className="bg-green-500 hover:bg-green-600"
            size="sm"
          >
            {loading ? "Claiming..." : claimed ? "Claimed" : "Get 100 DOMA-TEST"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
