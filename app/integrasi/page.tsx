import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, Shield, Zap, Globe } from "lucide-react"
import { DomaApiReference } from "@/components/doma-api-reference"
import { DomaSubgraphApi } from "@/components/doma-subgraph-api"
import { DomaPollApi } from "@/components/doma-poll-api"
import { DomaOrderbookApi } from "@/components/doma-orderbook-api"
import { DomaFractionalizationApi } from "@/components/doma-fractionalization-api"

export default function IntegrationPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Doma Protocol Integration</h1>
        <p className="text-gray-600 text-lg">
          Deep integration with Doma Protocol for seamless domain tokenization and DeFi operations
        </p>
      </div>

      {/* Architecture Diagram */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Integration Architecture
          </CardTitle>
        </CardHeader>
        <CardContent>
          <img
            src="/doma-protocol-architecture.png"
            alt="Doma Protocol Integration Architecture"
            className="w-full rounded-lg border mb-4"
          />
          <p className="text-sm text-gray-600">
            Domanitor integrates directly with Doma Protocol's smart contracts for tokenization, fractionalization, and
            cross-chain domain management.
          </p>
        </CardContent>
      </Card>

      {/* Contract Addresses */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Smart Contracts</CardTitle>
            <CardDescription>Doma Protocol contract addresses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Tokenization Contract</p>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded">0x8a1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f</p>
            </div>
            <div>
              <p className="text-sm font-medium">Fractionalization Contract</p>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded">0xe9f8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0</p>
            </div>
            <div>
              <p className="text-sm font-medium">Registry Contract</p>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded">0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Integration Features</CardTitle>
            <CardDescription>Powered by Doma Protocol</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm">ICANN Compliance</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Real-time Synchronization</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Multi-chain Support</span>
            </div>
            <Badge variant="outline" className="mt-2">
              Testnet Ready
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* API Integration */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>API Integration</CardTitle>
          <CardDescription>Direct integration with Doma Protocol APIs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
            <div>// Doma Protocol SDK Integration</div>
            <div>import &#123; DomaSDK &#125; from '@doma/protocol-sdk';</div>
            <div className="mt-2">const doma = new DomaSDK(&#123;</div>
            <div>&nbsp;&nbsp;network: 'testnet',</div>
            <div>&nbsp;&nbsp;apiKey: process.env.DOMA_API_KEY</div>
            <div>&#125;);</div>
            <div className="mt-2">// Tokenize domain</div>
            <div>await doma.tokenize('example.com');</div>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <a href="https://docs.doma.xyz" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Documentation
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://start.doma.xyz" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Testnet Portal
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Complete API Reference</h2>
        <Tabs defaultValue="smart-contracts" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="smart-contracts">Smart Contracts</TabsTrigger>
            <TabsTrigger value="subgraph">Subgraph</TabsTrigger>
            <TabsTrigger value="poll">Poll API</TabsTrigger>
            <TabsTrigger value="orderbook">Orderbook</TabsTrigger>
            <TabsTrigger value="fractionalization">Fractionalization</TabsTrigger>
          </TabsList>

          <TabsContent value="smart-contracts" className="mt-6">
            <DomaApiReference />
          </TabsContent>

          <TabsContent value="subgraph" className="mt-6">
            <DomaSubgraphApi />
          </TabsContent>

          <TabsContent value="poll" className="mt-6">
            <DomaPollApi />
          </TabsContent>

          <TabsContent value="orderbook" className="mt-6">
            <DomaOrderbookApi />
          </TabsContent>

          <TabsContent value="fractionalization" className="mt-6">
            <DomaFractionalizationApi />
          </TabsContent>
        </Tabs>
      </div>

      {/* Testnet Information */}
      <Card>
        <CardHeader>
          <CardTitle>Testnet Integration</CardTitle>
          <CardDescription>Testing environment for Doma Protocol features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">100+</div>
              <div className="text-sm text-gray-600">Domains Tokenized</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">50+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">25+</div>
              <div className="text-sm text-gray-600">Transactions/Day</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
