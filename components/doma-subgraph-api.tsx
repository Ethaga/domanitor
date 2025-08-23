"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Database } from "lucide-react"

export function DomaSubgraphApi() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const queries = [
    {
      name: "names",
      description: "Get paginated list of tokenized names with filters",
      example: `query GetNames($skip: Int, $take: Int, $ownedBy: [AddressCAIP10!]) {
  names(skip: $skip, take: $take, ownedBy: $ownedBy) {
    items {
      name
      expiresAt
      tokenizedAt
      registrar {
        name
        ianaId
      }
      tokens {
        tokenId
        ownerAddress
        networkId
      }
    }
    totalCount
    hasNextPage
  }
}`,
    },
    {
      name: "tokens",
      description: "Get paginated list of tokens for a specific domain",
      example: `query GetTokens($name: String!, $skip: Int, $take: Int) {
  tokens(name: $name, skip: $skip, take: $take) {
    items {
      tokenId
      networkId
      ownerAddress
      type
      expiresAt
      chain {
        name
        networkId
      }
    }
    totalCount
  }
}`,
    },
    {
      name: "listings",
      description: "Get marketplace listings for tokenized domains",
      example: `query GetListings($skip: Float, $take: Float, $tlds: [String!]) {
  listings(skip: $skip, take: $take, tlds: $tlds) {
    items {
      id
      price
      currency {
        symbol
        decimals
      }
      name
      expiresAt
      orderbook
    }
    totalCount
  }
}`,
    },
  ]

  const mutations = [
    {
      name: "generateMetadata",
      description: "Generate metadata for synthetic tokens",
      example: `mutation GenerateMetadata($tokens: [TokenMetadataGenerationRequestInput!]!) {
  generateMetadata(tokens: $tokens)
}`,
    },
    {
      name: "uploadRegistrantContacts",
      description: "Upload registrant contact information for domain claiming",
      example: `mutation UploadContacts($contact: RegistrantContactInput!, $emailVerificationProof: String!, $networkId: String!, $registrarIanaId: Int!) {
  uploadRegistrantContacts(
    contact: $contact
    emailVerificationProof: $emailVerificationProof
    networkId: $networkId
    registrarIanaId: $registrarIanaId
  ) {
    proofOfContactsVoucher {
      registrantHandle
      nonce
      expiresAt
    }
    signature
  }
}`,
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-500" />
            <CardTitle>Doma Multi-Chain Subgraph API</CardTitle>
          </div>
          <CardDescription>
            GraphQL API for consolidated data about tokenized domains across multiple chains
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <h4 className="font-semibold">Testnet Endpoint</h4>
              <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded text-sm flex-1">https://api-testnet.doma.xyz/graphql</code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard("https://api-testnet.doma.xyz/graphql", "testnet-endpoint")}
                >
                  {copiedCode === "testnet-endpoint" ? "Copied!" : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Mainnet Endpoint</h4>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
          </div>

          <Tabs defaultValue="queries" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="queries">Queries</TabsTrigger>
              <TabsTrigger value="mutations">Mutations</TabsTrigger>
            </TabsList>

            <TabsContent value="queries" className="space-y-4">
              {queries.map((query, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{query.name}</CardTitle>
                    <CardDescription>{query.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{query.example}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 bg-transparent"
                        onClick={() => copyToClipboard(query.example, `query-${index}`)}
                      >
                        {copiedCode === `query-${index}` ? "Copied!" : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="mutations" className="space-y-4">
              {mutations.map((mutation, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{mutation.name}</CardTitle>
                    <CardDescription>{mutation.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{mutation.example}</code>
                      </pre>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 bg-transparent"
                        onClick={() => copyToClipboard(mutation.example, `mutation-${index}`)}
                      >
                        {copiedCode === `mutation-${index}` ? "Copied!" : <Copy className="h-4 w-4" />}
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
