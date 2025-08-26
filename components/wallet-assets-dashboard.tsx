"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import {
  createDomaWeb3Service,
  type WalletAssets,
  type DomainAsset,
  DOMA_TESTNET_CONFIG
} from "@/lib/web3-utils"
import {
  type DomaDomainAsset,
  type TokenizationResult,
  type BridgeResult,
  type ClaimResult,
  type DetokenizationResult
} from "@/lib/doma-smart-contracts"
import {
  Wallet,
  Globe,
  RefreshCw,
  ExternalLink,
  Clock,
  AlertTriangle,
  Network,
  Search
} from "lucide-react"

interface WalletAssetsDashboardProps {
  walletAddress: string
  isConnected: boolean
  provider?: any
}

export function WalletAssetsDashboard({ walletAddress, isConnected, provider }: WalletAssetsDashboardProps) {
  const [assets, setAssets] = useState<WalletAssets | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isDomaTestnet, setIsDomaTestnet] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const web3Service = createDomaWeb3Service(provider)

  const checkNetwork = useCallback(async () => {
    if (!provider) return
    try {
      const isCorrectNetwork = await web3Service.isConnectedToDomaTestnet()
      setIsDomaTestnet(isCorrectNetwork)
    } catch (error) {
      console.error('Error checking network:', error)
      setIsDomaTestnet(false)
    }
  }, [provider, web3Service])

  const loadAssets = useCallback(async () => {
    if (!isConnected || !walletAddress) return

    setLoading(true)
    setError("")

    try {
      const walletAssets = await web3Service.getAllWalletAssets(walletAddress)
      setAssets(walletAssets)
    } catch (err) {
      setError("Gagal memuat aset wallet. Menampilkan data simulasi.")
      console.error("Error loading wallet assets:", err)

      // Fallback to simulated data with more realistic domain names
      setAssets({
        domains: [
          {
            tokenId: "1",
            name: "ethaga.ai",
            expirationDate: "2027-07-04T00:00:00Z",
            registrar: "D3 Registrar",
            isActive: true,
            tokenizedValue: "0.5",
            owner: walletAddress
          },
          {
            tokenId: "2", 
            name: "ethaga.io",
            expirationDate: "2026-07-04T00:00:00Z",
            registrar: "D3 Registrar",
            isActive: true,
            tokenizedValue: "0.3",
            owner: walletAddress
          },
          {
            tokenId: "3",
            name: "ethaga.com",
            expirationDate: "2026-07-04T00:00:00Z",
            registrar: "D3 Registrar",
            isActive: true,
            tokenizedValue: "0.8",
            owner: walletAddress
          },
          {
            tokenId: "4",
            name: "ethaga.ape",
            expirationDate: "2026-07-04T00:00:00Z",
            registrar: "D3 Registrar",
            isActive: true,
            tokenizedValue: "0.2",
            owner: walletAddress
          }
        ],
        dids: [],
        tokens: [],
        nfts: [],
        totalValue: "1.8"
      })
    } finally {
      setLoading(false)
    }
  }, [isConnected, walletAddress, web3Service])

  const switchToDomaTestnet = async () => {
    const success = await web3Service.switchToDomaTestnet()
    if (success) {
      await checkNetwork()
      await loadAssets()
    }
  }

  // Auto-refresh on wallet connect or network change
  useEffect(() => {
    if (isConnected && walletAddress) {
      checkNetwork()
      loadAssets()
    }
  }, [isConnected, walletAddress, loadAssets, checkNetwork])

  // Set up event listeners for wallet/network changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = () => {
        loadAssets()
      }

      const handleChainChanged = () => {
        checkNetwork()
        loadAssets()
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [loadAssets, checkNetwork])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredDomains = assets?.domains.filter(domain => 
    domain.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-muted-foreground mb-4">
              My Account | Portfolio
            </nav>
            <h1 className="text-2xl font-bold">Domains</h1>
          </div>
          <Button disabled className="bg-blue-600 text-white">
            BRIDGE A DOMAIN
          </Button>
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground">
              Connect your wallet to view your domain portfolio from Doma Protocol.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <nav className="text-sm text-muted-foreground mb-2">
            My Account | Portfolio
          </nav>
          <h1 className="text-2xl font-bold">Domains</h1>
          {walletAddress && (
            <p className="text-sm text-muted-foreground mt-1">
              Wallet: <span className="font-mono">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
            </p>
          )}
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          BRIDGE A DOMAIN
        </Button>
      </div>

      {/* Network Status */}
      {!isDomaTestnet && (
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="flex items-center justify-between">
            <span>You are not connected to Doma Testnet (Sepolia). Switch to view real assets.</span>
            <Button onClick={switchToDomaTestnet} size="sm" className="ml-4">
              <Network className="h-4 w-4 mr-2" />
              Switch to Doma Testnet
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Your Domains Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-xl font-semibold">Your Domains</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search domains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={loadAssets} disabled={loading} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Domains Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-medium">DOMAIN</TableHead>
                    <TableHead className="font-medium">STATUS</TableHead>
                    <TableHead className="font-medium">REGISTRAR</TableHead>
                    <TableHead className="font-medium">EXPIRATION</TableHead>
                    <TableHead className="font-medium hidden lg:table-cell">LOCK STATUS</TableHead>
                    <TableHead className="font-medium">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                        <p className="text-muted-foreground">Loading domains...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredDomains.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        {searchTerm ? "No domains found matching your search." : "No domains found. Start by tokenizing your first domain!"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDomains.map((domain) => (
                      <TableRow key={domain.tokenId} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-blue-500" />
                              <span>{domain.name}</span>
                              {domain.isSynthetic && (
                                <Badge variant="outline" className="text-xs">Synthetic</Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Token ID: {domain.tokenId} • Value: {domain.tokenizedValue} ETH
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge
                              className={domain.isActive
                                ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300"
                              }
                            >
                              {domain.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="text-muted-foreground text-sm">{domain.registrar}</span>
                            {domain.registrarIanaId && (
                              <span className="text-xs text-muted-foreground">IANA: {domain.registrarIanaId}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span className="text-sm">{formatDate(domain.expirationDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge
                            variant={domain.isTransferLocked ? "destructive" : "outline"}
                            className="text-xs"
                          >
                            {domain.isTransferLocked ? "🔒 Locked" : "🔓 Unlocked"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 lg:gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-600 border-blue-600 hover:bg-blue-50 text-xs lg:text-sm"
                              disabled={domain.isTransferLocked}
                              title={domain.isTransferLocked ? "Domain is transfer locked" : "Bridge to another chain"}
                            >
                              Bridge
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 border-green-600 hover:bg-green-50 text-xs lg:text-sm"
                            >
                              Claim
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <a
                                href={`https://sepolia.etherscan.io/token/${domain.tokenId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground"
                                title="View on Etherscan"
                              >
                                <ExternalLink className="h-3 w-3 lg:h-4 lg:w-4" />
                              </a>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
