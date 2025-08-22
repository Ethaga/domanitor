"use client"

import { useState } from "react"
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
import { Bell, Globe, TrendingUp, Coins, Activity } from "lucide-react"

export function DomainFiDashboard() {
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState(3)

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
                  Testnet
                </Badge>
              </div>
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
              <ConnectWallet isConnected={isConnected} onConnect={setIsConnected} />
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
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tokenized Value</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2.4M</div>
              <p className="text-xs text-muted-foreground">+8.2% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">3 expiring soon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12.8K</div>
              <p className="text-xs text-muted-foreground">+24% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="monitor" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="monitor">Domain Monitor</TabsTrigger>
            <TabsTrigger value="tokenize">Tokenization</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Bots</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="monitor" className="space-y-6">
            <DomainMonitor />
          </TabsContent>

          <TabsContent value="tokenize" className="space-y-6">
            <TokenizationPanel />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertsPanel />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsChart />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
