"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, ChevronDown, AlertCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ConnectWalletProps {
  isConnected: boolean
  onConnect: (connected: boolean) => void
}

declare global {
  interface Window {
    ethereum?: any
    okxwallet?: any
  }
}

export function ConnectWallet({ isConnected, onConnect }: ConnectWalletProps) {
  const [address, setAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState("")
  const [connectedWallet, setConnectedWallet] = useState("")

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (typeof window !== "undefined") {
      if (window.ethereum && !window.ethereum.isOkxWallet) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            const account = accounts[0]
            setAddress(formatAddress(account))
            setConnectedWallet("MetaMask")
            onConnect(true)
            return
          }
        } catch (error) {
          console.error("Error checking MetaMask connection:", error)
        }
      }

      if (window.okxwallet) {
        try {
          const accounts = await window.okxwallet.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            const account = accounts[0]
            setAddress(formatAddress(account))
            setConnectedWallet("OKX Wallet")
            onConnect(true)
            return
          }
        } catch (error) {
          console.error("Error checking OKX wallet connection:", error)
        }
      }
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const handleConnect = async (walletType: string) => {
    if (walletType === "metamask") {
      await connectMetaMask()
    } else if (walletType === "okx") {
      await connectOKX()
    } else if (walletType === "walletconnect") {
      await connectWalletConnect()
    } else {
      setError(`${walletType} integration coming soon!`)
      setTimeout(() => setError(""), 3000)
    }
  }

  const connectMetaMask = async () => {
    setIsConnecting(true)
    setError("")

    try {
      if (!window.ethereum) {
        setError("MetaMask is not installed. Please install MetaMask to continue.")
        setIsConnecting(false)
        return
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        const account = accounts[0]
        setAddress(formatAddress(account))
        setConnectedWallet("MetaMask")
        onConnect(true)

        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x1" }],
          })
        } catch (switchError: any) {
          console.log("Network switch error:", switchError)
        }
      }
    } catch (error: any) {
      console.error("Error connecting to MetaMask:", error)
      if (error.code === 4001) {
        setError("Connection rejected by user")
      } else {
        setError("Failed to connect to MetaMask")
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const connectOKX = async () => {
    setIsConnecting(true)
    setError("")

    try {
      if (!window.okxwallet) {
        setError("OKX Wallet is not installed. Please install OKX Wallet to continue.")
        setIsConnecting(false)
        return
      }

      const accounts = await window.okxwallet.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        const account = accounts[0]
        setAddress(formatAddress(account))
        setConnectedWallet("OKX Wallet")
        onConnect(true)

        try {
          await window.okxwallet.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x1" }],
          })
        } catch (switchError: any) {
          console.log("Network switch error:", switchError)
        }
      }
    } catch (error: any) {
      console.error("Error connecting to OKX Wallet:", error)
      if (error.code === 4001) {
        setError("Connection rejected by user")
      } else {
        setError("Failed to connect to OKX Wallet")
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const connectWalletConnect = async () => {
    setIsConnecting(true)
    setError("")

    try {
      // For now, show a message that WalletConnect integration is in progress
      setError(
        "WalletConnect integration is being finalized. Please use MetaMask or OKX Wallet for the best experience.",
      )
      setTimeout(() => setError(""), 5000)

      // TODO: Implement full WalletConnect v2 integration
      // const { EthereumProvider } = await import("@walletconnect/ethereum-provider")
      // const provider = await EthereumProvider.init({
      //   projectId: "your-project-id",
      //   chains: [1],
      //   showQrModal: true
      // })
      // await provider.connect()
      // const accounts = await provider.request({ method: "eth_accounts" })
      // if (accounts.length > 0) {
      //   const account = accounts[0]
      //   setAddress(formatAddress(account))
      //   setConnectedWallet("WalletConnect")
      //   onConnect(true)
      // }
    } catch (error: any) {
      console.error("Error with WalletConnect:", error)
      setError("WalletConnect setup in progress. Please use MetaMask or OKX Wallet.")
      setTimeout(() => setError(""), 3000)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setAddress("")
    setConnectedWallet("")
    onConnect(false)
    setError("")
  }

  if (error) {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Wallet className="h-4 w-4" />
            <span className="font-mono">{address}</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              {connectedWallet}
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
        <Button className="flex items-center gap-2" disabled={isConnecting}>
          <Wallet className="h-4 w-4" />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleConnect("metamask")}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            MetaMask
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleConnect("okx")}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-black rounded"></div>
            OKX Wallet
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleConnect("walletconnect")}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            WalletConnect
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
