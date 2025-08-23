"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Activity, RefreshCw } from "lucide-react"

export function DomaPollApi() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const endpoints = [
    {
      method: "GET",
      path: "/v1/poll",
      description: "Poll for new Doma Protocol events",
      example: `curl -X GET "https://api-testnet.doma.xyz/v1/poll?limit=10&eventTypes=NAME_TOKEN_MINTED" \\
  -H "Api-Key: YOUR_API_KEY"`,
    },
    {
      method: "POST",
      path: "/v1/poll/ack/{lastEventId}",
      description: "Acknowledge received events",
      example: `curl -X POST "https://api-testnet.doma.xyz/v1/poll/ack/42" \\
  -H "Api-Key: YOUR_API_KEY"`,
    },
    {
      method: "POST",
      path: "/v1/poll/reset/{eventId}",
      description: "Reset polling cursor to reprocess events",
      example: `curl -X POST "https://api-testnet.doma.xyz/v1/poll/reset/0" \\
  -H "Api-Key: YOUR_API_KEY"`,
    },
  ]

  const eventTypes = [
    "NAME_TOKEN_MINTED",
    "NAME_TOKEN_TRANSFERRED",
    "NAME_TOKEN_LISTED",
    "NAME_TOKEN_PURCHASED",
    "NAME_TOKENIZED",
    "NAME_CLAIMED",
    "NAME_RENEWED",
    "NAME_DETOKENIZED",
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            <CardTitle>Doma Poll API</CardTitle>
          </div>
          <CardDescription>Stream of Doma Protocol events using Poll → Acknowledge system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Integration Flow</h4>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                  1
                </div>
                <span>Poll for events</span>
              </div>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                  2
                </div>
                <span>Process events</span>
              </div>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                  3
                </div>
                <span>Acknowledge</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant={endpoint.method === "GET" ? "default" : "secondary"}>{endpoint.method}</Badge>
                    <CardTitle className="text-lg">{endpoint.path}</CardTitle>
                  </div>
                  <CardDescription>{endpoint.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{endpoint.example}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 bg-transparent"
                      onClick={() => copyToClipboard(endpoint.example, `endpoint-${index}`)}
                    >
                      {copiedCode === `endpoint-${index}` ? "Copied!" : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Supported Event Types</CardTitle>
              <CardDescription>Filter events by these types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {eventTypes.map((type, index) => (
                  <Badge key={index} variant="outline" className="justify-center">
                    {type}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
