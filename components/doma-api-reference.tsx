"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, ExternalLink, Code, Zap, Shield, Link, Database, Globe } from "lucide-react"

export function DomaApiReference() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const smartContractsEndpoints = [
    {
      method: "GET",
      path: "/v1/smart-contracts",
      description: "Get all deployed smart contracts",
      example: `curl -X GET "https://api-testnet.doma.xyz/v1/smart-contracts" \\
  -H "Api-Key: YOUR_API_KEY"

Response:
{
  "contracts": [
    {
      "name": "DomaRecord",
      "address": "0xF6A92E0f8bEa4174297B0219d9d47fEe335f84f8",
      "chainId": "eip155:97476",
      "abi": [...],
      "version": "1.0.0"
    },
    {
      "name": "OwnershipToken", 
      "address": "0x9A374915648f1352827fFbf0A7bB5752b6995eB7",
      "chainId": "eip155:97476",
      "abi": [...],
      "version": "1.0.0"
    }
  ]
}`,
    },
    {
      method: "GET",
      path: "/v1/smart-contracts/{address}",
      description: "Get specific smart contract details",
      example: `curl -X GET "https://api-testnet.doma.xyz/v1/smart-contracts/0x9A374915648f1352827fFbf0A7bB5752b6995eB7" \\
  -H "Api-Key: YOUR_API_KEY"

Response:
{
  "name": "OwnershipToken",
  "address": "0x9A374915648f1352827fFbf0A7bB5752b6995eB7",
  "chainId": "eip155:97476",
  "abi": [...],
  "version": "1.0.0",
  "deployedAt": "2024-01-15T10:30:00Z",
  "verified": true
}`,
    },
  ]

  const codeBlocks = {
    tokenization: `/** 
 * @notice Request tokenization of given names.
 * Relays message to Doma Record contract on Doma Chain, for Registrar to approve or reject.
 * @param voucher Tokenization voucher. Used to pre-clear tokenization, before final approval.
 * @param signature Signature of the voucher, signed by a Registrar.
 */
function requestTokenization(
  TokenizationVoucher calldata voucher,
  bytes calldata signature
) public payable;

struct TokenizationVoucher {
  IDomaRecord.NameInfo[] names;
  uint256 nonce;
  uint256 expiresAt;
  address ownerAddress;
}

struct NameInfo {
  string sld;        // Second-level domain (e.g., "example")
  string tld;        // Top-level domain (e.g., "com")
  uint256 registrarIanaId;
}`,

    claimOwnership: `/**
 * @notice Claim ownership of a given Domain, using Ownership token.
 * Relays message to Doma Record contract on Doma Chain.
 * @param tokenId Id of an Ownership Token.
 * @param isSynthetic Whether it's a regular or permissioned (synthetic) ownership token.
 * @param proofOfContactsVoucher Voucher that proves Registrant contact information has been verified.
 * @param signature Signature of the voucher, signed by an off-chain storage.
 */
function claimOwnership(
  uint256 tokenId,
  bool isSynthetic,
  ProofOfContactsVoucher calldata proofOfContactsVoucher,
  bytes calldata signature
) public payable;

struct ProofOfContactsVoucher {
  uint256 registrantHandle;
  uint256 nonce;
  uint256 expiresAt;
}`,

    bridge: `/**
 * @notice Move token to another chain.
 * Relays message to Doma Record contract on Doma Chain.
 * @param tokenId Id of an Ownership Token.
 * @param isSynthetic Whether it's a regular or permissioned (synthetic) ownership token.
 * @param targetChainId CAIP-2 Chain ID of the target chain.
 * @param targetOwnerAddress Wallet address on a target chain.
 */
function bridge(
  uint256 tokenId,
  bool isSynthetic,
  string calldata targetChainId,
  string calldata targetOwnerAddress
) public payable;

// Example usage:
// Bridge token #123 to Polygon
bridge(123, false, "eip155:137", "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e");`,

    detokenize: `/**
 * @dev Request detokenization of a Domain, using Ownership token.
 * Relays message to Doma Record contract on Doma Chain, for validation and further processing.
 * @param tokenId Id of an Ownership Token.
 * @param isSynthetic Whether it's a regular or permissioned (synthetic) ownership token.
 */
function requestDetokenization(uint256 tokenId, bool isSynthetic) public;

// Note: No fees required for detokenization
// Requires claimed ownership of the domain`,

    ownershipToken: `/**
 * @notice ERC-721 token with additional functionality for domain ownership
 */

// Get expiration date for a token
function expirationOf(uint256 id) external view returns (uint256);

// Get registrar IANA ID for a token  
function registrarOf(uint256 id) external view returns (uint256);

// Check if token transfers are locked
function lockStatusOf(uint256 id) external view returns (bool);

// Get domain name from token ID
function nameOf(uint256 id) external view returns (string memory);

// Check if token is synthetic (permissioned)
function isSynthetic(uint256 id) external view returns (bool);`,

    events: `/**
 * @notice Key events emitted by Doma Protocol contracts
 */

// Ownership Token Minted
event OwnershipTokenMinted(
  uint256 indexed tokenId,
  uint256 registrarIanaId,
  address to,
  string sld,
  string tld,
  uint256 expiresAt,
  string correlationId
);

// Ownership Claimed
event OwnershipClaimed(
  uint256 indexed tokenId,
  address indexed claimer,
  string correlationId
);

// Domain Bridged
event DomainBridged(
  uint256 indexed tokenId,
  string targetChainId,
  string targetOwnerAddress,
  string correlationId
);

// Detokenization Requested
event DetokenizationRequested(
  uint256 indexed tokenId,
  address indexed requester,
  string correlationId
);`,

    fees: `/**
 * @notice Protocol fees are denominated in USDC but paid in native gas coin
 * Fees are automatically converted at current exchange rates
 */

// Tokenization fees (per domain)
uint256 public constant TOKENIZATION_FEE = 10e6; // 10 USDC

// Claim ownership fees  
uint256 public constant CLAIM_FEE = 5e6; // 5 USDC

// Bridge fees (per transaction)
uint256 public constant BRIDGE_FEE = 2e6; // 2 USDC

// Detokenization is free (no fees)
uint256 public constant DETOKENIZATION_FEE = 0;

// Get current fee in native currency
function getCurrentFee(uint256 usdcAmount) external view returns (uint256);`,
  }

  return (
    <div className="space-y-8">
      {/* Protocol Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Doma Smart Contracts API
          </CardTitle>
          <CardDescription>
            Complete API reference for Doma Protocol smart contracts and REST endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  Core
                </Badge>
                <div>
                  <h4 className="font-semibold">Doma Record</h4>
                  <p className="text-sm text-muted-foreground">
                    Main contract that holds domain information and issues Name Tokens
                  </p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-1 block">
                    0xF6A92E0f8bEa4174297B0219d9d47fEe335f84f8
                  </code>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  Relay
                </Badge>
                <div>
                  <h4 className="font-semibold">Doma Forwarder</h4>
                  <p className="text-sm text-muted-foreground">EIP-2771 Trusted Forwarder for meta transactions</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-1 block">
                    0xf17beC16794e018E2F0453a1282c3DA3d121f410
                  </code>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  Cross-Chain
                </Badge>
                <div>
                  <h4 className="font-semibold">Doma Gateway</h4>
                  <p className="text-sm text-muted-foreground">ERC-7786 Gateway for cross-chain messaging</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-1 block">
                    0xCE1476C791ff195e462632bf9Eb22f3d3cA07388
                  </code>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  Proxy
                </Badge>
                <div>
                  <h4 className="font-semibold">Proxy Doma Record</h4>
                  <p className="text-sm text-muted-foreground">Facilitates communication between users and contracts</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-1 block">
                    0xD9A0E86AACf2B01013728fcCa9F00093B9b4F3Ff
                  </code>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  NFT
                </Badge>
                <div>
                  <h4 className="font-semibold">Ownership Token</h4>
                  <p className="text-sm text-muted-foreground">ERC-721 NFT with expiration and compliance features</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-1 block">
                    0x9A374915648f1352827fFbf0A7bB5752b6995eB7
                  </code>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Methods */}
      <Tabs defaultValue="rest-api" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rest-api">REST API</TabsTrigger>
          <TabsTrigger value="smart-contracts">Smart Contracts</TabsTrigger>
          <TabsTrigger value="solana">Solana</TabsTrigger>
        </TabsList>

        <TabsContent value="rest-api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Smart Contracts REST API
              </CardTitle>
              <CardDescription>
                HTTP endpoints for interacting with deployed Doma Protocol smart contracts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">Base URL</h4>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-sm flex-1">https://api-testnet.doma.xyz</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard("https://api-testnet.doma.xyz", "base-url")}
                    >
                      {copiedCode === "base-url" ? "Copied!" : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Authentication</h4>
                  <Badge variant="outline">Api-Key Header Required</Badge>
                </div>
              </div>

              {smartContractsEndpoints.map((endpoint, index) => (
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
                        onClick={() => copyToClipboard(endpoint.example, `rest-${index}`)}
                      >
                        {copiedCode === `rest-${index}` ? "Copied!" : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="smart-contracts" className="space-y-6">
          {/* Proxy Doma Record Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-green-600" />
                Proxy Doma Record Contract
              </CardTitle>
              <CardDescription>
                Methods require protocol fees paid in USDC (denominated) but paid in native gas coin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Request Tokenization */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Request Tokenization
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(codeBlocks.tokenization, "tokenization")}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {copiedCode === "tokenization" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Requires EIP-712 signed voucher from sponsoring Registrar. Fee: 10 USDC per domain.
                </p>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{codeBlocks.tokenization}</code>
                </pre>
              </div>

              {/* Claim Ownership */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    Claim Domain Ownership
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(codeBlocks.claimOwnership, "claim")}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {copiedCode === "claim" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Requires proof of contacts voucher. Works even if domain is expired. Fee: 5 USDC.
                </p>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{codeBlocks.claimOwnership}</code>
                </pre>
              </div>

              {/* Bridge */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Link className="h-4 w-4 text-purple-500" />
                    Bridge Token
                  </h4>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(codeBlocks.bridge, "bridge")}>
                    <Copy className="h-4 w-4 mr-1" />
                    {copiedCode === "bridge" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Move token to another supported chain. Can only be called on source chain. Fee: 2 USDC.
                </p>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{codeBlocks.bridge}</code>
                </pre>
              </div>

              {/* Detokenize */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Request Detokenization</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(codeBlocks.detokenize, "detokenize")}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {copiedCode === "detokenize" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Request domain detokenization. No fees required. Requires claimed ownership.
                </p>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{codeBlocks.detokenize}</code>
                </pre>
              </div>

              {/* Protocol Fees */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Protocol Fees</h4>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(codeBlocks.fees, "fees")}>
                    <Copy className="h-4 w-4 mr-1" />
                    {copiedCode === "fees" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  All fees are denominated in USDC but paid in the native gas token of each chain.
                </p>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{codeBlocks.fees}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Ownership Token Contract */}
          <Card>
            <CardHeader>
              <CardTitle>Ownership Token Contract</CardTitle>
              <CardDescription>ERC-721 token with additional functionality and restrictions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold">Key Features</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Expiration date tracking</li>
                    <li>• Registrar IANA ID association</li>
                    <li>• Transfer lock capability</li>
                    <li>• ERC-2981 royalties support</li>
                    <li>• Compliance burn rights</li>
                    <li>• Synthetic token support</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">View Functions</h4>
                  <div className="space-y-2">
                    <Badge variant="secondary">expirationOf(uint256 id)</Badge>
                    <Badge variant="secondary">registrarOf(uint256 id)</Badge>
                    <Badge variant="secondary">lockStatusOf(uint256 id)</Badge>
                    <Badge variant="secondary">nameOf(uint256 id)</Badge>
                    <Badge variant="secondary">isSynthetic(uint256 id)</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Ownership Token Functions</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(codeBlocks.ownershipToken, "ownership")}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {copiedCode === "ownership" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{codeBlocks.ownershipToken}</code>
                </pre>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Contract Events</h4>
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(codeBlocks.events, "events")}>
                    <Copy className="h-4 w-4 mr-1" />
                    {copiedCode === "events" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{codeBlocks.events}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="solana" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-purple-600" />
                Solana Integration
              </CardTitle>
              <CardDescription>Doma Protocol integrates with Solana Records Service (SRS) program</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Key Components</h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          SRS
                        </Badge>
                        Permissioned Class ownership for domain management
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Token22
                        </Badge>
                        Underlying NFT standard for tokenized domains
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          PDA
                        </Badge>
                        Proxy Doma Record as Class Authority
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Compliance Features</h4>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• Full control over minted NFTs</li>
                      <li>• Authority delegation to mint account</li>
                      <li>• Compliance operations through SRS</li>
                      <li>• Integrated Doma Gateway functionality</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Solana-Specific Architecture</h4>
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    The Solana implementation leverages the SRS program's permissioned class system, allowing Doma
                    Protocol to maintain full compliance control while providing seamless cross-chain functionality
                    through the integrated Gateway.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Solana Program ID</h4>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 rounded text-sm flex-1">
                      DomaRecordSolana1111111111111111111111111111
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard("DomaRecordSolana1111111111111111111111111111", "solana-program")}
                    >
                      {copiedCode === "solana-program" ? "Copied!" : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Network Information */}
      <Card>
        <CardHeader>
          <CardTitle>Network Configuration</CardTitle>
          <CardDescription>Doma Protocol testnet and mainnet details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-semibold">Doma Testnet</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chain ID:</span>
                  <code>97476 (0x17d74)</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Currency:</span>
                  <span>ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RPC URL:</span>
                  <code className="text-xs">https://rpc-testnet.doma.xyz/</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Explorer:</span>
                  <a 
                    href="https://explorer-testnet.doma.xyz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-xs"
                  >
                    explorer-testnet.doma.xyz
                  </a>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Doma Mainnet</h4>
              <div className="space-y-2 text-sm">
                <Badge variant="secondary" className="mb-2">Coming Soon</Badge>
                <div className="text-muted-foreground">
                  <p>Mainnet deployment is planned for Q2 2025.</p>
                  <p className="mt-2">All current operations are on testnet for development and testing purposes.</p>
                </div>
              </div>
            </div>
          </div>
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
              <a href="https://docs.doma.xyz/api-reference/doma-smart-contracts-api" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Smart Contracts API Docs
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://docs.doma.xyz/api-reference/doma-multi-chain-subgraph"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Multi-Chain Subgraph
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://start.doma.xyz" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Testnet Portal
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://docs.doma.xyz" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Full Documentation
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}