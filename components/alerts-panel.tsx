"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Bot, Mail, MessageSquare, Calendar, DollarSign, TrendingUp } from "lucide-react"

export function AlertsPanel() {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [discordAlerts, setDiscordAlerts] = useState(false)
  const [telegramAlerts, setTelegramAlerts] = useState(true)

  const alerts = [
    {
      id: 1,
      type: "expiry",
      domain: "crypto-defi.com",
      message: "Domain expires in 30 days",
      priority: "high",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "sale",
      domain: "web3-domains.xyz",
      message: "Similar domain sold for $45K",
      priority: "medium",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "price",
      domain: "nft-marketplace.io",
      message: "Domain value increased by 15%",
      priority: "low",
      time: "1 day ago",
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
      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="bots">Alert Bots</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Alerts
              </CardTitle>
              <CardDescription>Real-time notifications for your domain portfolio</CardDescription>
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
                    <Button variant="ghost" size="sm">
                      Dismiss
                    </Button>
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
                  Expiry Bot
                </CardTitle>
                <CardDescription>Automated alerts for domain expirations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Domains Monitored</span>
                  <span className="font-mono">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Alerts Sent (24h)</span>
                  <span className="font-mono">23</span>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Configure Bot
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Market Bot
                </CardTitle>
                <CardDescription>Track domain sales and market trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Sales Tracked</span>
                  <span className="font-mono">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Opportunities Found</span>
                  <span className="font-mono">12</span>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Configure Bot
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create New Bot</CardTitle>
              <CardDescription>Set up custom automation for your domain portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-accent" />
                    <h4 className="font-semibold">Renewal Bot</h4>
                    <p className="text-xs text-muted-foreground">Auto-renew domains</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-accent" />
                    <h4 className="font-semibold">Price Alert Bot</h4>
                    <p className="text-xs text-muted-foreground">Monitor value changes</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-accent" />
                    <h4 className="font-semibold">Trend Bot</h4>
                    <p className="text-xs text-muted-foreground">Track market trends</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
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
