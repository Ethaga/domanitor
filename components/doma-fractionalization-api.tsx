"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, PieChart, DollarSign, ArrowRightLeft } from "lucide-react"

export function DomaFractionalizationApi() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const functions = [
    {
      name: "fractionalizeOwnershipToken",
      description: "Fractionalize domain NFT into fungible tokens",
      icon: <PieChart className="h-5 w-5 text-blue-500" />,
      example: `// Fractionalize domain NFT
await domaFractionalization.fractionalizeOwnershipToken(
  tokenId,
  {
    name: "Fractionalized example.com",
    symbol: "FEXAMPLE"
  },
  minimumBuyoutPrice // in USDC
);`,
    },
    {
      name: "buyoutOwnershipToken",
      description: "Buy out a fractionalized domain NFT",
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
      example: `// Buy out domain NFT
await domaFractionalization.buyoutOwnershipToken(tokenId);

// Price is calculated as:
// Max(MinimumBuyoutPrice, FullyDilutedMarketCap)`,
    },
    {
      name: "exchangeFractionalToken",
      description: "Exchange fractional tokens for USDC after buyout",
      icon: <ArrowRightLeft className="h-5 w-5 text-purple-500" />,
      example: `// Exchange fractional tokens for USDC
await domaFractionalization.exchangeFractionalToken(
  fractionalTokenAddress,
  amount
);

// Price per token = BuyoutPrice / TotalSupply`,
    },
    {
      name: "getOwnershipTokenBuyoutPrice",
      description: "Get current buyout price for a domain NFT",
      icon: <DollarSign className="h-5 w-5 text-orange-500" />,
      example: `// Get buyout price
const buyoutPrice = await domaFractionalization
  .getOwnershipTokenBuyoutPrice(tokenId);

console.log(\`Buyout price: \${buyoutPrice} USDC\`);`,
    },
  ]

  const events = [
    {
      name: "NameTokenFractionalized",
      description: "Emitted when a domain NFT is fractionalized",
      example: `event NameTokenFractionalized(
  address indexed tokenAddress,
  uint256 indexed tokenId,
  address fractionalTokenAddress,
  FractionalTokenInfo fractionalTokenInfo,
  uint256 minimumBuyoutPrice,
  uint256 tokenizationVersion
);`,
    },
    {
      name: "NameTokenBoughtOut",
      description: "Emitted when a domain NFT is bought out",
      example: `event NameTokenBoughtOut(
  address indexed tokenAddress,
  uint256 indexed tokenId,
  address fractionalTokenAddress,
  uint256 buyoutPrice,
  address indexed newOwner,
  uint256 tokenizationVersion
);`,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-blue-500" />
            <CardTitle>Doma Fractionalization API</CardTitle>
          </div>
          <CardDescription>
            Convert domain NFTs into fungible tokens for enhanced liquidity and partial ownership
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h4 className="font-semibold mb-3">Key Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <PieChart className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Fractionalize NFTs</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Buyout Protection</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                <ArrowRightLeft className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium">Token Exchange</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Smart Contract Functions</h4>
            {functions.map((func, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {func.icon}
                    <CardTitle className="text-lg">{func.name}</CardTitle>
                  </div>
                  <CardDescription>{func.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{func.example}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 bg-transparent"
                      onClick={() => copyToClipboard(func.example, `function-${index}`)}
                    >
                      {copiedCode === `function-${index}` ? "Copied!" : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-4 mt-8">
            <h4 className="font-semibold">Events</h4>
            {events.map((event, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{event.name}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{event.example}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 bg-transparent"
                      onClick={() => copyToClipboard(event.example, `event-${index}`)}
                    >
                      {copiedCode === `event-${index}` ? "Copied!" : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
