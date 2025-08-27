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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Portfolio Dashboard
            </h1>
            <p className="text-muted-foreground">
              View and manage your tokenized domains on Doma Protocol
            </p>
          </div>
          
          {/* Wallet Connection */}
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="border-blue-300 text-blue-800 dark:border-blue-700 dark:text-blue-200">
              <Network className="h-3 w-3 mr-1" />
              Doma Mainnet
            </Badge>
            <ConnectWallet
              onConnect={handleWalletConnect}
              onDisconnect={handleWalletDisconnect}
              isConnected={isConnected}
              walletAddress={walletAddress}
            />
          </div>
        </div>

        {/* Network Information */}
        {isConnected && (
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200">Connected to Doma Mainnet</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Using Web3.js to read data from smart contracts on Ethereum mainnet
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="border-green-300 text-green-800 dark:border-green-700 dark:text-green-200">
                  Chain ID: 1
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Dashboard */}
        <WalletAssetsDashboard
          walletAddress={walletAddress}
          isConnected={isConnected}
          provider={provider}
        />

        {/* Footer */}
        {isConnected && (
          <Card className="bg-muted/30">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Powered by{" "}
                <a href="https://doma.xyz" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Doma Protocol
                </a>
                {" "}with Web3.js for seamless smart contract integration.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
