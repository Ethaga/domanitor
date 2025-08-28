// web3-utils.ts
// ...existing imports

// Add method for connecting wallet and switching to Doma testnet
async connectWalletAndSwitchToDomaTestnet(): Promise<string | null> {
  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      // Request accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      // Attempt to switch network
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x17d74',
          chainName: 'Doma Testnet',
          nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: ['https://rpc-testnet.doma.xyz/'],
          blockExplorerUrls: ['https://explorer-testnet.doma.xyz']
        }]
      })
      return accounts[0] || null
    } catch (error) {
      console.error('[Web3Utils] Error connecting wallet or switching network:', error)
      return null
    }
  }
  return null
}

// Proxy to smart contracts for domains and assets
async getOwnedDomainsAndBalance(address: string): Promise<{ domains: any[], ethBalance: string }> {
  const domains = await this.domaSmartContracts.getDomainAssets(address)
  const ethBalance = await this.domaSmartContracts.getEthBalance(address)
  return { domains, ethBalance }
}

// ...rest of the file unchanged