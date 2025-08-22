"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DomainMonitor } from "@/components/domain-monitor"
import { TokenizationPanel } from "@/components/tokenization-panel"
import { AlertsPanel } from "@/components/alerts-panel"
import { AnalyticsChart } from "@/components/analytics-chart"
import { ConnectWallet } from "@/components/connect-wallet"
import { DomaAPI } from "@/lib/doma-api"
import { Bell, Globe, TrendingUp, Coins, Activity, ExternalLink } from "lucide-react"

export function DomainFiDashboard() {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Globe className="h-8 w-8 text-accent" />
                <h1 className="text-2xl font-bold text-foreground">DomainFi</h1>
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  Doma Testnet
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
              Connect your wallet to access DomainFi features and start tokenizing domains on Doma testnet.
              <strong> All transactions are on testnet - no real funds required.</strong>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
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
            </CardContent>
          </Card>
        </div>

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
      </div>
    </div>
  )
}
