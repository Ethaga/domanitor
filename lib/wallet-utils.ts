export interface WalletProvider {
  name: string
  icon: string
  isInstalled: () => boolean
  connect: () => Promise<string[]>
  disconnect: () => Promise<void>
  switchNetwork: (chainId: string) => Promise<void>
}

export const detectWallets = (): WalletProvider[] => {
  const wallets: WalletProvider[] = []

  // MetaMask detection
  if (typeof window !== "undefined" && window.ethereum && !window.ethereum.isOkxWallet) {
    wallets.push({
      name: "MetaMask",
      icon: "🦊",
      isInstalled: () => !!window.ethereum,
      connect: async () => {
        return await window.ethereum.request({ method: "eth_requestAccounts" })
      },
      disconnect: async () => {
        // MetaMask doesn't have a disconnect method
      },
      switchNetwork: async (chainId: string) => {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        })
      },
    })
  }

  // OKX Wallet detection
  if (typeof window !== "undefined" && window.okxwallet) {
    wallets.push({
      name: "OKX Wallet",
      icon: "⚫",
      isInstalled: () => !!window.okxwallet,
      connect: async () => {
        return await window.okxwallet.request({ method: "eth_requestAccounts" })
      },
      disconnect: async () => {
        // OKX Wallet disconnect logic
      },
      switchNetwork: async (chainId: string) => {
        await window.okxwallet.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        })
      },
    })
  }

  return wallets
}

export const formatWalletAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
