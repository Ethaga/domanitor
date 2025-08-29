"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Activity, RefreshCw, Zap, Clock, ExternalLink } from "lucide-react"

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
      description: "Poll for new Doma Protocol events with optional filtering",
      example: `curl -X GET "https://api-testnet.doma.xyz/v1/poll?limit=10&eventTypes=NAME_TOKEN_MINTED,NAME_TOKEN_TRANSFERRED" \\
  -H "Api-Key: YOUR_API_KEY"

Response:
{
  "events": [
    {
      "id": 42,
      "type": "NAME_TOKEN_MINTED",
      "data": {
        "tokenId": "123",
        "to": "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e",
        "sld": "example",
        "tld": "com",
        "registrarIanaId": 1,
        "expiresAt": "1735689600",
        "correlationId": "mint_123_456"
      },
      "timestamp": "2024-01-15T10:30:00Z",
      "chainId": "eip155:97476",
      "blockNumber": 12345,
      "transactionHash": "0xabc123..."
    }
  ],
  "hasMore": true,
  "nextCursor": 43
}`,
    },
    {
      method: "POST",
      path: "/v1/poll/ack/{lastEventId}",
      description: "Acknowledge received events up to the specified event ID",
      example: `curl -X POST "https://api-testnet.doma.xyz/v1/poll/ack/42" \\
  -H "Api-Key: YOUR_API_KEY"

Response:
{
  "acknowledged": true,
  "lastEventId": 42,
  "timestamp": "2024-01-15T10:35:00Z"
}`,
    },
    {
      method: "POST",
      path: "/v1/poll/reset/{eventId}",
      description: "Reset polling cursor to reprocess events from the specified ID",
      example: `curl -X POST "https://api-testnet.doma.xyz/v1/poll/reset/0" \\
  -H "Api-Key: YOUR_API_KEY"

Response:
{
  "reset": true,
  "newCursor": 0,
  "timestamp": "2024-01-15T10:40:00Z",
  "message": "Polling cursor reset successfully"
}`,
    },
  ]

  const eventTypes = [
    {
      name: "NAME_TOKEN_MINTED",
      description: "Emitted when a new domain ownership token is minted",
      fields: ["tokenId", "to", "sld", "tld", "registrarIanaId", "expiresAt", "correlationId"]
    },
    {
      name: "NAME_TOKEN_TRANSFERRED", 
      description: "Emitted when domain ownership is transferred",
      fields: ["tokenId", "from", "to", "correlationId"]
    },
    {
      name: "NAME_TOKEN_LISTED",
      description: "Emitted when a domain is listed for sale",
      fields: ["tokenId", "seller", "price", "currency", "marketplace", "correlationId"]
    },
    {
      name: "NAME_TOKEN_PURCHASED",
      description: "Emitted when a domain is purchased",
      fields: ["tokenId", "buyer", "seller", "price", "currency", "marketplace", "correlationId"]
    },
    {
      name: "NAME_TOKENIZED",
      description: "Emitted when a domain is successfully tokenized",
      fields: ["domain", "tokenId", "owner", "registrarIanaId", "correlationId"]
    },
    {
      name: "NAME_CLAIMED",
      description: "Emitted when domain ownership is claimed",
      fields: ["tokenId", "claimer", "proofHash", "correlationId"]
    },
    {
      name: "NAME_RENEWED",
      description: "Emitted when a domain is renewed",
      fields: ["tokenId", "newExpirationDate", "renewedBy", "correlationId"]
    },
    {
      name: "NAME_DETOKENIZED",
      description: "Emitted when a domain is detokenized",
      fields: ["tokenId", "domain", "finalOwner", "correlationId"]
    },
    {
      name: "NAME_BRIDGED",
      description: "Emitted when a domain is bridged to another chain",
      fields: ["tokenId", "fromChain", "toChain", "targetAddress", "correlationId"]
    },
    {
      name: "FRACTIONALIZATION_CREATED",
      description: "Emitted when a domain is fractionalized",
      fields: ["tokenId", "fractionalTokenAddress", "totalShares", "correlationId"]
    }
  ]

  const queryParameters = [
    {
      name: "limit",
      type: "integer",
      description: "Maximum number of events to return (1-1000, default: 100)",
      example: "?limit=50"
    },
    {
      name: "eventTypes",
      type: "string[]",
      description: "Comma-separated list of event types to filter",
      example: "?eventTypes=NAME_TOKEN_MINTED,NAME_TOKEN_TRANSFERRED"
    },
    {
      name: "chainId",
      type: "string",
      description: "Filter events by specific chain ID (CAIP-2 format)",
      example: "?chainId=eip155:97476"
    },
    {
      name: "since",
      type: "integer",
      description: "Return events after this event ID",
      example: "?since=100"
    },
    {
      name: "address",
      type: "string",
      description: "Filter events related to specific wallet address",
      example: "?address=0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e"
    }
  ]

  const integrationExample = `// Example: Real-time domain monitoring bot
class DomaEventMonitor {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.lastEventId = 0;
    this.baseUrl = 'https://api-testnet.doma.xyz';
  }

  async startMonitoring() {
    while (true) {
      try {
        // Poll for new events
        const response = await fetch(
          \`\${this.baseUrl}/v1/poll?since=\${this.lastEventId}&limit=100\`,
          {
            headers: { 'Api-Key': this.apiKey }
          }
        );
        
        const data = await response.json();
        
        if (data.events && data.events.length > 0) {
          // Process events
          for (const event of data.events) {
            await this.processEvent(event);
            this.lastEventId = Math.max(this.lastEventId, event.id);
          }
          
          // Acknowledge processed events
          await fetch(
            \`\${this.baseUrl}/v1/poll/ack/\${this.lastEventId}\`,
            {
              method: 'POST',
              headers: { 'Api-Key': this.apiKey }
            }
          );
        }
        
        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, 5000));
        
      } catch (error) {
        console.error('Polling error:', error);
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
  }

  async processEvent(event) {
    switch (event.type) {
      case 'NAME_TOKEN_MINTED':
        console.log(\`New domain tokenized: \${event.data.sld}.\${event.data.tld}\`);
        break;
      case 'NAME_TOKEN_TRANSFERRED':
        console.log(\`Domain transferred: Token #\${event.data.tokenId}\`);
        break;
      // Handle other event types...
    }
  }
}

// Usage
const monitor = new DomaEventMonitor('your-api-key');
monitor.startMonitoring();`

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            <CardTitle>Doma Poll API</CardTitle>
          </div>
          <CardDescription>
            Real-time event streaming from Doma Protocol using Poll → Acknowledge pattern
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Integration Flow</h4>
            <div className="flex items-center gap-4 text-sm flex-wrap">
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

          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Base URL</h4>
              <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded text-sm flex-1">https://api-testnet.doma.xyz</code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard("https://api-testnet.doma.xyz", "poll-base-url")}
                >
                  {copiedCode === "poll-base-url" ? "Copied!" : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Rate Limits</h4>
              <Badge variant="outline">1000 requests/hour</Badge>
            </div>
          </div>

          <Tabs defaultValue="endpoints" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="events">Event Types</TabsTrigger>
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
            </TabsList>

            <TabsContent value="endpoints" className="space-y-4">
              {endpoints.map((endpoint, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Badge variant={endpoint.method === "GET" ? "default" : "secondary"}>
                        {endpoint.method}
                      </Badge>
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
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <div className="grid gap-4">
                {eventTypes.map((eventType, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Zap className="h-4 w-4 text-orange-500" />
                        {eventType.name}
                      </CardTitle>
                      <CardDescription>{eventType.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium mb-2">Event Fields:</h5>
                          <div className="flex flex-wrap gap-1">
                            {eventType.fields.map((field) => (
                              <Badge key={field} variant="outline" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="parameters" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Query Parameters</CardTitle>
                  <CardDescription>Available parameters for the /v1/poll endpoint</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {queryParameters.map((param, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{param.type}</Badge>
                          <code className="font-semibold">{param.name}</code>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{param.description}</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{param.example}</code>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integration" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-purple-500" />
                    Integration Example
                  </CardTitle>
                  <CardDescription>
                    Complete example of building a real-time domain monitoring bot
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{integrationExample}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 bg-transparent"
                        onClick={() => copyToClipboard(integrationExample, "integration-example")}
                      >
                        {copiedCode === "integration-example" ? "Copied!" : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <h5 className="font-semibold">Best Practices</h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Always acknowledge processed events</li>
                          <li>• Implement exponential backoff for errors</li>
                          <li>• Store last event ID persistently</li>
                          <li>• Handle duplicate events gracefully</li>
                          <li>• Use appropriate polling intervals (5-30s)</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-semibold">Error Handling</h5>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• 429: Rate limit exceeded - backoff</li>
                          <li>• 401: Invalid API key</li>
                          <li>• 500: Server error - retry with delay</li>
                          <li>• Network errors - exponential backoff</li>
                          <li>• Use /v1/poll/reset for recovery</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Webhook Alternative</CardTitle>
                  <CardDescription>
                    For production applications, consider using webhooks for better performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <h5 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Webhook vs Polling
                      </h5>
                      <div className="grid gap-3 md:grid-cols-2 text-sm">
                        <div>
                          <strong className="text-blue-800 dark:text-blue-200">Polling (Current)</strong>
                          <ul className="text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                            <li>• Client pulls events</li>
                            <li>• Simple to implement</li>
                            <li>• Works behind firewalls</li>
                            <li>• Higher latency</li>
                          </ul>
                        </div>
                        <div>
                          <strong className="text-blue-800 dark:text-blue-200">Webhooks (Coming Soon)</strong>
                          <ul className="text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                            <li>• Server pushes events</li>
                            <li>• Real-time delivery</li>
                            <li>• Lower resource usage</li>
                            <li>• Requires public endpoint</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full" disabled>
                      <Clock className="h-4 w-4 mr-2" />
                      Webhook Support Coming Q2 2025
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Documentation Links */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <a href="https://docs.doma.xyz/api-reference/poll-api" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Official Poll API Docs
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://docs.doma.xyz/guides/event-monitoring" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Event Monitoring Guide
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://start.doma.xyz" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Test on Doma Portal
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}