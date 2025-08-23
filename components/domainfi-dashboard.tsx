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
import { LiveDataCounter } from "@/components/live-data-counter"
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
  Clock,
  ArrowUpRight,
} from "lucide-react"
import Image from "next/image"

export function DomanitorDashboard() {
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState(3)
  const [metrics, setMetrics] = useState<any>(null)
  const [walletAddress, setWalletAddress] = useState<string>("")

  const showDemo = (feature: string) => {
    alert(`Demo ${feature} will be displayed in production version`)
  }

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
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  >
                    <Shield className="h-3 w-3 mr-1" />
                    Audited
                  </Badge>
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
                <LiveDataCounter targetValue={metrics?.totalDomains || 12847} title="Total Domains" duration={2} />
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
                    Domanitor Advantages
                  </h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                          <Brain className="h-3 w-3" />
                          <span>
                            <strong>AI Valuation Engine:</strong> ML-based domain price prediction
                          </span>
                          <Info className="h-3 w-3" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>AI Valuation → Click for prediction demo</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                          <Shield className="h-3 w-3" />
                          <span>
                            <strong>Trademark Shield:</strong> Automatic anti-squatting protection
                          </span>
                          <Info className="h-3 w-3" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Trademark Shield → Click for protection demo</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                          <Sparkles className="h-3 w-3" />
                          <span>
                            <strong>Enterprise Tools:</strong> Brand management (.com + .web3)
                          </span>
                          <Info className="h-3 w-3" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enterprise Tools → Click for management demo</p>
                      </TooltipContent>
                    </Tooltip>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs"
                        onClick={() => showDemo("AI Valuation")}
                      >
                        Demo AI Valuation
                      </button>
                      <button
                        className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition text-xs"
                        onClick={() => showDemo("Trademark Shield")}
                      >
                        Demo Trademark Shield
                      </button>
                      <button
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition text-xs"
                        onClick={() => showDemo("Enterprise Tools")}
                      >
                        Demo Enterprise Tools
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {isConnected && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Latest Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="transaction-history space-y-3">
                  <div className="tx-item flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">user123.eth</span>
                      <Badge variant="outline" className="text-xs">
                        Tokenized
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>2 mins ago</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="tx-item flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">brand456.sol</span>
                      <Badge variant="outline" className="text-xs">
                        Fractionalized
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>5 mins ago</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </div>
                  </div>
                  <div className="tx-item flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium">yourname.bnb</span>
                      <Badge variant="outline" className="text-xs">
                        Listed
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>12 mins ago</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                    <label className="text-sm font-medium">Domain Value (USD)</label>
                    <input
                      type="number"
                      placeholder="10000"
                      className="w-full px-3 py-2 border rounded-md"
                      id="domain-value"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Loan Duration (30-365 days)</label>
                    <input type="range" min="30" max="365" defaultValue="90" className="w-full" id="loan-duration" />
                    <div className="text-xs text-muted-foreground">90 days</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Available Loan</label>
                    <div className="text-2xl font-bold text-green-600">$7,000</div>
                    <div className="text-xs text-muted-foreground">70% of domain value</div>
                    <Button className="w-full mt-2">Apply for Loan</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="monitor" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="monitor">Portfolio</TabsTrigger>
              <TabsTrigger value="tokenize">Tokenize</TabsTrigger>
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="bridge">Bridge</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="monitor" className="space-y-6">
              <DomainMonitor walletAddress={walletAddress} isConnected={isConnected} />
            </TabsContent>

            <TabsContent value="tokenize" className="space-y-6">
              <TokenizationPanel walletAddress={walletAddress} isConnected={isConnected} />
            </TabsContent>

            <TabsContent value="marketplace" className="space-y-6">
              <DomaMarketplace walletAddress={walletAddress} isConnected={isConnected} />
            </TabsContent>

            <TabsContent value="bridge" className="space-y-6">
              <DomaBridge walletAddress={walletAddress} isConnected={isConnected} />
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-6">
              <DomaMonitoring walletAddress={walletAddress} isConnected={isConnected} />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <DomaAnalytics walletAddress={walletAddress} isConnected={isConnected} />
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <AlertsPanel walletAddress={walletAddress} isConnected={isConnected} />
            </TabsContent>
          </Tabs>

          <footer className="mt-16 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  DomainFi Challenge
                </Badge>
                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  ✓ Audited
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
                <div className="footer-section flex items-center gap-2">
                  <a href="/audit-report" className="text-blue-500 hover:underline">
                    Smart Contract Audit: View Report
                  </a>
                  <span>•</span>
                  <a
                    href="https://forta.org"
                    target="_blank"
                    className="text-blue-500 hover:underline"
                    rel="noreferrer"
                  >
                    Security Provider: Forta
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </TooltipProvider>
  )
}
