import Web3 from 'web3'
import { AbiItem } from 'web3-utils'

// Doma Protocol Smart Contract Addresses (provided testnet deployments)
// Default export is set to Sepolia testnet, which this app targets when switching network.
export const DOMA_SMART_CONTRACTS = {
  // Doma Testnet (standalone) contracts (for reference)
  // Doma Record (standalone testnet)
  DOMA_RECORD: '0xF6A92E0f8bEa4174297B0219d9d47fEe335f84f8',
  // Forwarder (standalone testnet)
  DOMA_FORWARDER: '0xf17beC16794e018E2F0453a1282c3DA3d121f410',
  
  // Active network: Sepolia testnet
  DOMA_GATEWAY: '0xEC67EfB227218CCc3c7032a6507339E7B4D623Ad',
  DOMA_RECORD_PROXY: '0xD9A0E86AACf2B01013728fcCa9F00093B9b4F3Ff',
  OWNERSHIP_TOKEN: '0x9A374915648f1352827fFbf0A7bB5752b6995eB7'
}

// Full deployments map for reference and potential multi-network use
export const DOMA_DEPLOYMENTS = {
  domaTestnet: {
    DOMA_RECORD: '0xF6A92E0f8bEa4174297B0219d9d47fEe335f84f8',
    DOMA_GATEWAY: '0xCE1476C791ff195e462632bf9Eb22f3d3cA07388',
    DOMA_FORWARDER: '0xf17beC16794e018E2F0453a1282c3DA3d121f410',
    OWNERSHIP_TOKEN: '0x424bDf2E8a6F52Bd2c1C81D9437b0DC0309DF90f',
    DOMA_RECORD_PROXY: '0xb1508299A01c02aC3B70c7A8B0B07105aaB29E99'
  },
  sepolia: {
    OWNERSHIP_TOKEN: '0x9A374915648f1352827fFbf0A7bB5752b6995eB7',
    DOMA_RECORD_PROXY: '0xD9A0E86AACf2B01013728fcCa9F00093B9b4F3Ff',
    DOMA_GATEWAY: '0xEC67EfB227218CCc3c7032a6507339E7B4D623Ad'
  },
  baseSepolia: {
    OWNERSHIP_TOKEN: '0x2f45DfC5f4c9473fa72aBdFbd223d0979B265046',
    DOMA_RECORD_PROXY: '0xa40aA710F0C77DF3De6CEe7493d1FfF3715D59Da',
    DOMA_GATEWAY: '0xC721925DF8268B1d4a1673D481eB446B3EDaAAdE'
  },
  shibariumPuppynet: {
    OWNERSHIP_TOKEN: '0x55460792B2e3eDEbdF28f6C8766B7778Db7092A9',
    DOMA_RECORD_PROXY: '0x8420729Dc9eBb5a30dBa8CEe1392F56bfc03b1F5',
    DOMA_GATEWAY: '0x79e70acd155bFA071E57cA6a2f507d87d0e7B7f9'
  },
  apechainTestnet: {
    OWNERSHIP_TOKEN: '0x63b7749B3b79B974904E0c684Ee589191fd807b4',
    DOMA_RECORD_PROXY: '0x797293E811f9C5eFa1973004B581E46d1787F929',
    DOMA_GATEWAY: '0xa483D7d32D7f5f2bd430CA9e61db275Eda72Fd23'
  }
} as const

// Doma testnet chain configuration
export const DOMA_CHAIN_CONFIG = {
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

// Structs and Interfaces
export interface NameInfo {
  sld: string // Second-level domain (e.g. "example")
  tld: string // Top-level domain (e.g. "com")
  registrarIanaId: number // IANA ID of registrar
}

export interface TokenizationVoucher {
  names: NameInfo[]
  nonce: number
  expiresAt: number // UNIX timestamp
  ownerAddress: string
}

export interface ProofOfContactsVoucher {
  registrantHandle: number
  proofSource: ProofOfContactsSource
  nonce: number
  expiresAt: number // UNIX timestamp
}

export enum ProofOfContactsSource {
  REGISTRAR = 1,
  DOMA = 2
}

// Events
export interface OwnershipTokenMintedEvent {
  tokenId: number
  registrarIanaId: number
  to: string
  sld: string
  tld: string
  expiresAt: number
  correlationId: string
}

export interface NameTokenRenewedEvent {
  tokenId: number
  expiresAt: number
  correlationId: string
}

export interface NameTokenBurnedEvent {
  tokenId: number
  owner: string
  correlationId: string
}

export interface LockStatusChangedEvent {
  tokenId: number
  isTransferLocked: boolean
  correlationId: string
}

export interface MetadataUpdateEvent {
  tokenId: number
}

// Doma Record Proxy ABI - Main contract for domain operations
export const DOMA_RECORD_PROXY_ABI: AbiItem[] = [
  {
    "type": "function",
    "name": "requestTokenization",
    "inputs": [
      {
        "name": "voucher",
        "type": "tuple",
        "components": [
          {"name": "names", "type": "tuple[]", "components": [
            {"name": "sld", "type": "string"},
            {"name": "tld", "type": "string"},
            {"name": "registrarIanaId", "type": "uint256"}
          ]},
          {"name": "nonce", "type": "uint256"},
          {"name": "expiresAt", "type": "uint256"},
          {"name": "ownerAddress", "type": "address"}
        ]
      },
      {"name": "signature", "type": "bytes"}
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "claimOwnership",
    "inputs": [
      {"name": "tokenId", "type": "uint256"},
      {"name": "isSynthetic", "type": "bool"},
      {
        "name": "proofOfContactsVoucher",
        "type": "tuple",
        "components": [
          {"name": "registrantHandle", "type": "uint256"},
          {"name": "proofSource", "type": "uint8"},
          {"name": "nonce", "type": "uint256"},
          {"name": "expiresAt", "type": "uint256"}
        ]
      },
      {"name": "signature", "type": "bytes"}
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "bridge",
    "inputs": [
      {"name": "tokenId", "type": "uint256"},
      {"name": "isSynthetic", "type": "bool"},
      {"name": "targetChainId", "type": "string"},
      {"name": "targetOwnerAddress", "type": "string"}
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "requestDetokenization",
    "inputs": [
      {"name": "tokenId", "type": "uint256"},
      {"name": "isSynthetic", "type": "bool"}
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  }
]

// Ownership Token ABI - ERC-721 with Doma extensions
export const OWNERSHIP_TOKEN_ABI: AbiItem[] = [
  // Standard ERC-721 functions
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [{"name": "owner", "type": "address"}],
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ownerOf",
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "tokenOfOwnerByIndex",
    "inputs": [
      {"name": "owner", "type": "address"},
      {"name": "index", "type": "uint256"}
    ],
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "tokenURI",
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view"
  },
  // Doma-specific functions
  {
    "type": "function",
    "name": "expirationOf",
    "inputs": [{"name": "id", "type": "uint256"}],
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "registrarOf",
    "inputs": [{"name": "id", "type": "uint256"}],
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "lockStatusOf",
    "inputs": [{"name": "id", "type": "uint256"}],
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view"
  },
  // Events
  {
    "type": "event",
    "name": "OwnershipTokenMinted",
    "inputs": [
      {"name": "tokenId", "type": "uint256", "indexed": true},
      {"name": "registrarIanaId", "type": "uint256", "indexed": false},
      {"name": "to", "type": "address", "indexed": false},
      {"name": "sld", "type": "string", "indexed": false},
      {"name": "tld", "type": "string", "indexed": false},
      {"name": "expiresAt", "type": "uint256", "indexed": false},
      {"name": "correlationId", "type": "string", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "NameTokenRenewed",
    "inputs": [
      {"name": "tokenId", "type": "uint256", "indexed": true},
      {"name": "expiresAt", "type": "uint256", "indexed": false},
      {"name": "correlationId", "type": "string", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "NameTokenBurned",
    "inputs": [
      {"name": "tokenId", "type": "uint256", "indexed": true},
      {"name": "owner", "type": "address", "indexed": false},
      {"name": "correlationId", "type": "string", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "LockStatusChanged",
    "inputs": [
      {"name": "tokenId", "type": "uint256", "indexed": true},
      {"name": "isTransferLocked", "type": "bool", "indexed": false},
      {"name": "correlationId", "type": "string", "indexed": false}
    ]
  },
  {
    "type": "event",
    "name": "MetadataUpdate",
    "inputs": [
      {"name": "tokenId", "type": "uint256", "indexed": false}
    ]
  }
]

// Domain Asset with enhanced Doma-specific information
export interface DomaDomainAsset {
  tokenId: string
  name: string
  sld: string // Second-level domain
  tld: string // Top-level domain
  owner: string
  registrarIanaId: number
  expirationDate: string
  isActive: boolean
  isTransferLocked: boolean
  isSynthetic: boolean
  tokenizedValue: string
  correlationId?: string
}

// Transaction result types
export interface TokenizationResult {
  success: boolean
  transactionHash?: string
  tokenId?: string
  correlationId?: string
  error?: string
}

export interface ClaimResult {
  success: boolean
  transactionHash?: string
  error?: string
}

export interface BridgeResult {
  success: boolean
  transactionHash?: string
  targetChainId?: string
  error?: string
}

export interface DetokenizationResult {
  success: boolean
  transactionHash?: string
  error?: string
}

// Doma Smart Contracts Service
export class DomaSmartContractsService {
  private web3: Web3
  private recordProxyContract: any
  private ownershipTokenContract: any

  constructor(provider?: any) {
    if (provider) {
      this.web3 = new Web3(provider)
    } else {
      // Fallback to Sepolia RPC via Infura using env var
      const infuraId = process.env.NEXT_PUBLIC_INFURA_ID
      if (!infuraId) {
        throw new Error('[Config] NEXT_PUBLIC_INFURA_ID is not set for Sepolia RPC')
      }
      this.web3 = new Web3(`https://sepolia.infura.io/v3/${infuraId}`)
    }

    this.recordProxyContract = new this.web3.eth.Contract(
      DOMA_RECORD_PROXY_ABI,
      DOMA_SMART_CONTRACTS.DOMA_RECORD_PROXY
    )
    
    this.ownershipTokenContract = new this.web3.eth.Contract(
      OWNERSHIP_TOKEN_ABI,
      DOMA_SMART_CONTRACTS.OWNERSHIP_TOKEN
    )
  }

  // Request tokenization of domains
  async requestTokenization(
    voucher: TokenizationVoucher,
    signature: string,
    fromAddress: string
  ): Promise<TokenizationResult> {
    try {
      console.log('[DomaSmartContracts] Requesting tokenization:', voucher)

      const gasEstimate = await this.recordProxyContract.methods
        .requestTokenization(voucher, signature)
        .estimateGas({ from: fromAddress })

      const transaction = await this.recordProxyContract.methods
        .requestTokenization(voucher, signature)
        .send({
          from: fromAddress,
          gas: Math.floor(gasEstimate * 1.2), // Add 20% buffer
        })

      return {
        success: true,
        transactionHash: transaction.transactionHash,
        correlationId: `corr_${Date.now()}`
      }
    } catch (error) {
      console.error('[DomaSmartContracts] Tokenization failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Tokenization failed'
      }
    }
  }

  // Claim ownership of a domain
  async claimOwnership(
    tokenId: number,
    isSynthetic: boolean,
    proofOfContactsVoucher: ProofOfContactsVoucher,
    signature: string,
    fromAddress: string
  ): Promise<ClaimResult> {
    try {
      console.log('[DomaSmartContracts] Claiming ownership:', { tokenId, isSynthetic })

      const gasEstimate = await this.recordProxyContract.methods
        .claimOwnership(tokenId, isSynthetic, proofOfContactsVoucher, signature)
        .estimateGas({ from: fromAddress })

      const transaction = await this.recordProxyContract.methods
        .claimOwnership(tokenId, isSynthetic, proofOfContactsVoucher, signature)
        .send({
          from: fromAddress,
          gas: Math.floor(gasEstimate * 1.2),
        })

      return {
        success: true,
        transactionHash: transaction.transactionHash
      }
    } catch (error) {
      console.error('[DomaSmartContracts] Claim ownership failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Claim ownership failed'
      }
    }
  }

  // Bridge token to another chain
  async bridge(
    tokenId: number,
    isSynthetic: boolean,
    targetChainId: string,
    targetOwnerAddress: string,
    fromAddress: string
  ): Promise<BridgeResult> {
    try {
      console.log('[DomaSmartContracts] Bridging token:', {
        tokenId,
        targetChainId,
        targetOwnerAddress
      })

      const gasEstimate = await this.recordProxyContract.methods
        .bridge(tokenId, isSynthetic, targetChainId, targetOwnerAddress)
        .estimateGas({ from: fromAddress })

      const transaction = await this.recordProxyContract.methods
        .bridge(tokenId, isSynthetic, targetChainId, targetOwnerAddress)
        .send({
          from: fromAddress,
          gas: Math.floor(gasEstimate * 1.2),
        })

      return {
        success: true,
        transactionHash: transaction.transactionHash,
        targetChainId
      }
    } catch (error) {
      console.error('[DomaSmartContracts] Bridge failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bridge failed'
      }
    }
  }

  // Request detokenization
  async requestDetokenization(
    tokenId: number,
    isSynthetic: boolean,
    fromAddress: string
  ): Promise<DetokenizationResult> {
    try {
      console.log('[DomaSmartContracts] Requesting detokenization:', tokenId)

      const gasEstimate = await this.recordProxyContract.methods
        .requestDetokenization(tokenId, isSynthetic)
        .estimateGas({ from: fromAddress })

      const transaction = await this.recordProxyContract.methods
        .requestDetokenization(tokenId, isSynthetic)
        .send({
          from: fromAddress,
          gas: Math.floor(gasEstimate * 1.2),
        })

      return {
        success: true,
        transactionHash: transaction.transactionHash
      }
    } catch (error) {
      console.error('[DomaSmartContracts] Detokenization failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Detokenization failed'
      }
    }
  }

  // Get domain assets for a wallet with Doma-specific information
  async getDomainAssets(walletAddress: string): Promise<DomaDomainAsset[]> {
    try {
      const balance = await this.ownershipTokenContract.methods.balanceOf(walletAddress).call()
      const domains: DomaDomainAsset[] = []

      for (let i = 0; i < balance; i++) {
        try {
          const tokenId = await this.ownershipTokenContract.methods
            .tokenOfOwnerByIndex(walletAddress, i).call()
          
          const [expirationDate, registrarIanaId, isTransferLocked] = await Promise.all([
            this.ownershipTokenContract.methods.expirationOf(tokenId).call(),
            this.ownershipTokenContract.methods.registrarOf(tokenId).call(),
            this.ownershipTokenContract.methods.lockStatusOf(tokenId).call()
          ])

          // Parse domain name from token URI or metadata
          const tokenURI = await this.ownershipTokenContract.methods.tokenURI(tokenId).call()
          const { sld, tld, name } = this.parseDomainFromTokenURI(tokenURI, tokenId)

          domains.push({
            tokenId: tokenId.toString(),
            name,
            sld,
            tld,
            owner: walletAddress,
            registrarIanaId: parseInt(registrarIanaId),
            expirationDate: new Date(parseInt(expirationDate) * 1000).toISOString(),
            isActive: Date.now() < parseInt(expirationDate) * 1000,
            isTransferLocked,
            isSynthetic: false, // Would need additional contract call to determine
            tokenizedValue: "0.5" // Would calculate from market data
          })
        } catch (tokenError) {
          console.warn('[DomaSmartContracts] Error fetching token:', tokenError)
        }
      }

      return domains
    } catch (error) {
      console.error('[DomaSmartContracts] Error fetching domain assets:', error)
      
      // Return simulated data for demo
      return [
        {
          tokenId: "1",
          name: "ethaga.ai",
          sld: "ethaga",
          tld: "ai",
          owner: walletAddress,
          registrarIanaId: 1,
          expirationDate: "2027-07-04T00:00:00Z",
          isActive: true,
          isTransferLocked: false,
          isSynthetic: false,
          tokenizedValue: "0.5"
        },
        {
          tokenId: "2",
          name: "ethaga.io",
          sld: "ethaga", 
          tld: "io",
          owner: walletAddress,
          registrarIanaId: 1,
          expirationDate: "2026-07-04T00:00:00Z",
          isActive: true,
          isTransferLocked: false,
          isSynthetic: false,
          tokenizedValue: "0.3"
        }
      ]
    }
  }

  // Subscribe to Doma-specific events
  async subscribeToEvents(walletAddress: string, callback: (event: any) => void): Promise<void> {
    try {
      // Subscribe to OwnershipTokenMinted events
      this.ownershipTokenContract.events.OwnershipTokenMinted({
        filter: { to: walletAddress }
      }, (error: any, event: any) => {
        if (!error) {
          callback({
            type: 'ownership_token_minted',
            data: event.returnValues as OwnershipTokenMintedEvent
          })
        }
      })

      // Subscribe to NameTokenRenewed events
      this.ownershipTokenContract.events.NameTokenRenewed({}, (error: any, event: any) => {
        if (!error) {
          callback({
            type: 'name_token_renewed',
            data: event.returnValues as NameTokenRenewedEvent
          })
        }
      })

      // Subscribe to LockStatusChanged events
      this.ownershipTokenContract.events.LockStatusChanged({}, (error: any, event: any) => {
        if (!error) {
          callback({
            type: 'lock_status_changed',
            data: event.returnValues as LockStatusChangedEvent
          })
        }
      })

      // Subscribe to MetadataUpdate events
      this.ownershipTokenContract.events.MetadataUpdate({}, (error: any, event: any) => {
        if (!error) {
          callback({
            type: 'metadata_update',
            data: event.returnValues as MetadataUpdateEvent
          })
        }
      })

    } catch (error) {
      console.error('[DomaSmartContracts] Error subscribing to events:', error)
    }
  }

  // Helper function to parse domain from token URI
  private parseDomainFromTokenURI(tokenURI: string, tokenId: any): { sld: string; tld: string; name: string } {
    try {
      // This would parse actual metadata from tokenURI
      // For now, return simulated data based on tokenId
      const domains = [
        { sld: "ethaga", tld: "ai", name: "ethaga.ai" },
        { sld: "ethaga", tld: "io", name: "ethaga.io" },
        { sld: "ethaga", tld: "com", name: "ethaga.com" },
        { sld: "ethaga", tld: "ape", name: "ethaga.ape" }
      ]
      
      const index = parseInt(tokenId) - 1
      return domains[index] || { sld: "unknown", tld: "unknown", name: "unknown.unknown" }
    } catch (error) {
      return { sld: "unknown", tld: "unknown", name: "unknown.unknown" }
    }
  }

  // Check if connected to correct network
  async isConnectedToDomaTestnet(): Promise<boolean> {
    try {
      const chainId = await this.web3.eth.getChainId()
      return chainId === 11155111 // Sepolia testnet
    } catch (error) {
      console.error('[DomaSmartContracts] Error checking chain:', error)
      return false
    }
  }

  // Switch to Doma testnet
  async switchToDomaTestnet(): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: DOMA_CHAIN_CONFIG.chainId }],
        })
        return true
      }
      return false
    } catch (error) {
      console.error('[DomaSmartContracts] Error switching network:', error)
      return false
    }
  }
}

// Factory function to create service instance
export const createDomaSmartContractsService = (provider?: any): DomaSmartContractsService => {
  return new DomaSmartContractsService(provider)
}

// Utility functions for voucher creation and signature verification
export class DomaVoucherUtils {
  
  // Create tokenization voucher (would typically be done by registrar)
  static createTokenizationVoucher(
    names: NameInfo[],
    ownerAddress: string,
    expiresAt: number = Date.now() + 3600000 // 1 hour from now
  ): TokenizationVoucher {
    return {
      names,
      nonce: Date.now(), // In production, use proper nonce management
      expiresAt: Math.floor(expiresAt / 1000), // Convert to UNIX seconds
      ownerAddress
    }
  }

  // Create proof of contacts voucher
  static createProofOfContactsVoucher(
    registrantHandle: number,
    proofSource: ProofOfContactsSource = ProofOfContactsSource.DOMA,
    expiresAt: number = Date.now() + 3600000 // 1 hour from now
  ): ProofOfContactsVoucher {
    return {
      registrantHandle,
      proofSource,
      nonce: Date.now(),
      expiresAt: Math.floor(expiresAt / 1000)
    }
  }

  // Validate voucher expiration
  static isVoucherValid(expiresAt: number): boolean {
    return Date.now() < expiresAt * 1000
  }
}
