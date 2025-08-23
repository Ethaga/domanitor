"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, ShoppingCart } from "lucide-react"

export function DomaOrderbookApi() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const listingEndpoints = [
    {
      method: "POST",
      path: "/v1/orderbook/list",
      description: "Create a fixed price listing",
      example: `curl -X POST "https://api-testnet.doma.xyz/v1/orderbook/list" \\
  -H "Api-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "orderbook": "OPENSEA",
    "chainId": "eip155:1",
    "parameters": {
      "offerer": "0x1234...",
      "startTime": "1714931840",
      "endTime": "1717523840"
    },
    "signature": "0x1234..."
  }'`,
    },
    {
      method: "GET",
      path: "/v1/orderbook/listing/{orderId}/{buyer}",
      description: "Get listing fulfillment data",
      example: `curl -X GET "https://api-testnet.doma.xyz/v1/orderbook/listing/3434-3675-5844-7264/0x1234..." \\
  -H "Api-Key: YOUR_API_KEY"`,
    },
    {
      method: "POST",
      path: "/v1/orderbook/listing/cancel",
      description: "Cancel a listing",
      example: `curl -X POST "https://api-testnet.doma.xyz/v1/orderbook/listing/cancel" \\
  -H "Api-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "orderId": "3434-3675-5844-7264",
    "signature": "0x1234..."
  }'`,
    },
  ]

  const offerEndpoints = [
    {
      method: "POST",
      path: "/v1/orderbook/offer",
      description: "Create an offer",
      example: `curl -X POST "https://api-testnet.doma.xyz/v1/orderbook/offer" \\
  -H "Api-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "orderbook": "DOMA",
    "chainId": "eip155:97476",
    "parameters": {
      "offerer": "0x1234...",
      "startTime": "1714931840",
      "endTime": "1717523840"
    },
    "signature": "0x1234..."
  }'`,
    },
    {
      method: "GET",
      path: "/v1/orderbook/offer/{orderId}/{fulfiller}",
      description: "Get offer fulfillment data",
      example: `curl -X GET "https://api-testnet.doma.xyz/v1/orderbook/offer/3434-3675-5844-7264/0x1234..." \\
  -H "Api-Key: YOUR_API_KEY"`,
    },
    {
      method: "POST",
      path: "/v1/orderbook/offer/cancel",
      description: "Cancel an offer",
      example: `curl -X POST "https://api-testnet.doma.xyz/v1/orderbook/offer/cancel" \\
  -H "Api-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "orderId": "3434-3675-5844-7264",
    "signature": "0x1234..."
  }'`,
    },
  ]

  const utilityEndpoints = [
    {
      method: "GET",
      path: "/v1/orderbook/fee/{orderbook}/{chainId}/{contractAddress}",
      description: "Get marketplace fees",
      example: `curl -X GET "https://api-testnet.doma.xyz/v1/orderbook/fee/OPENSEA/eip155:1/0x1234..." \\
  -H "Api-Key: YOUR_API_KEY"`,
    },
    {
      method: "GET",
      path: "/v1/orderbook/currencies/{chainId}/{contractAddress}/{orderbook}",
      description: "Get supported currencies",
      example: `curl -X GET "https://api-testnet.doma.xyz/v1/orderbook/currencies/eip155:1/0x1234.../OpenSea" \\
  -H "Api-Key: YOUR_API_KEY"`,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-purple-500" />
            <CardTitle>Doma Orderbook API</CardTitle>
          </div>
          <CardDescription>
            Create and manage listings and offers on supported orderbooks (OpenSea, Doma)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Supported Orderbooks</h4>
              <div className="flex gap-2">
                <Badge>OPENSEA</Badge>
                <Badge>DOMA</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Required Permissions</h4>
              <Badge variant="outline">ORDERBOOK</Badge>
            </div>
          </div>

          <Tabs defaultValue="listings" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="listings">Listings</TabsTrigger>
              <TabsTrigger value="offers">Offers</TabsTrigger>
              <TabsTrigger value="utility">Utility</TabsTrigger>
            </TabsList>

            <TabsContent value="listings" className="space-y-4">
              {listingEndpoints.map((endpoint, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          endpoint.method === "GET"
                            ? "default"
                            : endpoint.method === "POST"
                              ? "secondary"
                              : "destructive"
                        }
                      >
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
                        onClick={() => copyToClipboard(endpoint.example, `listing-${index}`)}
                      >
                        {copiedCode === `listing-${index}` ? "Copied!" : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="offers" className="space-y-4">
              {offerEndpoints.map((endpoint, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          endpoint.method === "GET"
                            ? "default"
                            : endpoint.method === "POST"
                              ? "secondary"
                              : "destructive"
                        }
                      >
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
                        onClick={() => copyToClipboard(endpoint.example, `offer-${index}`)}
                      >
                        {copiedCode === `offer-${index}` ? "Copied!" : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="utility" className="space-y-4">
              {utilityEndpoints.map((endpoint, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Badge>GET</Badge>
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
                        onClick={() => copyToClipboard(endpoint.example, `utility-${index}`)}
                      >
                        {copiedCode === `utility-${index}` ? "Copied!" : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
