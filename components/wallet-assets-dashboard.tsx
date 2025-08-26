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
            <CardHeader className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <CardTitle>Aset Wallet Detail</CardTitle>
                <CardDescription>
                  Daftar lengkap semua aset pada Doma testnet
                </CardDescription>
              </div>
              <Button onClick={loadAssets} disabled={loading} size="sm" className="self-start md:self-auto">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">⟳</span>
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="domains" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                  <TabsTrigger value="domains" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                    <Globe className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Domain</span>
                    <span className="sm:hidden">Dom</span>
                    <span>({assets.domains.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="dids" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                    <Shield className="h-3 w-3 md:h-4 md:w-4" />
                    <span>DID ({assets.dids.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="tokens" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                    <Coins className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Token</span>
                    <span className="sm:hidden">Tok</span>
                    <span>({assets.tokens.length})</span>
                  </TabsTrigger>
                  <TabsTrigger value="nfts" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                    <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
                    <span>NFT ({assets.nfts.length})</span>
                  </TabsTrigger>
                </TabsList>

                {/* Domains Tab */}
                <TabsContent value="domains" className="space-y-4">
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[150px]">Nama Domain</TableHead>
                          <TableHead className="min-w-[120px]">Nilai Tokenized</TableHead>
                          <TableHead className="min-w-[100px]">Status</TableHead>
                          <TableHead className="hidden md:table-cell min-w-[120px]">Registrar</TableHead>
                          <TableHead className="hidden lg:table-cell min-w-[140px]">Tanggal Kadaluarsa</TableHead>
                          <TableHead className="min-w-[80px]">Action</TableHead>
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
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm">{domain.name}</span>
                                  </div>
                                  <div className="md:hidden text-xs text-muted-foreground">
                                    {domain.tokenizedValue} ETH • {domain.isActive ? 'Aktif' : 'Tidak Aktif'}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="font-mono hidden md:table-cell">
                                {domain.tokenizedValue} ETH
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {getStatusBadge(domain.isActive)}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <Badge variant="outline">{domain.registrar}</Badge>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
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
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[200px]">DID Identifier</TableHead>
                          <TableHead className="min-w-[100px]">Status</TableHead>
                          <TableHead className="hidden md:table-cell min-w-[120px]">Controller</TableHead>
                          <TableHead className="hidden lg:table-cell min-w-[100px]">Dibuat</TableHead>
                          <TableHead className="min-w-[80px]">Action</TableHead>
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
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-green-500" />
                                    <code className="text-xs break-all">{did.didId}</code>
                                  </div>
                                  <div className="md:hidden text-xs text-muted-foreground">
                                    {did.isActive ? 'Aktif' : 'Tidak Aktif'} • {formatDate(did.createdAt)}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {getStatusBadge(did.isActive)}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                <code className="text-xs">{did.controller.slice(0, 10)}...{did.controller.slice(-4)}</code>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell">
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
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[150px]">Token</TableHead>
                          <TableHead className="min-w-[120px]">Balance</TableHead>
                          <TableHead className="hidden md:table-cell min-w-[150px]">Contract Address</TableHead>
                          <TableHead className="min-w-[80px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assets.tokens.map((token, index) => (
                          <TableRow key={token.contractAddress || index}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Coins className="h-4 w-4 text-yellow-500" />
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium truncate">{token.name}</p>
                                  <p className="text-sm text-muted-foreground">{token.symbol}</p>
                                  <div className="md:hidden text-xs text-muted-foreground mt-1">
                                    {token.contractAddress === 'native' ? 'Native ETH' : `${token.contractAddress.slice(0, 8)}...`}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono">
                              <div className="text-sm">
                                {formatBalance(token.balance, token.symbol)}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
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
