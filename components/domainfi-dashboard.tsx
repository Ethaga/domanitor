"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DomainMonitor } from "@/components/domain-monitor"
import { TokenizationPanel } from "@/components/tokenization-panel"
import { AlertsPanel } from "@/components/alerts-panel"
import { AnalyticsChart } from "@/components/analytics-chart"
import { ConnectWallet } from "@/components/connect-wallet"
import { DomaAPI } from "@/lib/doma-api"
import {
  Bell,
  TrendingUp,
  Coins,
  Activity,
  ExternalLink,
  DollarSign,
  Sparkles,
  Shield,
  Brain,
  Award,
  Info,
} from "lucide-react"
import Image from "next/image"

export function DomanitorDashboard() {
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [metrics, setMetrics] = useState<any>(null)
  const [walletAddress, setWalletAddress] = useState<string>("")

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await DomaAPI.getMarketMetrics()
        setMetrics(data)
      } catch (error) {
        console.error("[v0] Failed to load Doma metrics:", error)
      }
    }

    loadMetrics()
    const interval = setInterval(loadMetrics, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const handleWalletConnect = (connected: boolean, address?: string) => {
    setIsConnected(connected)
    if (address) {
      setWalletAddress(address)
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Image src="/domanitor-logo.png" alt="Domanitor Logo" width={32} height={32} className="h-8 w-8" />
                  <h1 className="text-2xl font-bold text-foreground">Domanitor</h1>
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    Doma Testnet
                  </Badge>
                </div>
                <div className="hidden lg:flex items-center">
                  <Badge variant="outline" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Now Supporting: Ethereum (.eth) | Solana (.sol) | BNB Chain (.bnb) | Cosmos (.cosmos)
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <a
                    href="https://start.doma.xyz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Doma Protocol
                  </a>
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-xs">
                      {notifications}
                    </Badge>
                  )}
                </Button>
                <ConnectWallet isConnected={isConnected} onConnect={handleWalletConnect} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {!isConnected && (
            <Alert className="mb-6 border-accent bg-accent/10">
              <Activity className="h-4 w-4" />
              <AlertDescription>
                Connect your wallet to access Domanitor features and start tokenizing domains on Doma testnet.
                <strong> All transactions are on testnet - no real funds required.</strong>
              </AlertDescription>
            </Alert>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
                <Image
                  src="/domanitor-logo.png"
                  alt="Domanitor Logo"
                  width={32}
                  height={32}
                  className="h-4 w-4 text-muted-foreground"
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.totalDomains?.toLocaleString() || "..."}</div>
                <p className="text-xs text-muted-foreground">Tokenized on Doma Protocol</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tokenized Value</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${metrics?.tokenizedValue ? (metrics.tokenizedValue / 1000000).toFixed(1) + "M" : "..."}
                </div>
                <p className="text-xs text-muted-foreground">Total market cap</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">24h Transactions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.transactions24h || "..."}</div>
                <p className="text-xs text-muted-foreground">{metrics?.uniqueUsers24h || "..."} unique users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue Potential</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${metrics?.monthlyRevenue ? (metrics.monthlyRevenue / 1000).toFixed(1) + "K" : "..."}
                </div>
                <p className="text-xs text-muted-foreground">Monthly projection</p>
                <div className="mt-4 space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    Keunggulan Domanitor
                  </h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                          <Brain className="h-3 w-3" />
                          <span>
                            <strong>AI Valuation Engine:</strong> Prediksi harga domain berbasis ML
                          </span>
                          <Info className="h-3 w-3" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>AI Valuation → Klik untuk demo prediksi</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                          <Shield className="h-3 w-3" />
                          <span>
                            <strong>Trademark Shield:</strong> Proteksi otomatis anti-squatting
                          </span>
                          <Info className="h-3 w-3" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Trademark Shield → Klik untuk demo proteksi</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                          <Sparkles className="h-3 w-3" />
                          <span>
                            <strong>Enterprise Tools:</strong> Manajemen brand (.com + .web3)
                          </span>
                          <Info className="h-3 w-3" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enterprise Tools → Klik untuk demo manajemen</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {isConnected && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Domain Financing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nilai Domain (USD)</label>
                    <input
                      type="number"
                      placeholder="10000"
                      className="w-full px-3 py-2 border rounded-md"
                      id="domain-value"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Durasi Pinjaman (30-365 hari)</label>
                    <input type="range" min="30" max="365" defaultValue="90" className="w-full" id="loan-duration" />
                    <div className="text-xs text-muted-foreground">90 hari</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pinjaman Tersedia</label>
                    <div className="text-2xl font-bold text-green-600">$7,000</div>
                    <div className="text-xs text-muted-foreground">70% dari nilai domain</div>
                    <Button className="w-full mt-2">Ajukan Pinjaman</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="monitor" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="monitor">Domain Portfolio</TabsTrigger>
              <TabsTrigger value="tokenize">Tokenize & Fractionalize</TabsTrigger>
              <TabsTrigger value="alerts">Alert Bots</TabsTrigger>
              <TabsTrigger value="analytics">On-Chain Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="monitor" className="space-y-6">
              <DomainMonitor walletAddress={walletAddress} isConnected={isConnected} />
            </TabsContent>

            <TabsContent value="tokenize" className="space-y-6">
              <TokenizationPanel walletAddress={walletAddress} isConnected={isConnected} />
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <AlertsPanel walletAddress={walletAddress} isConnected={isConnected} />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <AnalyticsChart metrics={metrics} />
            </TabsContent>
          </Tabs>

          <footer className="mt-16 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  DomainFi Challenge
                </Badge>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/hackathon" className="text-sm">
                    DomainFi Challenge Submission
                  </a>
                </Button>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Built with Doma Protocol • Testnet Only</span>
                <span>•</span>
                <a href="#" className="hover:text-foreground">
                  Smart Contract Audit: View Report
                </a>
                <span>•</span>
                <a href="#" className="hover:text-foreground">
                  Security Provider: Forta
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </TooltipProvider>
  )
}
