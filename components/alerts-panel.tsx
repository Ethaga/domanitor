"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Bell,
  Bot,
  Mail,
  MessageSquare,
  Calendar,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Zap,
  Users,
  Target,
} from "lucide-react"

interface AlertsPanelProps {
  walletAddress: string
  isConnected: boolean
}

export function AlertsPanel({ walletAddress, isConnected }: AlertsPanelProps) {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [discordAlerts, setDiscordAlerts] = useState(false)
  const [telegramAlerts, setTelegramAlerts] = useState(true)
  const [subscriptionTier, setSubscriptionTier] = useState("free")
  const [botMetrics, setBotMetrics] = useState<any>(null)

  useEffect(() => {
    if (isConnected) {
      const loadBotMetrics = async () => {
        // Simulate real Doma API call for bot performance metrics
        setBotMetrics({
          totalAlertsSent: 1247,
          activeSubscribers: 89,
          revenueGenerated: 2340,
          domaTransactions: 156,
          userAcquisition: 23,
          communityEngagement: 78,
        })
      }
      loadBotMetrics()
    }
  }, [isConnected])

  const alerts = [
    {
      id: 1,
      type: "expiry",
      domain: "crypto-defi.com",
      message: "Domain expires in 30 days - Auto-renewal available",
      priority: "high",
      time: "2 hours ago",
      action: "Renew Now",
      domaLink: "https://start.doma.xyz/domain/crypto-defi.com",
    },
    {
      id: 2,
      type: "sale",
      domain: "web3-domains.xyz",
      message: "Similar domain sold for $45K - Market opportunity detected",
      priority: "medium",
      time: "5 hours ago",
      action: "View Market",
      domaLink: "https://start.doma.xyz/marketplace",
    },
    {
      id: 3,
      type: "price",
      domain: "nft-marketplace.io",
      message: "Domain value increased by 15% - Consider fractionalization",
      priority: "low",
      time: "1 day ago",
      action: "Tokenize",
      domaLink: "https://start.doma.xyz/tokenize",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "expiry":
        return <Calendar className="h-4 w-4" />
      case "sale":
        return <DollarSign className="h-4 w-4" />
      case "price":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {isConnected && (
        <Card className="border-accent bg-accent/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-accent" />
                <div>
                  <h4 className="font-semibold">Bot Subscription: {subscriptionTier.toUpperCase()}</h4>
                  <p className="text-sm text-muted-foreground">
                    {subscriptionTier === "free" ? "Limited to 10 domains" : "Unlimited domains + premium features"}
                  </p>
                </div>
              </div>
              {subscriptionTier === "free" && (
                <Button size="sm" className="bg-accent hover:bg-accent/90">
                  Upgrade to Pro - $29/month
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts">Live Alerts</TabsTrigger>
          <TabsTrigger value="bots">Alert Bots</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="settings">Bot Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Real-Time Domain Alerts
              </CardTitle>
              <CardDescription>
                On-chain notifications powered by Doma Protocol - driving {botMetrics?.domaTransactions || 0}{" "}
                transactions today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="p-2 bg-muted rounded-lg">{getAlertIcon(alert.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{alert.domain}</span>
                        <Badge className={getPriorityColor(alert.priority)}>{alert.priority}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={alert.domaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {alert.action}
                        </a>
                      </Button>
                      <Button variant="ghost" size="sm">
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bots" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Telegram Alert Bot
                </CardTitle>
                <CardDescription>Automated Telegram notifications with direct buy links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Live</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Subscribers</span>
                  <span className="font-mono">{botMetrics?.activeSubscribers || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Doma Transactions</span>
                  <span className="font-mono text-accent">{botMetrics?.domaTransactions || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Revenue Generated</span>
                  <span className="font-mono text-green-600">${botMetrics?.revenueGenerated || 0}</span>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Configure Telegram Bot
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Twitter/X Alert Bot
                </CardTitle>
                <CardDescription>Share domain opportunities with custom filters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Followers Reached</span>
                  <span className="font-mono">2,847</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Engagement Rate</span>
                  <span className="font-mono">{botMetrics?.communityEngagement || 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">User Acquisition</span>
                  <span className="font-mono text-accent">{botMetrics?.userAcquisition || 0}</span>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Configure Twitter Bot
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Rule-Based Domain Monitor
              </CardTitle>
              <CardDescription>Set up custom business logic for automated transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Domain Filter</Label>
                  <Input placeholder="e.g., *.crypto, web3-*" />
                </div>
                <div className="space-y-2">
                  <Label>Price Threshold</Label>
                  <Input placeholder="e.g., < $10,000" />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Window</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">7 days</SelectItem>
                      <SelectItem value="30d">30 days</SelectItem>
                      <SelectItem value="90d">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Auto-Action</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alert">Send Alert Only</SelectItem>
                      <SelectItem value="bid">Auto-Bid</SelectItem>
                      <SelectItem value="renew">Auto-Renew</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Custom Logic</Label>
                <Textarea
                  placeholder="Define custom business rules for automated transactions..."
                  className="min-h-[100px]"
                />
              </div>
              <Button className="w-full">Create Monitoring Rule</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className={subscriptionTier === "free" ? "border-2 border-accent" : ""}>
              <CardHeader>
                <CardTitle>Free Tier</CardTitle>
                <CardDescription>Basic domain monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold">
                  $0<span className="text-sm font-normal">/month</span>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>• Monitor up to 10 domains</li>
                  <li>• Basic expiry alerts</li>
                  <li>• Email notifications</li>
                  <li>• Community support</li>
                </ul>
                <Button
                  variant={subscriptionTier === "free" ? "default" : "outline"}
                  className="w-full"
                  disabled={subscriptionTier === "free"}
                >
                  {subscriptionTier === "free" ? "Current Plan" : "Downgrade"}
                </Button>
              </CardContent>
            </Card>

            <Card className={subscriptionTier === "pro" ? "border-2 border-accent" : ""}>
              <CardHeader>
                <CardTitle>Pro Tier</CardTitle>
                <CardDescription>Advanced automation & analytics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold">
                  $29<span className="text-sm font-normal">/month</span>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>• Unlimited domain monitoring</li>
                  <li>• Telegram & Twitter bots</li>
                  <li>• Custom rule-based alerts</li>
                  <li>• Auto-transaction features</li>
                  <li>• Priority support</li>
                </ul>
                <Button
                  variant={subscriptionTier === "pro" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setSubscriptionTier("pro")}
                >
                  {subscriptionTier === "pro" ? "Current Plan" : "Upgrade to Pro"}
                </Button>
              </CardContent>
            </Card>

            <Card className={subscriptionTier === "enterprise" ? "border-2 border-accent" : ""}>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>White-label & API access</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold">
                  $199<span className="text-sm font-normal">/month</span>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>• Everything in Pro</li>
                  <li>• White-label bot deployment</li>
                  <li>• API access & webhooks</li>
                  <li>• Custom integrations</li>
                  <li>• Dedicated support</li>
                </ul>
                <Button
                  variant={subscriptionTier === "enterprise" ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setSubscriptionTier("enterprise")}
                >
                  {subscriptionTier === "enterprise" ? "Current Plan" : "Contact Sales"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Subscription Analytics
              </CardTitle>
              <CardDescription>Track user acquisition and revenue metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{botMetrics?.activeSubscribers || 0}</div>
                  <div className="text-sm text-muted-foreground">Active Subscribers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">${botMetrics?.revenueGenerated || 0}</div>
                  <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{botMetrics?.userAcquisition || 0}</div>
                  <div className="text-sm text-muted-foreground">New Users (24h)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{botMetrics?.domaTransactions || 0}</div>
                  <div className="text-sm text-muted-foreground">Doma Transactions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how you receive alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="email-alerts">Email Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                  </div>
                </div>
                <Switch id="email-alerts" checked={emailAlerts} onCheckedChange={setEmailAlerts} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="discord-alerts">Discord Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send alerts to Discord channel</p>
                  </div>
                </div>
                <Switch id="discord-alerts" checked={discordAlerts} onCheckedChange={setDiscordAlerts} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="telegram-alerts">Telegram Bot</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts via Telegram</p>
                  </div>
                </div>
                <Switch id="telegram-alerts" checked={telegramAlerts} onCheckedChange={setTelegramAlerts} />
              </div>

              {emailAlerts && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
              )}

              <Button className="w-full">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
