"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, CheckCircle } from "lucide-react"

export function DomaFaucet() {
  const [claimed, setClaimed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleClaim = async () => {
    setLoading(true)
    // Simulate faucet claim
    setTimeout(() => {
      setClaimed(true)
      setLoading(false)
      alert("100 DOMA-TEST tokens claimed successfully!")
    }, 2000)
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-500" />
          DOMA Testnet Faucet
        </CardTitle>
        <CardDescription>Get free DOMA-TEST tokens for testing domain tokenization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Available: 100 DOMA-TEST</p>
            <p className="text-xs text-gray-500">Testnet tokens only</p>
          </div>
          <Button onClick={handleClaim} disabled={claimed || loading} className="bg-blue-500 hover:bg-blue-600">
            {loading ? (
              "Claiming..."
            ) : claimed ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Claimed
              </>
            ) : (
              "Get 100 DOMA-TEST"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
