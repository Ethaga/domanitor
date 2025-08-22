"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Coins, Zap, Shield, ArrowRight } from "lucide-react"

export function TokenizationPanel() {
  const [domain, setDomain] = useState("")
  const [selectedChain, setSelectedChain] = useState("")
  const [tokenizationProgress, setTokenizationProgress] = useState(0)

  const handleTokenize = async () => {
    // Simulate tokenization process
    setTokenizationProgress(25)
    setTimeout(() => setTokenizationProgress(50), 1000)
    setTimeout(() => setTokenizationProgress(75), 2000)
    setTimeout(() => setTokenizationProgress(100), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tokenization Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Tokenize Domain
            </CardTitle>
            <CardDescription>Convert your domain into a tradeable NFT on the Doma protocol</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain Name</Label>
              <Input id="domain" placeholder="example.com" value={domain} onChange={(e) => setDomain(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chain">Target Chain</Label>
              <Select value={selectedChain} onValueChange={setSelectedChain}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blockchain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doma">Doma Protocol</SelectItem>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estimated Value</Label>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold">$24,500</div>
                <div className="text-sm text-muted-foreground">Based on domain metrics</div>
              </div>
            </div>

            {tokenizationProgress > 0 && (
              <div className="space-y-2">
                <Label>Tokenization Progress</Label>
                <Progress value={tokenizationProgress} className="w-full" />
                <div className="text-sm text-muted-foreground">
                  {tokenizationProgress < 100 ? "Processing..." : "Complete!"}
                </div>
              </div>
            )}

            <Button
              onClick={handleTokenize}
              className="w-full"
              disabled={!domain || !selectedChain || tokenizationProgress > 0}
            >
              <Zap className="h-4 w-4 mr-2" />
              Tokenize Domain
            </Button>
          </CardContent>
        </Card>

        {/* Benefits & Features */}
        <Card>
          <CardHeader>
            <CardTitle>DomainFi Benefits</CardTitle>
            <CardDescription>Unlock the full potential of your domain assets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold">ICANN Compliant</h4>
                <p className="text-sm text-muted-foreground">
                  Fully compliant tokenization maintaining domain ownership rights
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Coins className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold">Instant Liquidity</h4>
                <p className="text-sm text-muted-foreground">
                  Trade domains instantly without escrow or lengthy transfers
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <ArrowRight className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold">Multi-Chain Support</h4>
                <p className="text-sm text-muted-foreground">Deploy across multiple blockchains for maximum reach</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">Supported Features</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Fractional Ownership</Badge>
                <Badge variant="secondary">Collateralized Lending</Badge>
                <Badge variant="secondary">Yield Generation</Badge>
                <Badge variant="secondary">Rights Management</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tokenizations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tokenizations</CardTitle>
          <CardDescription>Latest domains tokenized on the Doma protocol</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { domain: "crypto-exchange.com", value: "$125,000", chain: "Doma", time: "2 hours ago" },
              { domain: "nft-gallery.xyz", value: "$45,000", chain: "Ethereum", time: "5 hours ago" },
              { domain: "defi-protocol.io", value: "$89,500", chain: "Doma", time: "1 day ago" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">{item.domain}</div>
                  <div className="text-sm text-muted-foreground">{item.time}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold">{item.value}</div>
                  <Badge variant="outline" className="text-xs">
                    {item.chain}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
