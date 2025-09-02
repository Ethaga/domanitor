"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DomaAPI, type DomainToken } from "@/lib/doma-api"
import {
  ArrowRightLeft,
  Link,
  Shield,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Wallet,
  Globe,
  Network,
  Target,
  History,
  Coins,
  TrendingUp,
  Settings
} from "lucide-react"

interface SupportedChain {
  id: string
  name: string
  shortName: string
  chainId: number
  icon: string
  nativeCurrency: string
  rpcUrl: string
  explorerUrl: string
  bridgeFee: number
  estimatedTime: string
  isTestnet: boolean
}

interface BridgeTransaction {
  id: string
  domain: string
  tokenId: string
  fromChain: string
  toChain: string
  fromAddress: string
  toAddress: string
  status: 'pending' | 'confirming' | 'bridging' | 'completed' | 'failed'
  txHash?: string
  bridgeTxHash?: string
  timestamp: string
  fee: number
  estimatedCompletion?: string
}

interface DomaBridgeProps {
  walletAddress: string
  isConnected: boolean
}

const SUPPORTED_CHAINS: SupportedChain[] = [
  {
    id: 'doma',
    name: 'Doma Network',
    shortName: 'DOMA',
    chainId: 97476,
    icon: '🛡️',
    nativeCurrency: 'ETH',
    rpcUrl: 'https://rpc-testnet.doma.xyz',
    explorerUrl: 'https://explorer-testnet.doma.xyz',
    bridgeFee: 0,
    estimatedTime: '—',
    isTestnet: true
  }
]

export function DomaBridge({ walletAddress, isConnected }: DomaBridgeProps) {
  const [userDomains, setUserDomains] = useState<DomainToken[]>([])
  const [selectedDomain, setSelectedDomain] = useState<string>("")
  const [fromChain, setFromChain] = useState<string>("sepolia")
  const [toChain, setToChain] = useState<string>("polygon")
  const [toAddress, setToAddress] = useState<string>("")
  const [bridgeTransactions, setBridgeTransactions] = useState<BridgeTransaction[]>([])
  const [currentBridge, setCurrentBridge] = useState<BridgeTransaction | null>(null)
  const [bridgeProgress, setBridgeProgress] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isConnected) {
      loadUserDomains()
      loadBridgeHistory()
    }
  }, [isConnected, walletAddress])

  useEffect(() => {
    if (toAddress === "") {
      setToAddress(walletAddress)
    }
  }, [walletAddress])

  const loadUserDomains = async () => {
    try {
      const domains = await DomaAPI.getDomainTokens(walletAddress)
      setUserDomains(domains)
    } catch (error) {
      console.error('Failed to load user domains:', error)
    }
  }

  const loadBridgeHistory = () => {
    // Mock bridge transaction history
    const mockTransactions: BridgeTransaction[] = [
      {
        id: 'bridge_1',
        domain: 'crypto.com',
        tokenId: '0x123',
        fromChain: 'ethereum',
        toChain: 'polygon',
        fromAddress: walletAddress,
        toAddress: walletAddress,
        status: 'completed',
        txHash: '0xabc123...',
        bridgeTxHash: '0xdef456...',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        fee: 0.005
      },
      {
        id: 'bridge_2',
        domain: 'defi.xyz',
        tokenId: '0x456',
        fromChain: 'polygon',
        toChain: 'arbitrum',
        fromAddress: walletAddress,
        toAddress: walletAddress,
        status: 'pending',
        txHash: '0x789xyz...',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        fee: 0.002,
        estimatedCompletion: new Date(Date.now() + 300000).toISOString()
      }
    ]
    setBridgeTransactions(mockTransactions)
  }

  const handleBridge = async () => {
    if (!isConnected || !selectedDomain || !toChain || !toAddress) return

    setLoading(true)
    setBridgeProgress(0)

    try {
      const selectedDomainData = userDomains.find(d => d.id === selectedDomain)
      if (!selectedDomainData) throw new Error('Domain not found')

      const bridgeTransaction: BridgeTransaction = {
        id: `bridge_${Date.now()}`,
        domain: selectedDomainData.name,
        tokenId: selectedDomainData.tokenId,
        fromChain,
        toChain,
        fromAddress: walletAddress,
        toAddress,
        status: 'pending',
        timestamp: new Date().toISOString(),
        fee: SUPPORTED_CHAINS.find(c => c.id === toChain)?.bridgeFee || 0.005,
        estimatedCompletion: new Date(Date.now() + 300000).toISOString()
      }

      setCurrentBridge(bridgeTransaction)
      setBridgeTransactions(prev => [bridgeTransaction, ...prev])

      // Simulate bridge process with progress updates
      const progressSteps = [
        { progress: 25, status: 'confirming' as const, message: 'Confirming on source chain...' },
        { progress: 50, status: 'bridging' as const, message: 'Processing bridge transaction...' },
        { progress: 75, status: 'bridging' as const, message: 'Validating on destination chain...' },
        { progress: 100, status: 'completed' as const, message: 'Bridge completed successfully!' }
      ]

      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        setBridgeProgress(step.progress)
        
        const updatedTransaction = {
          ...bridgeTransaction,
          status: step.status,
          ...(step.status === 'completed' && {
            bridgeTxHash: `0x${Math.random().toString(16).substr(2, 64)}`
          })
        }

        setCurrentBridge(updatedTransaction)
        setBridgeTransactions(prev => 
          prev.map(tx => tx.id === bridgeTransaction.id ? updatedTransaction : tx)
        )
      }

      // Actual bridge call to Doma Protocol
      const result = await DomaAPI.bridgeDomain(
        selectedDomainData.tokenId,
        toChain,
        toAddress
      )

      if (!result.success) {
        throw new Error(result.error || 'Bridge failed')
      }

    } catch (error) {
      console.error('Bridge failed:', error)
      if (currentBridge) {
        const failedTransaction = {
          ...currentBridge,
          status: 'failed' as const
        }
        setCurrentBridge(failedTransaction)
        setBridgeTransactions(prev => 
          prev.map(tx => tx.id === currentBridge.id ? failedTransaction : tx)
        )
      }
    } finally {
      setLoading(false)
    }
  }

  const getChainInfo = (chainId: string) => {
    return SUPPORTED_CHAINS.find(chain => chain.id === chainId)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'failed': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'bridging': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
      case 'confirming': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'failed': return <AlertTriangle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'bridging': return <ArrowRightLeft className="h-4 w-4" />
      case 'confirming': return <Shield className="h-4 w-4" />
      default: return <Circle className="h-4 w-4" />
    }
  }

  const isValidBridge = () => {
    return selectedDomain && 
           fromChain && 
           toChain && 
           fromChain !== toChain && 
           toAddress && 
           isConnected &&
           !loading
  }

  return (
    <div className="space-y-6">
      {/* Bridge Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Cross-Chain Domain Bridge
          </CardTitle>
          <CardDescription>
            Move your tokenized domains across different blockchain networks using Doma Protocol's secure bridge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{SUPPORTED_CHAINS.length}</div>
              <div className="text-sm text-muted-foreground">Supported Chains</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{bridgeTransactions.filter(tx => tx.status === 'completed').length}</div>
              <div className="text-sm text-muted-foreground">Completed Bridges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{bridgeTransactions.filter(tx => tx.status === 'pending' || tx.status === 'bridging').length}</div>
              <div className="text-sm text-muted-foreground">Active Bridges</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">~{Math.min(...SUPPORTED_CHAINS.map(c => parseFloat(c.estimatedTime.split('-')[0])))} min</div>
              <div className="text-sm text-muted-foreground">Fastest Bridge</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="bridge" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bridge">Bridge Domain</TabsTrigger>
          <TabsTrigger value="history">Bridge History</TabsTrigger>
          <TabsTrigger value="chains">Supported Chains</TabsTrigger>
        </TabsList>

        <TabsContent value="bridge" className="space-y-6">
          {currentBridge && currentBridge.status !== 'completed' && currentBridge.status !== 'failed' && (
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <ArrowRightLeft className="h-5 w-5" />
                  Bridge in Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Bridging {currentBridge.domain}</span>
                    <Badge className={getStatusColor(currentBridge.status)}>
                      {getStatusIcon(currentBridge.status)}
                      <span className="ml-1">{currentBridge.status}</span>
                    </Badge>
                  </div>
                  <Progress value={bridgeProgress} className="w-full" />
                  <div className="text-sm text-muted-foreground">
                    {getChainInfo(currentBridge.fromChain)?.name} → {getChainInfo(currentBridge.toChain)?.name}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bridge Configuration</CardTitle>
                <CardDescription>
                  Select your domain and destination chain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isConnected && (
                  <Alert>
                    <AlertDescription>
                      Connect your wallet to bridge domains across chains.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="select-domain">Select Domain</Label>
                  <Select value={selectedDomain} onValueChange={setSelectedDomain} disabled={!isConnected}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a domain to bridge" />
                    </SelectTrigger>
                    <SelectContent>
                      {userDomains.map((domain) => (
                        <SelectItem key={domain.id} value={domain.id}>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span>{domain.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {domain.tokenId}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from-chain">From Chain</Label>
                    <Select value={fromChain} onValueChange={setFromChain} disabled={!isConnected}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORTED_CHAINS.map((chain) => (
                          <SelectItem key={chain.id} value={chain.id}>
                            <div className="flex items-center gap-2">
                              <span>{chain.icon}</span>
                              <span>{chain.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to-chain">To Chain</Label>
                    <Select value={toChain} onValueChange={setToChain} disabled={!isConnected}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORTED_CHAINS.filter(chain => chain.id !== fromChain).map((chain) => (
                          <SelectItem key={chain.id} value={chain.id}>
                            <div className="flex items-center gap-2">
                              <span>{chain.icon}</span>
                              <span>{chain.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to-address">Destination Address</Label>
                  <Input
                    id="to-address"
                    placeholder="0x..."
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    disabled={!isConnected}
                  />
                  <div className="text-xs text-muted-foreground">
                    Address on the destination chain to receive the domain
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bridge Summary</CardTitle>
                <CardDescription>
                  Review your bridge transaction details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedDomain && fromChain && toChain ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Domain:</span>
                        <span className="font-medium">
                          {userDomains.find(d => d.id === selectedDomain)?.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">From:</span>
                        <div className="flex items-center gap-2">
                          <span>{getChainInfo(fromChain)?.icon}</span>
                          <span>{getChainInfo(fromChain)?.name}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">To:</span>
                        <div className="flex items-center gap-2">
                          <span>{getChainInfo(toChain)?.icon}</span>
                          <span>{getChainInfo(toChain)?.name}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Bridge Fee:</span>
                        <span className="font-medium">
                          {getChainInfo(toChain)?.bridgeFee} {getChainInfo(fromChain)?.nativeCurrency}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Estimated Time:</span>
                        <span>{getChainInfo(toChain)?.estimatedTime}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg mb-4">
                        <Shield className="h-4 w-4 text-amber-600" />
                        <div className="text-sm">
                          <strong>Doma Protocol ensures:</strong> Secure cross-chain transfers with full ICANN compliance maintained
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleBridge} 
                        disabled={!isValidBridge()} 
                        className="w-full"
                      >
                        {loading ? (
                          <>
                            <ArrowRightLeft className="h-4 w-4 mr-2 animate-spin" />
                            Bridging...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Bridge Domain
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <ArrowRightLeft className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a domain and destination chain to see bridge details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {bridgeTransactions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bridge history</h3>
                <p className="text-muted-foreground">Your bridge transactions will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bridgeTransactions.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Globe className="h-5 w-5" />
                          <span className="font-semibold">{transaction.domain}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{getChainInfo(transaction.fromChain)?.icon}</span>
                          <span>{getChainInfo(transaction.fromChain)?.shortName}</span>
                          <ArrowRightLeft className="h-4 w-4" />
                          <span>{getChainInfo(transaction.toChain)?.icon}</span>
                          <span>{getChainInfo(transaction.toChain)?.shortName}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(transaction.status)}>
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1">{transaction.status}</span>
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Transaction ID:</span>
                        <div className="font-mono">{transaction.id}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fee Paid:</span>
                        <div>{transaction.fee} {getChainInfo(transaction.fromChain)?.nativeCurrency}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Timestamp:</span>
                        <div>{new Date(transaction.timestamp).toLocaleString()}</div>
                      </div>
                    </div>

                    {(transaction.txHash || transaction.bridgeTxHash) && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex gap-2">
                          {transaction.txHash && (
                            <Button variant="outline" size="sm" asChild>
                              <a 
                                href={`${getChainInfo(transaction.fromChain)?.explorerUrl}/tx/${transaction.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Source Tx
                              </a>
                            </Button>
                          )}
                          {transaction.bridgeTxHash && (
                            <Button variant="outline" size="sm" asChild>
                              <a 
                                href={`${getChainInfo(transaction.toChain)?.explorerUrl}/tx/${transaction.bridgeTxHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Dest Tx
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="chains" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUPPORTED_CHAINS.map((chain) => (
              <Card key={chain.id} className={chain.isTestnet ? 'border-dashed border-orange-200' : ''}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{chain.icon}</span>
                    <span>{chain.name}</span>
                    {chain.isTestnet && (
                      <Badge variant="outline" className="text-orange-600">
                        Testnet
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chain ID:</span>
                      <span>{chain.chainId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Native Currency:</span>
                      <span>{chain.nativeCurrency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bridge Fee:</span>
                      <span>{chain.bridgeFee} {chain.nativeCurrency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Time:</span>
                      <span>{chain.estimatedTime}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                      <a href={chain.explorerUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Explorer
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Network className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <h3 className="font-semibold mb-1">More Chains Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  Doma Protocol is expanding to support additional blockchain networks
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Circle({ className }: { className?: string }) {
  return <div className={`rounded-full border-2 ${className}`} />
}
