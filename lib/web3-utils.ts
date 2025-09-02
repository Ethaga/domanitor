import Web3 from 'web3'
import {
  createDomaSmartContractsService,
  DomaSmartContractsService,
  type DomaDomainAsset,
  type TokenizationVoucher,
  type ProofOfContactsVoucher,
  DomaVoucherUtils,
  DOMA_SMART_CONTRACTS,
  DOMA_CHAIN_CONFIG
} from './doma-smart-contracts'

// Legacy contract addresses (kept for backward compatibility)
export const DOMA_CONTRACTS = {
  DOMA_DOMAIN_REGISTRY: DOMA_SMART_CONTRACTS.DOMA_RECORD,
  DOMA_DID_REGISTRY: '0x123d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
  DOMA_TOKEN: '0x456d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
  DOMA_MARKETPLACE: '0x789d35Cc6634C0532925a3b8D4C9db96C4b5Da5e'
}

// Use Doma chain configuration from smart contracts module
export const DOMA_TESTNET_CONFIG = DOMA_CHAIN_CONFIG

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

// Enhanced domain asset using Doma Smart Contracts
export interface DomainAsset extends DomaDomainAsset {
  // Additional legacy fields for backward compatibility
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
  private domaSmartContracts: DomaSmartContractsService
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

    // Initialize Doma Smart Contracts service
    this.domaSmartContracts = createDomaSmartContractsService(provider)

    // Legacy contracts for backward compatibility
    this.domainContract = new this.web3.eth.Contract(DOMAIN_TOKEN_ABI, DOMA_CONTRACTS.DOMA_DOMAIN_REGISTRY)
    this.didContract = new this.web3.eth.Contract(DID_REGISTRY_ABI, DOMA_CONTRACTS.DOMA_DID_REGISTRY)
    this.tokenContract = new this.web3.eth.Contract(ERC20_ABI, DOMA_CONTRACTS.DOMA_TOKEN)
  }

  async isConnectedToDomaTestnet(): Promise<boolean> {
    return await this.domaSmartContracts.isConnectedToDomaTestnet()
  }

  async switchToDomaTestnet(): Promise<boolean> {
    return await this.domaSmartContracts.switchToDomaTestnet()
  }

  // Doma Smart Contracts Operations

  async requestTokenization(
    domains: string[],
    walletAddress: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      // Create tokenization voucher
      const names = domains.map(domain => {
        const dn = (domain || '').trim().toLowerCase()
        const parts = dn.split('.')
        const sld = parts[0]
        const tld = parts.slice(1).join('.')
        if (!sld || !tld) {
          throw new Error('Invalid domain format. Use sld.tld (e.g., example.com)')
        }
        return {
          sld,
          tld,
          registrarIanaId: 1 // Default registrar
        }
      })

      const voucher = DomaVoucherUtils.createTokenizationVoucher(names, walletAddress)

      // In production, this signature would come from the registrar
      const signature = "0x" + "0".repeat(130) // Placeholder signature

      const result = await this.domaSmartContracts.requestTokenization(
        voucher,
        signature,
        walletAddress
      )

      return {
        success: result.success,
        transactionHash: result.transactionHash,
        error: result.error
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Tokenization request failed'
      }
    }
  }

  async claimDomainOwnership(
    tokenId: number,
    walletAddress: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      const proofOfContactsVoucher = DomaVoucherUtils.createProofOfContactsVoucher(
        Date.now() // registrant handle
      )

      // In production, this signature would come from the proof storage
      const signature = "0x" + "0".repeat(130) // Placeholder signature

      const result = await this.domaSmartContracts.claimOwnership(
        tokenId,
        false, // isSynthetic
        proofOfContactsVoucher,
        signature,
        walletAddress
      )

      return {
        success: result.success,
        transactionHash: result.transactionHash,
        error: result.error
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Claim ownership failed'
      }
    }
  }

  async bridgeDomain(
    tokenId: number,
    targetChainId: string,
    targetOwnerAddress: string,
    walletAddress: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      const result = await this.domaSmartContracts.bridge(
        tokenId,
        false, // isSynthetic
        targetChainId,
        targetOwnerAddress,
        walletAddress
      )

      return {
        success: result.success,
        transactionHash: result.transactionHash,
        error: result.error
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bridge failed'
      }
    }
  }

  async requestDetokenization(
    tokenId: number,
    walletAddress: string
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      const result = await this.domaSmartContracts.requestDetokenization(
        tokenId,
        false, // isSynthetic
        walletAddress
      )

      return {
        success: result.success,
        transactionHash: result.transactionHash,
        error: result.error
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Detokenization failed'
      }
    }
  }

  async getDomainAssets(walletAddress: string): Promise<DomainAsset[]> {
    try {
      console.log('[DomaWeb3] Fetching domain assets using Doma Smart Contracts API')

      // Use the new Doma Smart Contracts service
      const domaAssets = await this.domaSmartContracts.getDomainAssets(walletAddress)

      // Convert to legacy format for backward compatibility
      return domaAssets.map(asset => ({
        ...asset,
        registrar: `IANA ID: ${asset.registrarIanaId}` // Convert IANA ID to registrar name
      }))
    } catch (error) {
      console.error('[DomaWeb3] Error fetching domain assets via Smart Contracts API:', error)

      // Fallback to enhanced simulated data with Doma-specific fields
      return [
        {
          tokenId: "1",
          name: "ethaga.ai",
          sld: "ethaga",
          tld: "ai",
          expirationDate: "2027-07-04T00:00:00Z",
          registrar: "D3 Registrar",
          registrarIanaId: 1,
          isActive: true,
          isTransferLocked: false,
          isSynthetic: false,
          tokenizedValue: "0.5",
          owner: walletAddress
        },
        {
          tokenId: "2",
          name: "ethaga.io",
          sld: "ethaga",
          tld: "io",
          expirationDate: "2026-07-04T00:00:00Z",
          registrar: "D3 Registrar",
          registrarIanaId: 1,
          isActive: true,
          isTransferLocked: false,
          isSynthetic: false,
          tokenizedValue: "0.3",
          owner: walletAddress
        },
        {
          tokenId: "3",
          name: "ethaga.com",
          sld: "ethaga",
          tld: "com",
          expirationDate: "2026-07-04T00:00:00Z",
          registrar: "D3 Registrar",
          registrarIanaId: 1,
          isActive: true,
          isTransferLocked: false,
          isSynthetic: false,
          tokenizedValue: "0.8",
          owner: walletAddress
        },
        {
          tokenId: "4",
          name: "ethaga.ape",
          sld: "ethaga",
          tld: "ape",
          expirationDate: "2026-07-04T00:00:00Z",
          registrar: "D3 Registrar",
          registrarIanaId: 1,
          isActive: true,
          isTransferLocked: false,
          isSynthetic: false,
          tokenizedValue: "0.2",
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
      // Subscribe to Doma Smart Contracts events
      await this.domaSmartContracts.subscribeToEvents(walletAddress, callback)

      // Legacy event subscriptions for backward compatibility
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
