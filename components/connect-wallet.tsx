"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ConnectWalletProps {
  isConnected: boolean
  onConnect: (connected: boolean) => void
}

export function ConnectWallet({ isConnected, onConnect }: ConnectWalletProps) {
  const [address, setAddress] = useState("")

  const handleConnect = (walletType: string) => {
    // Simulate wallet connection
    const mockAddress = "0x1234...5678"
    setAddress(mockAddress)
    onConnect(true)
  }

  const handleDisconnect = () => {
    setAddress("")
    onConnect(false)
  }

  if (isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Wallet className="h-4 w-4" />
            <span className="font-mono">{address}</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              Doma Testnet
            </Badge>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDisconnect}>Disconnect Wallet</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Connect Wallet
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleConnect("metamask")}>MetaMask</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleConnect("walletconnect")}>WalletConnect</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleConnect("coinbase")}>Coinbase Wallet</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
