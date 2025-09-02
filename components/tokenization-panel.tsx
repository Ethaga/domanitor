"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DomaAPI, type TokenizationRequest } from "@/lib/doma-api"
import { Coins, Zap, Shield, ArrowRight, ExternalLink, Layers, DollarSign } from "lucide-react"
import { LoanCalculator } from "@/components/loan-calculator"
import { TransactionSimulator } from "@/components/transaction-simulator"

interface TokenizationPanelProps {
  walletAddress: string
  isConnected: boolean
}

export function TokenizationPanel({ walletAddress, isConnected }: TokenizationPanelProps) {
  const [domain, setDomain] = useState("")
  const [selectedRegistrar, setSelectedRegistrar] = useState("D3")
  const [tokenizationProgress, setTokenizationProgress] = useState(0)
  const [isTokenizing, setIsTokenizing] = useState(false)
  const [fractionalize, setFractionalize] = useState(false)
  const [totalShares, setTotalShares] = useState(1000)
  const [txHash, setTxHash] = useState("")
  const [error, setError] = useState("")

  const handleTokenize = async () => {
    if (!isConnected || !domain) return

    const normalized = domain.trim().toLowerCase()
    const parts = normalized.split('.')
    const sld = parts[0]
    const tld = parts.slice(1).join('.')
    const domainRegex = /^[a-z0-9-]{1,63}\.[a-z0-9.-]{2,63}$/i
    if (!sld || !tld || !domainRegex.test(normalized)) {
      setError('Masukkan domain yang valid, mis. example.com')
      return
    }

    setIsTokenizing(true)
    setError("")
    setTokenizationProgress(0)

    try {
      const request: TokenizationRequest = {
        domain: normalized,
        registrar: selectedRegistrar,
        walletAddress,
        fractionalize,
        totalShares: fractionalize ? totalShares : undefined,
      }

      // Simulate progress updates
      setTokenizationProgress(25)
      setTimeout(() => setTokenizationProgress(50), 1000)
      setTimeout(() => setTokenizationProgress(75), 2000)

      const result = await DomaAPI.tokenizeDomain(request)

      if (result.success) {
        setTokenizationProgress(100)
        setTxHash(result.txHash || "")

        // If fractionalizing, create fractional tokens
        if (fractionalize && result.txHash) {
          setTimeout(async () => {
            await DomaAPI.fractionalizeDomain(result.txHash!, totalShares)
          }, 1000)
        }
      } else {
        setError(result.error || "Tokenization failed")
        setTokenizationProgress(0)
      }
    } catch (err) {
      setError("Network error occurred")
      setTokenizationProgress(0)
    } finally {
      setIsTokenizing(false)
    }
  }

  const resetForm = () => {
    setDomain("")
    setTokenizationProgress(0)
    setTxHash("")
    setError("")
    setFractionalize(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tokenization Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Tokenize Domain on Doma Protocol
            </CardTitle>
            <CardDescription>
              Convert your domain into a tradeable NFT using Doma's ICANN-compliant tokenization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isConnected && (
              <Alert>
                <AlertDescription>Connect your wallet to start tokenizing domains on Doma Network.</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="domain">Domain Name</Label>
              <Input
                id="domain"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                disabled={!isConnected || isTokenizing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrar">Registrar</Label>
              <Select
                value={selectedRegistrar}
                onValueChange={setSelectedRegistrar}
                disabled={!isConnected || isTokenizing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select registrar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="D3">D3 (Doma Network)</SelectItem>
                  <SelectItem value="GoDaddy">GoDaddy</SelectItem>
                  <SelectItem value="Namecheap">Namecheap</SelectItem>
                  <SelectItem value="Cloudflare">Cloudflare</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Enable Fractionalization
                  </Label>
                  <p className="text-sm text-muted-foreground">Split domain into tradeable shares</p>
                </div>
                <Switch
                  checked={fractionalize}
                  onCheckedChange={setFractionalize}
                  disabled={!isConnected || isTokenizing}
                />
              </div>

              <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-accent" />
                  <span className="font-semibold text-sm">Domain Financing</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Gunakan domain sebagai jaminan pinjaman atau sewa pendanaan
                </p>
                <LoanCalculator minValue={100} maxValue={10000} loanPercentage={70} />
              </div>

              {fractionalize && (
                <div className="space-y-2">
                  <Label htmlFor="shares">Total Shares</Label>
                  <Input
                    id="shares"
                    type="number"
                    value={totalShares}
                    onChange={(e) => setTotalShares(Number.parseInt(e.target.value) || 1000)}
                    min="100"
                    max="10000"
                    disabled={!isConnected || isTokenizing}
                  />
                  <p className="text-xs text-muted-foreground">
                    Each share represents fractional ownership of the domain
                  </p>
                </div>
              )}
            </div>

            {domain && (
              <div className="space-y-2">
                <Label>Estimated Tokenization Cost</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-lg font-bold">0.05 ETH</div>
                  <div className="text-sm text-muted-foreground">Testnet transaction - no real cost</div>
                </div>
              </div>
            )}

            {tokenizationProgress > 0 && (
              <div className="space-y-2">
                <Label>Tokenization Progress</Label>
                <Progress value={tokenizationProgress} className="w-full" />
                <div className="text-sm text-muted-foreground">
                  {tokenizationProgress < 100 ? "Processing on Doma Protocol..." : "Successfully tokenized!"}
                </div>
              </div>
            )}

            {txHash && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <AlertDescription className="flex items-center gap-2">
                  <span>Transaction successful!</span>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={`https://explorer-testnet.doma.xyz/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                      View on Explorer
                    </a>
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={handleTokenize} className="flex-1" disabled={!isConnected || !domain || isTokenizing}>
                <Zap className="h-4 w-4 mr-2" />
                {isTokenizing ? "Tokenizing..." : "Tokenize on Doma"}
              </Button>

              {(txHash || error) && (
                <Button variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Benefits & Features */}
        <Card>
          <CardHeader>
            <CardTitle>Doma Protocol Benefits</CardTitle>
            <CardDescription>Revolutionary Domanitor features powered by Doma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold">ICANN Compliant Tokenization</h4>
                <p className="text-sm text-muted-foreground">
                  Fully compliant with domain regulations while enabling blockchain functionality
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Coins className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold">Instant Settlement</h4>
                <p className="text-sm text-muted-foreground">
                  Trade domains instantly without escrow services or lengthy transfer processes
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold">Fractionalization</h4>
                <p className="text-sm text-muted-foreground">
                  Split premium domains into affordable shares for broader ownership
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <ArrowRight className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h4 className="font-semibold">State Synchronization</h4>
                <p className="text-sm text-muted-foreground">
                  Bi-directional sync between blockchain and traditional DNS systems
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold mb-2">Domanitor Features</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Fractional Ownership</Badge>
                <Badge variant="secondary">Collateralized Lending</Badge>
                <Badge variant="secondary">Yield Generation</Badge>
                <Badge variant="secondary">Rights Management</Badge>
                <Badge variant="secondary">Cross-Chain Bridge</Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full bg-transparent" asChild>
              <a href="https://docs.doma.xyz" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Learn More About Doma Protocol
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tokenizations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Doma Protocol Activity</CardTitle>
          <CardDescription>Latest domains tokenized on the Doma Network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <TransactionSimulator />
          </div>

          <div className="space-y-3">
            {[
              {
                domain: "crypto-exchange.com",
                value: "$125,000",
                registrar: "D3",
                time: "2 hours ago",
                fractionalized: true,
                shares: 1000,
              },
              {
                domain: "nft-gallery.xyz",
                value: "$45,000",
                registrar: "D3",
                time: "5 hours ago",
                fractionalized: false,
              },
              {
                domain: "defi-protocol.io",
                value: "$89,500",
                registrar: "D3",
                time: "1 day ago",
                fractionalized: true,
                shares: 500,
              },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">{item.domain}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>{item.time}</span>
                    {item.fractionalized && (
                      <Badge variant="outline" className="text-xs">
                        {item.shares} shares
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold">{item.value}</div>
                  <Badge variant="outline" className="text-xs">
                    {item.registrar}
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
