"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  createDomaWeb3Service,
  type WalletAssets,
  type DomainAsset,
  type DIDAsset,
  type TokenBalance,
  DOMA_TESTNET_CONFIG
} from "@/lib/web3-utils"
import {
  Wallet,
  Globe,
  Shield,
  Coins,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  Network
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
  const [refreshProgress, setRefreshProgress] = useState(0)

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
    setRefreshProgress(0)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setRefreshProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const walletAssets = await web3Service.getAllWalletAssets(walletAddress)
      setAssets(walletAssets)
      setRefreshProgress(100)

      clearInterval(progressInterval)
    } catch (err) {
      setError("Gagal memuat aset wallet. Menampilkan data simulasi.")
      console.error("Error loading wallet assets:", err)

      // Fallback to simulated data
      setAssets({
        domains: [
          {
            tokenId: "1",
            name: "crypto.doma",
            expirationDate: "2025-12-31T00:00:00Z",
            registrar: "Doma Protocol",
            isActive: true,
            tokenizedValue: "2.5",
            owner: walletAddress
          },
          {
            tokenId: "2",
            name: "defi.doma",
            expirationDate: "2025-06-15T00:00:00Z",
            registrar: "Doma Protocol",
            isActive: true,
            tokenizedValue: "1.8",
            owner: walletAddress
          }
        ],
        dids: [
          {
            didId: `did:doma:${walletAddress.slice(2, 10)}`,
            isActive: true,
            controller: walletAddress,
            createdAt: "2024-01-15T10:30:00Z"
          }
        ],
        tokens: [
          {
            contractAddress: 'native',
            name: 'Ethereum',
            symbol: 'ETH',
            balance: "0.1234",
            decimals: 18
          },
          {
            contractAddress: '0x456d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
            name: 'Doma Token',
            symbol: 'DOMA',
            balance: "1000.0",
            decimals: 18
          }
        ],
        nfts: [],
        totalValue: "1004.43"
      })
      setRefreshProgress(100)
    } finally {
      setLoading(false)
      setTimeout(() => setRefreshProgress(0), 1000)
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

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge className={isActive ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"}>
        {isActive ? (
          <>
            <CheckCircle className="h-3 w-3 mr-1" />
            Aktif
          </>
        ) : (
          <>
            <XCircle className="h-3 w-3 mr-1" />
            Tidak Aktif
          </>
        )}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatBalance = (balance: string, symbol: string) => {
    const num = parseFloat(balance)
    if (num === 0) return `0 ${symbol}`
    if (num < 0.0001) return `<0.0001 ${symbol}`
    return `${num.toFixed(4)} ${symbol}`
  }

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Aset Wallet Doma Testnet
          </CardTitle>
          <CardDescription>
            Menampilkan semua domain, DID, dan aset lainnya dari wallet yang terhubung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Wallet className="h-4 w-4" />
            <AlertDescription>
              Hubungkan wallet Anda untuk melihat semua aset pada Doma testnet.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Network Status */}
      {!isDomaTestnet && (
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="flex items-center justify-between">
            <span>Anda tidak terhubung ke Doma Testnet (Sepolia). Beralih untuk melihat aset yang sebenarnya.</span>
            <Button onClick={switchToDomaTestnet} size="sm" className="ml-4">
              <Network className="h-4 w-4 mr-2" />
              Beralih ke Doma Testnet
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Loading Progress */}
      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium">Memuat aset wallet...</p>
                <Progress value={refreshProgress} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assets Overview */}
      {assets && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Domain</p>
                    <p className="text-2xl font-bold">{assets.domains.length}</p>
                  </div>
                  <Globe className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">DID Aktif</p>
                    <p className="text-2xl font-bold">{assets.dids.filter(did => did.isActive).length}</p>
                  </div>
                  <Shield className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Token Balance</p>
                    <p className="text-2xl font-bold">{assets.tokens.length}</p>
                  </div>
                  <Coins className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Nilai</p>
                    <p className="text-2xl font-bold">{assets.totalValue} ETH</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Assets Tabs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Aset Wallet Detail</CardTitle>
                <CardDescription>
                  Daftar lengkap semua aset pada Doma testnet
                </CardDescription>
              </div>
              <Button onClick={loadAssets} disabled={loading} size="sm">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="domains" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="domains" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Domain ({assets.domains.length})
                  </TabsTrigger>
                  <TabsTrigger value="dids" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    DID ({assets.dids.length})
                  </TabsTrigger>
                  <TabsTrigger value="tokens" className="flex items-center gap-2">
                    <Coins className="h-4 w-4" />
                    Token ({assets.tokens.length})
                  </TabsTrigger>
                  <TabsTrigger value="nfts" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    NFT ({assets.nfts.length})
                  </TabsTrigger>
                </TabsList>

                {/* Domains Tab */}
                <TabsContent value="domains" className="space-y-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama Domain</TableHead>
                          <TableHead>Nilai Tokenized</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Registrar</TableHead>
                          <TableHead>Tanggal Kadaluarsa</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assets.domains.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              Tidak ada domain yang ditemukan
                            </TableCell>
                          </TableRow>
                        ) : (
                          assets.domains.map((domain) => (
                            <TableRow key={domain.tokenId}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Globe className="h-4 w-4 text-blue-500" />
                                  {domain.name}
                                </div>
                              </TableCell>
                              <TableCell className="font-mono">
                                {domain.tokenizedValue} ETH
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(domain.isActive)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{domain.registrar}</Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  {formatDate(domain.expirationDate)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" asChild>
                                  <a
                                    href={`https://sepolia.etherscan.io/token/${domain.tokenId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* DIDs Tab */}
                <TabsContent value="dids" className="space-y-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>DID Identifier</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Controller</TableHead>
                          <TableHead>Dibuat</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assets.dids.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              Tidak ada DID yang ditemukan
                            </TableCell>
                          </TableRow>
                        ) : (
                          assets.dids.map((did) => (
                            <TableRow key={did.didId}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-green-500" />
                                  <code className="text-xs">{did.didId}</code>
                                </div>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(did.isActive)}
                              </TableCell>
                              <TableCell>
                                <code className="text-xs">{did.controller.slice(0, 10)}...{did.controller.slice(-4)}</code>
                              </TableCell>
                              <TableCell>
                                {formatDate(did.createdAt)}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" asChild>
                                  <a
                                    href={`https://sepolia.etherscan.io/address/${did.controller}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Tokens Tab */}
                <TabsContent value="tokens" className="space-y-4">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Token</TableHead>
                          <TableHead>Balance</TableHead>
                          <TableHead>Contract Address</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assets.tokens.map((token, index) => (
                          <TableRow key={token.contractAddress || index}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Coins className="h-4 w-4 text-yellow-500" />
                                <div>
                                  <p className="font-medium">{token.name}</p>
                                  <p className="text-sm text-muted-foreground">{token.symbol}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono">
                              {formatBalance(token.balance, token.symbol)}
                            </TableCell>
                            <TableCell>
                              {token.contractAddress === 'native' ? (
                                <Badge variant="outline">Native ETH</Badge>
                              ) : (
                                <code className="text-xs">{token.contractAddress.slice(0, 10)}...{token.contractAddress.slice(-4)}</code>
                              )}
                            </TableCell>
                            <TableCell>
                              {token.contractAddress !== 'native' && (
                                <Button variant="ghost" size="sm" asChild>
                                  <a
                                    href={`https://sepolia.etherscan.io/token/${token.contractAddress}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* NFTs Tab */}
                <TabsContent value="nfts" className="space-y-4">
                  <div className="rounded-md border p-8 text-center">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">NFT Detection</h3>
                    <p className="text-muted-foreground mb-4">
                      Deteksi NFT memerlukan integrasi tambahan dengan layanan indexing.
                      Saat ini menampilkan token domain yang telah ditokenisasi.
                    </p>
                    <Button variant="outline" disabled>
                      Akan Datang
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
