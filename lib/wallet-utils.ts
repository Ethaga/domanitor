export interface WalletProvider {
  name: string
  icon: string
  isInstalled: () => boolean
  connect: () => Promise<string[]>
  disconnect: () => Promise<void>
  switchNetwork: (chainId: string) => Promise<void>
}

import { DOMA_CHAIN_CONFIG } from './doma-smart-contracts'

export const detectWallets = (): WalletProvider[] => {
  const wallets: WalletProvider[] = []

  if (typeof window !== "undefined" && window.ethereum && !window.ethereum.isOkxWallet) {
    wallets.push({
      name: "MetaMask",
      icon: "🦊",
      isInstalled: () => !!window.ethereum,
      connect: async () => {
        return await window.ethereum.request({ method: "eth_requestAccounts" })
      },
      disconnect: async () => {},
      switchNetwork: async (chainId: string) => {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId }],
          })
        } catch (err: any) {
          if (err?.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{
                chainId: DOMA_CHAIN_CONFIG.chainId,
                chainName: DOMA_CHAIN_CONFIG.chainName,
                nativeCurrency: DOMA_CHAIN_CONFIG.nativeCurrency,
                rpcUrls: DOMA_CHAIN_CONFIG.rpcUrls,
                blockExplorerUrls: DOMA_CHAIN_CONFIG.blockExplorerUrls,
              }],
            })
          } else {
            throw err
          }
        }
      },
    })
  }

  if (typeof window !== "undefined" && window.okxwallet) {
    wallets.push({
      name: "OKX Wallet",
      icon: "⚫",
      isInstalled: () => !!window.okxwallet,
      connect: async () => {
        return await window.okxwallet.request({ method: "eth_requestAccounts" })
      },
      disconnect: async () => {},
      switchNetwork: async (chainId: string) => {
        try {
          await window.okxwallet.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId }],
          })
        } catch (err: any) {
          if (err?.code === 4902) {
            await window.okxwallet.request({
              method: "wallet_addEthereumChain",
              params: [{
                chainId: DOMA_CHAIN_CONFIG.chainId,
                chainName: DOMA_CHAIN_CONFIG.chainName,
                nativeCurrency: DOMA_CHAIN_CONFIG.nativeCurrency,
                rpcUrls: DOMA_CHAIN_CONFIG.rpcUrls,
                blockExplorerUrls: DOMA_CHAIN_CONFIG.blockExplorerUrls,
              }],
            })
          } else {
            throw err
          }
        }
      },
    })
  }

  return wallets
}

export const formatWalletAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
