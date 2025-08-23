"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Zap, Calculator } from "lucide-react"

export function TransactionSimulator() {
  const [domains, setDomains] = useState("")
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationResult, setSimulationResult] = useState<any>(null)

  const handleSimulate = async () => {
    if (!domains.trim()) return

    setIsSimulating(true)
    const domainList = domains
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d)

    // Simulate processing
    setTimeout(() => {
      setSimulationResult({
        domains: domainList,
        totalGas: (domainList.length * 0.0035).toFixed(4),
        estimatedTime: `${domainList.length * 2}-${domainList.length * 3} minutes`,
        totalCost: `$${(domainList.length * 12.5).toFixed(2)}`,
        success: true,
      })
      setIsSimulating(false)
    }, 2000)
  }

  return (
    <Card className="simulation-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Transaction Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          placeholder="Enter domain names (comma separated)"
          value={domains}
          onChange={(e) => setDomains(e.target.value)}
          disabled={isSimulating}
        />

        {simulationResult && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Domains to tokenize:</span>
                  <Badge variant="outline">{simulationResult.domains.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Estimated gas:</span>
                  <span className="font-mono">{simulationResult.totalGas} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing time:</span>
                  <span>{simulationResult.estimatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total cost (testnet):</span>
                  <span className="font-semibold">{simulationResult.totalCost}</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Estimated gas: {domains.split(",").filter((d) => d.trim()).length * 0.0035} ETH
          </span>
          <Button
            onClick={handleSimulate}
            disabled={!domains.trim() || isSimulating}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Zap className="h-4 w-4 mr-2" />
            {isSimulating ? "Simulating..." : "Simulate Bulk Tokenize"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
