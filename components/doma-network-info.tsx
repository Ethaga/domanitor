"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Globe, ExternalLink } from "lucide-react"
import { useState } from "react"

export function DomaNetworkInfo() {
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(id)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const testnetInfo = {
    chainId: "97476",
    currency: "ETH",
    rpcUrl: "https://rpc-testnet.doma.xyz/",
    explorerUrl: "https://explorer-testnet.doma.xyz",
    bridgeUrl: "https://bridge-testnet.doma.xyz",
    apiUrl: "https://api-testnet.doma.xyz",
    subgraphUrl: "https://api-testnet.doma.xyz/graphql",
  }

  const supportedTlds = [
    ".com",
    ".net",
    ".org",
    ".info",
    ".biz",
    ".app",
    ".dev",
    ".xyz",
    ".io",
    ".ai",
    ".co",
    ".me",
    ".tv",
    ".cc",
    ".ly",
    ".gg",
    ".sh",
    ".it",
    ".de",
    ".ca",
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            <CardTitle>Doma Network Information</CardTitle>
          </div>
          <CardDescription>Network configuration and endpoints for Doma Protocol integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Testnet Configuration</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Chain ID</p>
                    <p className="text-sm text-muted-foreground">{testnetInfo.chainId}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(testnetInfo.chainId, "chainId")}>
                    {copiedText === "chainId" ? "Copied!" : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Currency</p>
                    <p className="text-sm text-muted-foreground">{testnetInfo.currency}</p>
                  </div>
                  <Badge>{testnetInfo.currency}</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">RPC URL</p>
                    <p className="text-sm text-muted-foreground font-mono">{testnetInfo.rpcUrl}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(testnetInfo.rpcUrl, "rpcUrl")}>
                    {copiedText === "rpcUrl" ? "Copied!" : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Service Endpoints</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Explorer</p>
                    <p className="text-sm text-muted-foreground">Block explorer</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={testnetInfo.explorerUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Bridge</p>
                    <p className="text-sm text-muted-foreground">Cross-chain bridge</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={testnetInfo.bridgeUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">API Endpoint</p>
                    <p className="text-sm text-muted-foreground">REST API</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(testnetInfo.apiUrl, "apiUrl")}>
                    {copiedText === "apiUrl" ? "Copied!" : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="font-semibold mb-4">Supported TLDs</h4>
            <div className="grid grid-cols-4 md:grid-cols-10 gap-2">
              {supportedTlds.map((tld, index) => (
                <Badge key={index} variant="outline" className="justify-center">
                  {tld}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">And 500+ more gTLDs and ccTLDs supported</p>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h5 className="font-semibold text-yellow-800 mb-2">Mainnet Status</h5>
            <p className="text-sm text-yellow-700">
              Mainnet deployment is coming soon. All current operations are on testnet for development and testing
              purposes.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
