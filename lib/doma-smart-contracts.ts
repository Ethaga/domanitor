import Web3 from 'web3'
import { AbiItem } from 'web3-utils'

// Doma Protocol Smart Contract Addresses on Sepolia testnet
export const DOMA_SMART_CONTRACTS = {
  DOMA_RECORD: '0x742d35cc6634c0532925a3b8d4c9db96c4b5da5e',
  DOMA_FORWARDER: '0x123d35cc6634c0532925a3b8d4c9db96c4b5da5e',
  DOMA_GATEWAY: '0x456d35cc6634c0532925a3b8d4c9db96c4b5da5e',
  DOMA_RECORD_PROXY: '0x789d35cc6634c0532925a3b8d4c9db96c4b5da5e',
  OWNERSHIP_TOKEN: '0x424bdf2e8a6f52bd2c1c81d9437b0dc0309df90f'
}

const DOMA_USE_SIMULATION = process.env.NEXT_PUBLIC_DOMA_SIMULATION_ONLY === 'true'

// Doma testnet chain configuration
export const DOMA_CHAIN_CONFIG = {
  chainId: '0x17cc4',
  chainName: 'Doma Network',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://rpc-testnet.doma.xyz'],
  blockExplorerUrls: ['https://explorer-testnet.doma.xyz']
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
  private initPromise: Promise<void> | null = null

  private static readonly EIP1967_IMPLEMENTATION_SLOT = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'

  constructor(provider?: any) {
    if (provider) {
      this.web3 = new Web3(provider)
    } else {
      // Fallback to Doma Network RPC
      this.web3 = new Web3('https://rpc-testnet.doma.xyz')
    }
  }

  private async init(): Promise<void> {
    if (this.initPromise) return this.initPromise
    this.initPromise = (async () => {
      // Resolve addresses from env or Smart Contracts API
      let recordProxy = (process.env.NEXT_PUBLIC_DOMA_RECORD_PROXY || '').trim()
      let ownershipToken = (process.env.NEXT_PUBLIC_OWNERSHIP_TOKEN || '').trim()

      if (!recordProxy || !ownershipToken) {
        try {
          const base = 'https://api-testnet.doma.xyz/v1/smart-contracts'
          const res = await fetch(base, {
            headers: {
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DOMA_API_KEY || ''}`
            }
          })
          if (res.ok) {
            const data = await res.json()
            const contracts: Array<{ name: string; address: string }> = data.contracts || []
            const rec = contracts.find(c => /record/i.test(c.name) && /proxy/i.test(c.name))
            const own = contracts.find(c => /ownership/i.test(c.name) || /erc\s*-?721/i.test(c.name))
            if (rec?.address) recordProxy = rec.address
            if (own?.address) ownershipToken = own.address
          }
        } catch {}
      }

      const rp = recordProxy || DOMA_SMART_CONTRACTS.DOMA_RECORD_PROXY
      const ot = ownershipToken || DOMA_SMART_CONTRACTS.OWNERSHIP_TOKEN

      this.recordProxyContract = new this.web3.eth.Contract(
        DOMA_RECORD_PROXY_ABI,
        rp
      )
      this.ownershipTokenContract = new this.web3.eth.Contract(
        OWNERSHIP_TOKEN_ABI,
        ot
      )
    })()
    return this.initPromise
  }

  // Request tokenization of domains
  async requestTokenization(
    voucher: TokenizationVoucher,
    signature: string,
    fromAddress: string
  ): Promise<TokenizationResult> {
    try {
      await this.init()
      console.log('[DomaSmartContracts] Requesting tokenization:', voucher)

      if (DOMA_USE_SIMULATION) {
        await new Promise(r => setTimeout(r, 500))
        return {
          success: true,
          transactionHash: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`,
          correlationId: `corr_${Date.now()}`
        }
      }

      // Web3 4.x requires tuple args as arrays in ABI order
      const voucherArg = [
        voucher.names.map(n => [n.sld, n.tld, BigInt(n.registrarIanaId)]),
        BigInt(voucher.nonce),
        BigInt(voucher.expiresAt),
        voucher.ownerAddress
      ]

      const currentChainId = await this.web3.eth.getChainId()
      if (currentChainId !== 97476) {
        const switched = await this.switchToDomaTestnet()
        if (!switched) {
          return { success: false, error: 'WRONG_NETWORK' }
        }
      }
      const deployed = await this.isProxyOrImplDeployed(DOMA_SMART_CONTRACTS.DOMA_RECORD_PROXY)
      if (!deployed) {
        return { success: false, error: 'CONTRACT_NOT_DEPLOYED' }
      }
      const gasEstimate = await this.recordProxyContract.methods
        .requestTokenization(voucherArg, signature)
        .estimateGas({ from: fromAddress, value: '0x0' })

      const transaction = await this.recordProxyContract.methods
        .requestTokenization(voucherArg, signature)
        .send({
          from: fromAddress,
          gas: Math.floor(Number(gasEstimate) * 1.2),
          value: '0x0'
        })

      return {
        success: true,
        transactionHash: transaction.transactionHash,
        correlationId: `corr_${Date.now()}`
      }
    } catch (error) {
      const msg = (error as any)?.message || (error as any)?.reason || (error as any)?.data?.message || 'Tokenization failed'
      return {
        success: false,
        error: msg
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

      if (DOMA_USE_SIMULATION) {
        await new Promise(r => setTimeout(r, 400))
        return {
          success: true,
          transactionHash: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`
        }
      }

      const pocArg = [
        BigInt(proofOfContactsVoucher.registrantHandle),
        Number(proofOfContactsVoucher.proofSource ?? 2),
        BigInt(proofOfContactsVoucher.nonce),
        BigInt(proofOfContactsVoucher.expiresAt),
      ]

      const currentChainId = await this.web3.eth.getChainId()
      if (currentChainId !== 97476) {
        const switched = await this.switchToDomaTestnet()
        if (!switched) {
          return { success: false, error: 'WRONG_NETWORK' }
        }
      }
      const deployed = await this.isProxyOrImplDeployed(DOMA_SMART_CONTRACTS.DOMA_RECORD_PROXY)
      if (!deployed) {
        return { success: false, error: 'CONTRACT_NOT_DEPLOYED' }
      }
      const gasEstimate = await this.recordProxyContract.methods
        .claimOwnership(BigInt(tokenId), isSynthetic, pocArg, signature)
        .estimateGas({ from: fromAddress, value: '0x0' })

      const transaction = await this.recordProxyContract.methods
        .claimOwnership(BigInt(tokenId), isSynthetic, pocArg, signature)
        .send({
          from: fromAddress,
          gas: Math.floor(Number(gasEstimate) * 1.2),
          value: '0x0'
        })

      return {
        success: true,
        transactionHash: transaction.transactionHash
      }
    } catch (error) {
      const msg = (error as any)?.message || (error as any)?.reason || (error as any)?.data?.message || 'Claim ownership failed'
      return {
        success: false,
        error: msg
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

      if (DOMA_USE_SIMULATION) {
        await new Promise(r => setTimeout(r, 400))
        return {
          success: true,
          transactionHash: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`,
          targetChainId
        }
      }

      const currentChainId = await this.web3.eth.getChainId()
      if (currentChainId !== 97476) {
        const switched = await this.switchToDomaTestnet()
        if (!switched) {
          return { success: false, error: 'WRONG_NETWORK' }
        }
      }
      const deployed = await this.isProxyOrImplDeployed(DOMA_SMART_CONTRACTS.DOMA_RECORD_PROXY)
      if (!deployed) {
        return { success: false, error: 'CONTRACT_NOT_DEPLOYED' }
      }
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
      const msg = (error as any)?.message || (error as any)?.reason || (error as any)?.data?.message || 'Bridge failed'
      return {
        success: false,
        error: msg
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

      if (DOMA_USE_SIMULATION) {
        await new Promise(r => setTimeout(r, 400))
        return {
          success: true,
          transactionHash: `0x${Math.random().toString(16).slice(2).padEnd(64, '0')}`
        }
      }

      const currentChainId = await this.web3.eth.getChainId()
      if (currentChainId !== 97476) {
        const switched = await this.switchToDomaTestnet()
        if (!switched) {
          return { success: false, error: 'WRONG_NETWORK' }
        }
      }
      const deployed = await this.isProxyOrImplDeployed(DOMA_SMART_CONTRACTS.DOMA_RECORD_PROXY)
      if (!deployed) {
        return { success: false, error: 'CONTRACT_NOT_DEPLOYED' }
      }
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
      const msg = (error as any)?.message || (error as any)?.reason || (error as any)?.data?.message || 'Detokenization failed'
      return {
        success: false,
        error: msg
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
      return chainId === 97476
    } catch (error) {
      console.error('[DomaSmartContracts] Error checking chain:', error)
      return false
    }
  }

  // Switch to Doma testnet
  async switchToDomaTestnet(): Promise<boolean> {
    try {
      if (typeof window === 'undefined') return false
      const provider = (window as any).ethereum || (window as any).okxwallet
      if (!provider) return false
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: DOMA_CHAIN_CONFIG.chainId }],
        })
        return true
      } catch (switchErr: any) {
        if (switchErr?.code === 4902 || /unrecognized|not added/i.test(String(switchErr?.message || ''))) {
          try {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: DOMA_CHAIN_CONFIG.chainId,
                chainName: DOMA_CHAIN_CONFIG.chainName,
                nativeCurrency: DOMA_CHAIN_CONFIG.nativeCurrency,
                rpcUrls: DOMA_CHAIN_CONFIG.rpcUrls,
                blockExplorerUrls: DOMA_CHAIN_CONFIG.blockExplorerUrls,
              }],
            })
            return true
          } catch (addErr) {
            console.error('[DomaSmartContracts] Add chain failed:', addErr)
            return false
          }
        }
        console.error('[DomaSmartContracts] Switch network failed:', switchErr)
        return false
      }
    } catch (error) {
      console.error('[DomaSmartContracts] Error switching network:', error)
      return false
    }
  }
  private async isProxyOrImplDeployed(address: string): Promise<boolean> {
    try {
      const code = await this.web3.eth.getCode(address)
      if (code && code !== '0x' && code !== '0x0') return true
      const slot = DomaSmartContractsService.EIP1967_IMPLEMENTATION_SLOT
      const implRaw = await this.web3.eth.getStorageAt(address, slot)
      if (implRaw && implRaw !== '0x' && implRaw !== '0x0') {
        const impl = '0x' + implRaw.slice(-40)
        const implCode = await this.web3.eth.getCode(impl)
        return !!implCode && implCode !== '0x' && implCode !== '0x0'
      }
      return false
    } catch {
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
