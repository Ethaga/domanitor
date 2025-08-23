"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, ExternalLink, Code, Zap, Shield, Link } from "lucide-react"

export function DomaApiReference() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

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
) public payable;`,

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
) public payable;`,

    detokenize: `/**
 * @dev Request detokenization of a Domain, using Ownership token.
 * Relays message to Doma Record contract on Doma Chain, for validation and further processing.
 * @param tokenId Id of an Ownership Token.
 * @param isSynthetic Whether it's a regular or permissioned (synthetic) ownership token.
 */
function requestDetokenization(uint256 tokenId, bool isSynthetic) public;`,

    expiration: `/**
 * @notice Returns expiration date for a token. After this date, token transfer will be blocked.
 * @param id Token ID.
 * @return uint256 Unix timestamp in seconds.
 */
function expirationOf(uint256 id) external view returns (uint256) {
  return _expirations[id];
}`,

    events: `/**
 * @notice Emitted when an ownership token is minted.
 * @param tokenId The ID of the ownership token.
 * @param registrarIanaId The IANA ID of a sponsoring registrar.
 * @param to The address that received the ownership token.
 * @param sld The second-level domain of the name.
 * @param tld The top-level domain of the name.
 * @param expiresAt The expiration date of the name (UNIX seconds).
 * @param correlationId Correlation id associated with a mint event.
 */
event OwnershipTokenMinted(
  uint256 indexed tokenId,
  uint256 registrarIanaId,
  address to,
  string sld,
  string tld,
  uint256 expiresAt,
  string correlationId
);`,
  }

  return (
    <div className="space-y-8">
      {/* Protocol Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Protocol Overview
          </CardTitle>
          <CardDescription>Smart Contracts that form the Doma Protocol ecosystem</CardDescription>
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
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  Relay
                </Badge>
                <div>
                  <h4 className="font-semibold">Doma Forwarder</h4>
                  <p className="text-sm text-muted-foreground">EIP-2771 Trusted Forwarder for meta transactions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  Cross-Chain
                </Badge>
                <div>
                  <h4 className="font-semibold">Doma Gateway</h4>
                  <p className="text-sm text-muted-foreground">ERC-7786 Gateway for cross-chain messaging</p>
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
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">
                  NFT
                </Badge>
                <div>
                  <h4 className="font-semibold">Ownership Token</h4>
                  <p className="text-sm text-muted-foreground">ERC-721 NFT with expiration and compliance features</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Methods */}
      <Tabs defaultValue="evm" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="evm">EVM Chains</TabsTrigger>
          <TabsTrigger value="solana">Solana</TabsTrigger>
        </TabsList>

        <TabsContent value="evm" className="space-y-6">
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
                  Requires EIP-712 signed voucher from sponsoring Registrar
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
                  Requires proof of contacts voucher. Works even if domain is expired.
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
                  Move token to another supported chain. Can only be called on source chain.
                </p>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{codeBlocks.bridge}</code>
                </pre>
              </div>

              {/* Detokenize */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Detokenize</h4>
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
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Additional Functions</h4>
                  <div className="space-y-2">
                    <Badge variant="secondary">expirationOf(uint256 id)</Badge>
                    <Badge variant="secondary">registrarOf(uint256 id)</Badge>
                    <Badge variant="secondary">lockStatusOf(uint256 id)</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Get Expiration Date</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(codeBlocks.expiration, "expiration")}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    {copiedCode === "expiration" ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{codeBlocks.expiration}</code>
                </pre>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Non-Standard Events</h4>
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
              <CardTitle>Solana Integration</CardTitle>
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

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Solana-Specific Architecture</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    The Solana implementation leverages the SRS program's permissioned class system, allowing Doma
                    Protocol to maintain full compliance control while providing seamless cross-chain functionality
                    through the integrated Gateway.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Documentation Links */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <a href="https://docs.doma.xyz" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Full Documentation
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
