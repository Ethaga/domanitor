"use client"

import { useState, useEffect } from "react"
import { WalletAssetsDashboard } from "@/components/wallet-assets-dashboard"
import { ConnectWallet } from "@/components/connect-wallet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Wallet, Network, Info } from "lucide-react"

export default function WalletAssetsPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [provider, setProvider] = useState<any>(null)

  useEffect(() => {
    // Check if wallet is already connected
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0])
            setIsConnected(true)
            setProvider(window.ethereum)
          }
        })
        .catch(console.error)
    }
  }, [])

  const handleWalletConnect = (address: string, providerInstance: any) => {
    setWalletAddress(address)
    setIsConnected(true)
    setProvider(providerInstance)
  }

  const handleWalletDisconnect = () => {
    setWalletAddress("")
    setIsConnected(false)
    setProvider(null)
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Doma Testnet Wallet Assets
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Lihat semua aset, domain, dan DID yang dimiliki wallet Anda pada jaringan Doma testnet
        </p>
      </div>

      {/* Information Card */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Info className="h-5 w-5" />
            Informasi Doma Testnet
          </CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            Aplikasi ini menggunakan Web3.js untuk membaca data dari smart contract pada jaringan Sepolia testnet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-blue-300 text-blue-800 dark:border-blue-700 dark:text-blue-200">
              <Network className="h-3 w-3 mr-1" />
              Sepolia Testnet
            </Badge>
            <Badge variant="outline" className="border-blue-300 text-blue-800 dark:border-blue-700 dark:text-blue-200">
              Chain ID: 11155111
            </Badge>
            <Badge variant="outline" className="border-blue-300 text-blue-800 dark:border-blue-700 dark:text-blue-200">
              Web3.js Integration
            </Badge>
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="mb-2"><strong>Fitur yang tersedia:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Domain yang telah ditokenisasi dengan nilai dan status DID</li>
              <li>Balance token (ETH, DOMA, dan token lainnya)</li>
              <li>Auto-refresh saat wallet connect atau network berubah</li>
              <li>Layout responsif untuk mobile dan desktop</li>
              <li>Real-time data dari smart contract Doma Protocol</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Connection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Koneksi Wallet
          </CardTitle>
          <CardDescription>
            Hubungkan wallet Anda untuk melihat aset pada Doma testnet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConnectWallet
            onConnect={handleWalletConnect}
            onDisconnect={handleWalletDisconnect}
            isConnected={isConnected}
            walletAddress={walletAddress}
          />
        </CardContent>
      </Card>

      {/* Wallet Status */}
      {isConnected && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <Wallet className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Wallet terhubung: <code className="bg-green-100 dark:bg-green-900 px-1 rounded text-xs">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </code>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Assets Dashboard */}
      <WalletAssetsDashboard
        walletAddress={walletAddress}
        isConnected={isConnected}
        provider={provider}
      />

      {/* Footer */}
      <Card className="bg-muted/50">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <a href="https://doma.xyz" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Doma Protocol
            </a>
            {" "}dan Web3.js untuk integrasi smart contract yang seamless.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
