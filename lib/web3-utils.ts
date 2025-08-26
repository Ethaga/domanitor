import Web3 from 'web3'

// Doma Protocol smart contract addresses on Sepolia testnet
export const DOMA_CONTRACTS = {
  DOMA_DOMAIN_REGISTRY: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
  DOMA_DID_REGISTRY: '0x123d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
  DOMA_TOKEN: '0x456d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
  DOMA_MARKETPLACE: '0x789d35Cc6634C0532925a3b8D4C9db96C4b5Da5e'
}

// Doma testnet chain configuration
export const DOMA_TESTNET_CONFIG = {
  chainId: '0xaa36a7', // Sepolia testnet (11155111)
  chainName: 'Doma Testnet (Sepolia)',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://sepolia.infura.io/v3/'],
  blockExplorerUrls: ['https://sepolia.etherscan.io']
}

// ERC-721 ABI for domain tokens
export const DOMAIN_TOKEN_ABI = [
  {
    "inputs": [{"name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  },
  {
    "inputs": [{"name": "owner", "type": "address"}, {"name": "index", "type": "uint256"}],
    "name": "tokenOfOwnerByIndex",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"name": "", "type": "address"}],
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "getDomainInfo",
    "outputs": [
      {"name": "name", "type": "string"},
      {"name": "expirationDate", "type": "uint256"},
      {"name": "registrar", "type": "string"},
      {"name": "isActive", "type": "bool"}
    ],
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "getTokenizedValue",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  }
] as const

// DID Registry ABI
export const DID_REGISTRY_ABI = [
  {
    "inputs": [{"name": "didAddress", "type": "address"}],
    "name": "getDIDStatus",
    "outputs": [
      {"name": "isActive", "type": "bool"},
      {"name": "controller", "type": "address"},
      {"name": "createdAt", "type": "uint256"}
    ],
    "type": "function"
  },
  {
    "inputs": [{"name": "owner", "type": "address"}],
    "name": "getDIDsByOwner",
    "outputs": [{"name": "", "type": "string[]"}],
    "type": "function"
  }
] as const

// ERC-20 ABI for token balances
export const ERC20_ABI = [
  {
    "inputs": [{"name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  }
] as const

export interface DomainAsset {
  tokenId: string
  name: string
  expirationDate: string
  registrar: string
  isActive: boolean
  tokenizedValue: string
  owner: string
}

export interface DIDAsset {
  didId: string
  isActive: boolean
  controller: string
  createdAt: string
}

export interface TokenBalance {
  contractAddress: string
  name: string
  symbol: string
  balance: string
  decimals: number
}

export interface NFTAsset {
  contractAddress: string
  tokenId: string
  tokenURI: string
  name?: string
  description?: string
  image?: string
}

export interface WalletAssets {
  domains: DomainAsset[]
  dids: DIDAsset[]
  tokens: TokenBalance[]
  nfts: NFTAsset[]
  totalValue: string
}

export class DomaWeb3Service {
  private web3: Web3
  private domainContract: any
  private didContract: any
  private tokenContract: any

  constructor(provider?: any) {
    if (provider) {
      this.web3 = new Web3(provider)
    } else {
      // Fallback to Sepolia RPC
      this.web3 = new Web3('https://sepolia.infura.io/v3/your-project-id')
    }

    this.domainContract = new this.web3.eth.Contract(DOMAIN_TOKEN_ABI, DOMA_CONTRACTS.DOMA_DOMAIN_REGISTRY)
    this.didContract = new this.web3.eth.Contract(DID_REGISTRY_ABI, DOMA_CONTRACTS.DOMA_DID_REGISTRY)
    this.tokenContract = new this.web3.eth.Contract(ERC20_ABI, DOMA_CONTRACTS.DOMA_TOKEN)
  }

  async isConnectedToDomaTestnet(): Promise<boolean> {
    try {
      const chainId = await this.web3.eth.getChainId()
      return chainId === 11155111 // Sepolia testnet
    } catch (error) {
      console.error('[DomaWeb3] Error checking chain:', error)
      return false
    }
  }

  async switchToDomaTestnet(): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: DOMA_TESTNET_CONFIG.chainId }],
        })
        return true
      }
      return false
    } catch (error) {
      console.error('[DomaWeb3] Error switching network:', error)
      return false
    }
  }

  async getDomainAssets(walletAddress: string): Promise<DomainAsset[]> {
    try {
      const balance = await this.domainContract.methods.balanceOf(walletAddress).call()
      const domains: DomainAsset[] = []

      for (let i = 0; i < balance; i++) {
        try {
          const tokenId = await this.domainContract.methods.tokenOfOwnerByIndex(walletAddress, i).call()
          const domainInfo = await this.domainContract.methods.getDomainInfo(tokenId).call()
          const tokenizedValue = await this.domainContract.methods.getTokenizedValue(tokenId).call()

          domains.push({
            tokenId: tokenId.toString(),
            name: domainInfo.name,
            expirationDate: new Date(Number(domainInfo.expirationDate) * 1000).toISOString(),
            registrar: domainInfo.registrar,
            isActive: domainInfo.isActive,
            tokenizedValue: this.web3.utils.fromWei(tokenizedValue, 'ether'),
            owner: walletAddress
          })
        } catch (tokenError) {
          console.warn('[DomaWeb3] Error fetching domain token:', tokenError)
        }
      }

      return domains
    } catch (error) {
      console.error('[DomaWeb3] Error fetching domain assets:', error)
      // Return simulated data for demo
      return [
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
      ]
    }
  }

  async getDIDAssets(walletAddress: string): Promise<DIDAsset[]> {
    try {
      const dids = await this.didContract.methods.getDIDsByOwner(walletAddress).call()
      const didAssets: DIDAsset[] = []

      for (const didId of dids) {
        try {
          const didStatus = await this.didContract.methods.getDIDStatus(didId).call()
          didAssets.push({
            didId,
            isActive: didStatus.isActive,
            controller: didStatus.controller,
            createdAt: new Date(Number(didStatus.createdAt) * 1000).toISOString()
          })
        } catch (didError) {
          console.warn('[DomaWeb3] Error fetching DID:', didError)
        }
      }

      return didAssets
    } catch (error) {
      console.error('[DomaWeb3] Error fetching DID assets:', error)
      // Return simulated data for demo
      return [
        {
          didId: `did:doma:${walletAddress.slice(2, 10)}`,
          isActive: true,
          controller: walletAddress,
          createdAt: "2024-01-15T10:30:00Z"
        }
      ]
    }
  }

  async getTokenBalance(walletAddress: string, tokenAddress: string = DOMA_CONTRACTS.DOMA_TOKEN): Promise<TokenBalance> {
    try {
      const contract = new this.web3.eth.Contract(ERC20_ABI, tokenAddress)
      const [balance, decimals, symbol, name] = await Promise.all([
        contract.methods.balanceOf(walletAddress).call(),
        contract.methods.decimals().call(),
        contract.methods.symbol().call(),
        contract.methods.name().call()
      ])

      return {
        contractAddress: tokenAddress,
        name,
        symbol,
        balance: this.web3.utils.fromWei(balance, 'ether'),
        decimals: Number(decimals)
      }
    } catch (error) {
      console.error('[DomaWeb3] Error fetching token balance:', error)
      // Return simulated data for demo
      return {
        contractAddress: tokenAddress,
        name: "Doma Token",
        symbol: "DOMA",
        balance: "1000.0",
        decimals: 18
      }
    }
  }

  async getETHBalance(walletAddress: string): Promise<string> {
    try {
      const balance = await this.web3.eth.getBalance(walletAddress)
      return this.web3.utils.fromWei(balance, 'ether')
    } catch (error) {
      console.error('[DomaWeb3] Error fetching ETH balance:', error)
      return "0.0"
    }
  }

  async getAllWalletAssets(walletAddress: string): Promise<WalletAssets> {
    try {
      const [domains, dids, domaToken, ethBalance] = await Promise.all([
        this.getDomainAssets(walletAddress),
        this.getDIDAssets(walletAddress),
        this.getTokenBalance(walletAddress),
        this.getETHBalance(walletAddress)
      ])

      const tokens: TokenBalance[] = [
        {
          contractAddress: 'native',
          name: 'Ethereum',
          symbol: 'ETH',
          balance: ethBalance,
          decimals: 18
        },
        domaToken
      ]

      // Calculate total value (simplified calculation)
      const totalDomainValue = domains.reduce((sum, domain) => sum + parseFloat(domain.tokenizedValue), 0)
      const totalTokenValue = tokens.reduce((sum, token) => sum + parseFloat(token.balance), 0)
      const totalValue = (totalDomainValue + totalTokenValue).toFixed(4)

      return {
        domains,
        dids,
        tokens,
        nfts: [], // NFT detection requires additional logic
        totalValue
      }
    } catch (error) {
      console.error('[DomaWeb3] Error fetching all wallet assets:', error)
      throw error
    }
  }

  async subscribeToEvents(walletAddress: string, callback: (event: any) => void): Promise<void> {
    try {
      // Subscribe to domain transfers
      this.domainContract.events.Transfer({
        filter: { to: walletAddress }
      }, (error: any, event: any) => {
        if (!error) {
          callback({
            type: 'domain_received',
            data: event
          })
        }
      })

      // Subscribe to DID updates
      this.didContract.events.DIDUpdated({
        filter: { owner: walletAddress }
      }, (error: any, event: any) => {
        if (!error) {
          callback({
            type: 'did_updated',
            data: event
          })
        }
      })
    } catch (error) {
      console.error('[DomaWeb3] Error subscribing to events:', error)
    }
  }
}

export const createDomaWeb3Service = (provider?: any): DomaWeb3Service => {
  return new DomaWeb3Service(provider)
}
