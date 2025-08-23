"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { DollarSign } from "lucide-react"

interface LoanCalculatorProps {
  minValue: number
  maxValue: number
  loanPercentage: number
}

export function LoanCalculator({ minValue, maxValue, loanPercentage }: LoanCalculatorProps) {
  const [domainValue, setDomainValue] = useState([5000])

  const availableLoan = Math.floor((domainValue[0] * loanPercentage) / 100)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4" />
          Live Loan Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Domain Value: ${domainValue[0].toLocaleString()}</Label>
          <Slider
            value={domainValue}
            onValueChange={setDomainValue}
            max={maxValue}
            min={minValue}
            step={100}
            className="w-full"
          />
        </div>

        <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="text-lg font-bold text-green-700 dark:text-green-300">
            Pinjaman Tersedia: ${availableLoan.toLocaleString()}
          </div>
          <div className="text-sm text-green-600 dark:text-green-400">{loanPercentage}% dari nilai domain</div>
        </div>
      </CardContent>
    </Card>
  )
}
