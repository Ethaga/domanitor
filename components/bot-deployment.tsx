"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DomaAPI, type BotConfiguration } from "@/lib/doma-api"
import { Bot, MessageSquare, Twitter, Webhook, Zap, ExternalLink, CheckCircle } from "lucide-react"

interface BotDeploymentProps {
  walletAddress: string
  isConnected: boolean
}

export function BotDeployment({ walletAddress, isConnected }: BotDeploymentProps) {
  const [selectedBotType, setSelectedBotType] = useState<"telegram" | "twitter" | "discord" | "webhook">("telegram")
  const [botName, setBotName] = useState("")
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployedBots, setDeployedBots] = useState<BotConfiguration[]>([])
  const [deploymentResult, setDeploymentResult] = useState<any>(null)

  const handleDeployBot = async () => {
    if (!isConnected || !botName) return

    setIsDeploying(true)
    setDeploymentResult(null)

    try {
      // Create bot configuration
      const botConfig: Omit<BotConfiguration, "id" | "metrics"> = {
        name: botName,
        type: selectedBotType,
        isActive: true,
        filters: [
          {
            pattern: "*.crypto,*.eth,*.xyz",
            priceRange: { min: 100, max: 50000 },
            expiryWindow: 30,
          },
        ],
        actions: [
          {
            trigger: "expiry",
            action: "alert",
            parameters: { includeRenewalLink: true },
          },
        ],
        subscriptionTier: "pro",
      }

      // Create bot via Doma API
      const bot = await DomaAPI.createBot(botConfig)

      // Deploy to specific platform
      let result
      if (selectedBotType === "telegram") {
        result = await DomaAPI.deployTelegramBot(bot)
      } else if (selectedBotType === "twitter") {
        result = await DomaAPI.deployTwitterBot(bot)
      }

      setDeploymentResult(result)
      setDeployedBots((prev) => [...prev, bot])
      setBotName("")
    } catch (error) {
      console.error("[v0] Bot deployment failed:", error)
      setDeploymentResult({ success: false, error: "Deployment failed" })
    } finally {
      setIsDeploying(false)
    }
  }

  const getBotIcon = (type: string) => {
    switch (type) {
      case "telegram":
        return <MessageSquare className="h-5 w-5" />
      case "twitter":
        return <Twitter className="h-5 w-5" />
      case "discord":
        return <Bot className="h-5 w-5" />
      case "webhook":
        return <Webhook className="h-5 w-5" />
      default:
        return <Bot className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Deploy Alert Bot
          </CardTitle>
          <CardDescription>Create automated bots for domain alerts using Doma Protocol integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Bot Name</Label>
                <Input
                  placeholder="e.g., DomainExpiry Bot"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={selectedBotType} onValueChange={(value: any) => setSelectedBotType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="telegram">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Telegram Bot
                      </div>
                    </SelectItem>
                    <SelectItem value="twitter">
                      <div className="flex items-center gap-2">
                        <Twitter className="h-4 w-4" />
                        Twitter/X Bot
                      </div>
                    </SelectItem>
                    <SelectItem value="discord">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        Discord Bot
                      </div>
                    </SelectItem>
                    <SelectItem value="webhook">
                      <div className="flex items-center gap-2">
                        <Webhook className="h-4 w-4" />
                        Webhook
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleDeployBot} disabled={!isConnected || !botName || isDeploying} className="w-full">
                {isDeploying ? "Deploying..." : "Deploy Bot"}
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Bot Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Real-time domain expiry alerts</li>
                <li>• Market opportunity notifications</li>
                <li>• Direct buy links to Doma Protocol</li>
                <li>• Custom filter configurations</li>
                <li>• Automated transaction triggers</li>
                <li>• Community engagement tracking</li>
              </ul>
            </div>
          </div>

          {deploymentResult && (
            <div
              className={`p-4 rounded-lg border ${deploymentResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
            >
              <div className="flex items-center gap-2">
                {deploymentResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Bot className="h-5 w-5 text-red-600" />
                )}
                <span className="font-semibold">
                  {deploymentResult.success ? "Bot Deployed Successfully!" : "Deployment Failed"}
                </span>
              </div>
              {deploymentResult.success && (
                <div className="mt-2 space-y-1 text-sm">
                  {deploymentResult.botToken && (
                    <p>
                      Bot Token: <code className="bg-gray-100 px-1 rounded">{deploymentResult.botToken}</code>
                    </p>
                  )}
                  {deploymentResult.accountHandle && (
                    <p>
                      Account: <code className="bg-gray-100 px-1 rounded">{deploymentResult.accountHandle}</code>
                    </p>
                  )}
                  {deploymentResult.webhookUrl && (
                    <p>
                      Webhook: <code className="bg-gray-100 px-1 rounded">{deploymentResult.webhookUrl}</code>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {deployedBots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Deployed Bots</CardTitle>
            <CardDescription>Manage your active domain alert bots</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deployedBots.map((bot) => (
                <div key={bot.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getBotIcon(bot.type)}
                    <div>
                      <div className="font-medium">{bot.name}</div>
                      <div className="text-sm text-muted-foreground capitalize">{bot.type} Bot</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <a href="https://start.doma.xyz" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
