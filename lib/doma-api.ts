// Doma Protocol Integration Layer with Official SDK and Updated APIs
import { createDomaOrderbookClient, type DomaOrderbookClient } from '@doma-protocol/orderbook-sdk'
import { DomaWeb3Service } from './web3-utils'

export interface DomaConfig {
  testnetUrl: string
  d3ApiUrl: string
  forgeApiUrl: string
  contractAddress: string
  chainId: number
  websocketUrl: string
  graphqlUrl: string
  pollApiUrl: string
  smartContractsApiUrl: string
}

export const DOMA_CONFIG: DomaConfig = {
  testnetUrl: "https://start.doma.xyz",
  d3ApiUrl: "https://api-testnet.doma.xyz/v1",
  forgeApiUrl: "https://forge.doma.xyz/api",
  contractAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e",
  chainId: 11155111, // Sepolia testnet
  websocketUrl: "wss://api-testnet.doma.xyz/ws",
  graphqlUrl: "https://api-testnet.doma.xyz/graphql",
  pollApiUrl: "https://api-testnet.doma.xyz/v1/poll",
  smartContractsApiUrl: "https://api-testnet.doma.xyz/v1/smart-contracts"
}

// Updated Doma Protocol API endpoints
export const DOMA_ENDPOINTS = {
  subgraph: "https://api-testnet.doma.xyz/graphql",
  orderbook: "https://api-testnet.doma.xyz/v1/orderbook",
  websocket: "wss://api-testnet.doma.xyz/ws",
  poll: "https://api-testnet.doma.xyz/v1/poll",
  pollAck: "https://api-testnet.doma.xyz/v1/poll/ack",
  smartContracts: "https://api-testnet.doma.xyz/v1/smart-contracts"
}

// Updated API Key
export const DOMA_API_KEY = "v1.954d51b4e76bfda49d1ef7cd3869797b005f9a8558c2c6e4c8d2c642b24e80ca";

export const DOMA_USE_SIMULATION = process.env.NEXT_PUBLIC_DOMA_SIMULATION_ONLY === 'true'

// Poll API Event Types
export type PollEventType = 
  | "domain_registered"
  | "domain_transferred" 
  | "domain_expired"
  | "domain_renewed"
  | "domain_tokenized"
  | "domain_bridged"
  | "token_transferred"
  | "marketplace_listing"
  | "marketplace_sale"

export interface PollEvent {
  id: string
  type: PollEventType
  timestamp: string
  blockNumber: number
  transactionHash: string
  data: {
    domain?: string
    tokenId?: string
    from?: string
    to?: string
    price?: string
    currency?: string
    [key: string]: any
  }
}

export interface PollResponse {
  events: PollEvent[]
  lastId?: string
  hasMore: boolean
}

export interface SmartContractInfo {
  address: string
  name: string
  network: string
  abi: any[]
  verified: boolean
  implementation?: string
}

// Initialize Doma Orderbook Client
let domaClient: DomaOrderbookClient | null = null

const initializeDomaClient = () => {
  if (!domaClient) {
    try {
      domaClient = createDomaOrderbookClient({
        apiClientOptions: {
          baseUrl: DOMA_CONFIG.d3ApiUrl,
          apiKey: DOMA_API_KEY,
        },
      })
    } catch (error) {
      console.warn('[DomaAPI] Failed to initialize Doma client:', error)
      domaClient = null
    }
  }
  return domaClient
}

export interface DomainToken {
  id: string
  name: string
  owner: string
  tokenId: string
  registrar: string
  expirationDate: string
  isTokenized: boolean
  fractionalized: boolean
  totalShares?: number
  availableShares?: number
  floorPrice: number
  lastSalePrice?: number
  status: "active" | "expired" | "pending" | "transferring"
}

export interface TokenizationRequest {
  domain: string
  registrar: string
  walletAddress: string
  fractionalize?: boolean
  totalShares?: number
}

export interface AlertSubscription {
  id: string
  domain: string
  alertType: "expiration" | "sale" | "transfer" | "price_change"
  threshold?: number
  isActive: boolean
  webhookUrl?: string
  telegramChatId?: string
}

export interface BotConfiguration {
  id: string
  name: string
  type: "telegram" | "twitter" | "discord" | "webhook"
  isActive: boolean
  filters: DomainFilter[]
  actions: BotAction[]
  subscriptionTier: "free" | "pro" | "enterprise"
  metrics: BotMetrics
}

export interface DomainFilter {
  pattern: string
  priceRange?: { min: number; max: number }
  expiryWindow?: number
  registrars?: string[]
  tlds?: string[]
}

export interface BotAction {
  trigger: "expiry" | "sale" | "price_change" | "transfer"
  action: "alert" | "auto_bid" | "auto_renew" | "notify_community"
  parameters: Record<string, any>
}

export interface BotMetrics {
  alertsSent: number
  transactionsGenerated: number
  revenueGenerated: number
  userAcquisition: number
  communityEngagement: number
  successRate: number
}

export interface SubscriptionPlan {
  tier: "free" | "pro" | "enterprise"
  price: number
  features: string[]
  limits: {
    domains: number
    bots: number
    alerts: number
  }
}

export interface DomainListing {
  id: string
  domain: string
  price: number
  currency: string
  seller: string
  status: 'active' | 'sold' | 'expired'
  listedAt: string
  expiresAt?: string
  tokenId?: string
  chainId?: number
}

export interface DomainOffer {
  id: string
  domain: string
  price: number
  currency: string
  buyer: string
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  createdAt: string
  expiresAt: string
  tokenId?: string
  chainId?: number
}

export interface DomaSubgraphData {
  domains: Array<{
    id: string
    name: string
    tokenId: string
    owner: string
    registrant: string
    expirationDate: string
    createdAt: string
    registrar: string
    isTokenized: boolean
  }>
  transactions: Array<{
    id: string
    type: 'mint' | 'transfer' | 'burn'
    from: string
    to: string
    tokenId: string
    timestamp: string
    transactionHash: string
  }>
  marketMetrics: {
    totalDomains: number
    totalVolume: string
    floorPrice: string
    averagePrice: string
  }
}

// Enhanced API functions for Doma Protocol integration
// In-memory marketplace state for demo
let MARKETPLACE_LISTINGS: DomainListing[] = [
  {
    id: 'lst_1',
    domain: 'ethaga.ai',
    price: 2500,
    currency: 'USDC',
    seller: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
    status: 'active',
    listedAt: new Date(Date.now() - 3600_000).toISOString(),
    tokenId: '0x1a2b3c',
    chainId: 11155111,
  },
  {
    id: 'lst_2',
    domain: 'ethaga.io',
    price: 1200,
    currency: 'ETH',
    seller: '0x9A0b865f29FE8e667a1F7589eE1a9e9C5E6b2f2f',
    status: 'active',
    listedAt: new Date(Date.now() - 7200_000).toISOString(),
    tokenId: '0x4d5e6f',
    chainId: 11155111,
  }
]
let MARKETPLACE_OFFERS: DomainOffer[] = []

export class DomaAPI {

  // Poll API Implementation
  static async pollEvents(
    limit?: number,
    eventTypes?: PollEventType[],
    lastEventId?: string
  ): Promise<PollResponse> {
    try {
      console.log('[DomaAPI] Polling for new events via Doma Poll API')
      
      const params = new URLSearchParams()
      if (limit) params.append('limit', limit.toString())
      if (eventTypes?.length) params.append('eventTypes', eventTypes.join(','))
      if (lastEventId) params.append('lastEventId', lastEventId)
      
      const response = await fetch(`${DOMA_ENDPOINTS.poll}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${DOMA_API_KEY}`,
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`Poll API request failed: ${response.status}`)
      }
      
      const data = await response.json()
      return data
      
    } catch (error) {
      console.warn('[DomaAPI] Poll API failed, using simulated events:', error)
      
      // Fallback to simulated events
      return {
        events: [
          {
            id: `evt_${Date.now()}`,
            type: "domain_registered",
            timestamp: new Date().toISOString(),
            blockNumber: Math.floor(Math.random() * 1000000) + 19000000,
            transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
            data: {
              domain: "ethaga.ai",
              tokenId: "1",
              from: "0x0000000000000000000000000000000000000000",
              to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e"
            }
          }
        ],
        lastId: `evt_${Date.now()}`,
        hasMore: false
      }
    }
  }
  
  // Poll Ack API Implementation
  static async acknowledgePollEvents(lastEventId: string): Promise<{ success: boolean }> {
    try {
      console.log('[DomaAPI] Acknowledging poll events up to:', lastEventId)
      
      const response = await fetch(`${DOMA_ENDPOINTS.pollAck}/${lastEventId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${DOMA_API_KEY}`,
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`Poll Ack API request failed: ${response.status}`)
      }
      
      return { success: true }
      
    } catch (error) {
      console.warn('[DomaAPI] Poll Ack API failed:', error)
      return { success: false }
    }
  }
  
  // Smart Contracts API Implementation
  static async getSmartContractInfo(contractAddress: string): Promise<SmartContractInfo | null> {
    try {
      console.log('[DomaAPI] Fetching smart contract info for:', contractAddress)
      
      const response = await fetch(`${DOMA_ENDPOINTS.smartContracts}/${contractAddress}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${DOMA_API_KEY}`,
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`Smart Contracts API request failed: ${response.status}`)
      }
      
      const data = await response.json()
      return data
      
    } catch (error) {
      console.warn('[DomaAPI] Smart Contracts API failed:', error)
      return null
    }
  }
  
  // Get all smart contracts
  static async getAllSmartContracts(): Promise<SmartContractInfo[]> {
    try {
      console.log('[DomaAPI] Fetching all smart contracts')
      
      const response = await fetch(DOMA_ENDPOINTS.smartContracts, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${DOMA_API_KEY}`,
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`Smart Contracts API request failed: ${response.status}`)
      }
      
      const data = await response.json()
      return data.contracts || []
      
    } catch (error) {
      console.warn('[DomaAPI] Smart Contracts API failed:', error)
      return []
    }
  }

  static async tokenizeDomain(
    request: TokenizationRequest,
  ): Promise<{ success: boolean; txHash?: string; tokenId?: string; error?: string }> {
    console.log("[DomaAPI] Tokenizing domain:", request)

    // Try wallet-based on-chain tokenization first (user signs tx)
    try {
      if (typeof window !== 'undefined' && (window.ethereum || (window as any).okxwallet)) {
        const provider = (window as any).ethereum || (window as any).okxwallet
        const web3 = new DomaWeb3Service(provider)
        const switched = await web3.switchToDomaTestnet()
        if (!switched) {
          console.warn('[DomaAPI] Could not auto-switch network; please switch to Sepolia manually')
        }

        const result = await web3.requestTokenization([request.domain], request.walletAddress)
        if (result.success) {
          return {
            success: true,
            txHash: result.transactionHash,
            tokenId: result.tokenId || `doma_${Math.random().toString(36).substr(2, 9)}`,
          }
        }
        return { success: false, error: result.error || 'Tokenization failed' }
      }
    } catch (walletError) {
      console.warn('[DomaAPI] Wallet tokenization path failed, falling back:', walletError)
    }

    // Fallback to D3 API flow (or simulation if unavailable)
    try {
      const voucherResponse = await fetch(`${DOMA_CONFIG.d3ApiUrl}/tokenization/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${DOMA_API_KEY}`,
        },
        body: JSON.stringify({
          domain: request.domain,
          owner: request.walletAddress,
          registrar: request.registrar,
          fractionalize: request.fractionalize,
          totalShares: request.totalShares,
        }),
      })

      if (!voucherResponse.ok) {
        const errorText = await voucherResponse.text()
        throw new Error(`Tokenization request failed: ${voucherResponse.status} - ${errorText}`)
      }

      const voucherData = await voucherResponse.json()
      const correlationId = voucherData.correlationId
      let attempts = 0
      const maxAttempts = 20

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 6000))

        const statusResponse = await fetch(`${DOMA_CONFIG.d3ApiUrl}/tokenization/status/${correlationId}`, {
          headers: {
            "Authorization": `Bearer ${DOMA_API_KEY}`,
          },
        })

        if (statusResponse.ok) {
          const statusData = await statusResponse.json()

          if (statusData.status === 'completed') {
            return {
              success: true,
              txHash: statusData.transactionHash,
              tokenId: statusData.tokenId,
            }
          } else if (statusData.status === 'failed') {
            throw new Error(statusData.error || 'Tokenization failed')
          }
        }

        attempts++
      }

      throw new Error('Tokenization timeout - please check status later')

    } catch (error) {
      console.warn('[DomaAPI] API path failed, using simulation:', error)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      return {
        success: true,
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        tokenId: `doma_${Math.random().toString(36).substr(2, 9)}`,
      }
    }
  }

  static async getDomainTokens(walletAddress: string): Promise<DomainToken[]> {
    console.log('[DomaAPI] Fetching domain tokens for:', walletAddress)

    // Prepare enhanced simulation data up-front
    const simulatedDomains: DomainToken[] = [
      {
        id: "doma_user_1",
        name: "ethaga.ai",
        owner: walletAddress,
        tokenId: "0x1a2b3c",
        registrar: "D3 Registrar",
        expirationDate: "2027-07-04T00:00:00Z",
        isTokenized: true,
        fractionalized: false,
        floorPrice: 0.5,
        status: "active",
      },
      {
        id: "doma_user_2",
        name: "ethaga.io",
        owner: walletAddress,
        tokenId: "0x4d5e6f",
        registrar: "D3 Registrar",
        expirationDate: "2026-07-04T00:00:00Z",
        isTokenized: true,
        fractionalized: false,
        floorPrice: 0.3,
        status: "active",
      },
      {
        id: "doma_user_3",
        name: "ethaga.com",
        owner: walletAddress,
        tokenId: "0x7g8h9i",
        registrar: "D3 Registrar",
        expirationDate: "2026-07-04T00:00:00Z",
        isTokenized: true,
        fractionalized: false,
        floorPrice: 0.8,
        status: "active",
      },
      {
        id: "doma_user_4",
        name: "ethaga.ape",
        owner: walletAddress,
        tokenId: "0x9j0k1l",
        registrar: "D3 Registrar",
        expirationDate: "2026-07-04T00:00:00Z",
        isTokenized: true,
        fractionalized: false,
        floorPrice: 0.2,
        status: "active",
      }
    ]

    if (DOMA_USE_SIMULATION) {
      console.log('[DomaAPI] Simulation enabled: returning local domain tokens')
      return simulatedDomains
    }

    try {
      const response = await fetch(DOMA_ENDPOINTS.subgraph, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DOMA_API_KEY}`,
        },
        body: JSON.stringify({
          query: `
            query GetDomainTokens($owner: String!) {
              domains(where: { owner: $owner }) {
                id
                name
                tokenId
                owner
                registrant
                expirationDate
                createdAt
                registrar
                isTokenized
              }
            }
          `,
          variables: { owner: walletAddress.toLowerCase() }
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.data?.domains) {
          return data.data.domains.map((domain: any) => ({
            id: domain.id,
            name: domain.name,
            owner: domain.owner,
            tokenId: domain.tokenId,
            registrar: domain.registrar,
            expirationDate: domain.expirationDate,
            isTokenized: domain.isTokenized,
            fractionalized: false,
            floorPrice: Math.random() * 2 + 0.1,
            status: 'active' as const
          }))
        }
      }
    } catch (error) {
      console.warn('[DomaAPI] Updated subgraph failed:', error)
    }

    console.log('[DomaAPI] Using enhanced simulation data for wallet:', walletAddress)
    return simulatedDomains
  }

  // Enhanced subgraph data with updated endpoint
  static async getSubgraphData(): Promise<DomaSubgraphData> {
    // Simulation short-circuit to avoid GraphQL 400s during development/demo
    if (DOMA_USE_SIMULATION) {
      const baseTime = Date.now()
      return {
        domains: [
          {
            id: 'doma_domain_1',
            name: 'ethaga.ai',
            tokenId: '0x1a2b3c',
            owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
            registrant: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
            expirationDate: '2027-07-04T00:00:00Z',
            createdAt: '2024-01-15T10:30:00Z',
            registrar: 'D3 Registrar',
            isTokenized: true
          }
        ],
        transactions: [
          {
            id: 'doma_tx_1',
            type: 'mint',
            from: '0x0000000000000000000000000000000000000000',
            to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
            tokenId: '0x1a2b3c',
            timestamp: new Date(baseTime - 1800000).toISOString(),
            transactionHash: '0xa1b2c3d4e5f6789a'
          }
        ],
        marketMetrics: {
          totalDomains: 1247,
          totalVolume: '2850000',
          floorPrice: '0.05',
          averagePrice: '1.8'
        }
      }
    }

    try {
      console.log('[DomaAPI] Fetching from updated subgraph endpoint')
      const response = await fetch(DOMA_ENDPOINTS.subgraph, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DOMA_API_KEY}`,
        },
        body: JSON.stringify({
          query: `
            query GetMarketData {
              domains(first: 100) {
                id
                name
                tokenId
                owner
                registrant
                expirationDate
                createdAt
                registrar
                isTokenized
              }
              transactions: tokenTransfers(first: 20, orderBy: timestamp, orderDirection: desc) {
                id
                type: __typename
                from
                to
                tokenId
                timestamp
                transactionHash
              }
              marketMetrics: _meta {
                block {
                  number
                  timestamp
                }
              }
            }
          `
        })
      })

      if (response.ok) {
        const data = await response.json()
        return {
          domains: data.data.domains || [],
          transactions: data.data.transactions || [],
          marketMetrics: {
            totalDomains: data.data.domains?.length || 0,
            totalVolume: '2850000',
            floorPrice: '0.05',
            averagePrice: '1.8'
          }
        }
      }
    } catch (error) {
      console.warn('[DomaAPI] Updated subgraph failed, using simulation:', error)
    }

    const baseTime = Date.now()
    return {
      domains: [
        {
          id: 'doma_domain_1',
          name: 'ethaga.ai',
          tokenId: '0x1a2b3c',
          owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
          registrant: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
          expirationDate: '2027-07-04T00:00:00Z',
          createdAt: '2024-01-15T10:30:00Z',
          registrar: 'D3 Registrar',
          isTokenized: true
        }
      ],
      transactions: [
        {
          id: 'doma_tx_1',
          type: 'mint',
          from: '0x0000000000000000000000000000000000000000',
          to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
          tokenId: '0x1a2b3c',
          timestamp: new Date(baseTime - 1800000).toISOString(),
          transactionHash: '0xa1b2c3d4e5f6789a'
        }
      ],
      marketMetrics: {
        totalDomains: 1247,
        totalVolume: '2850000',
        floorPrice: '0.05',
        averagePrice: '1.8'
      }
    }
  }

  static async fractionalizeDomain(txHash: string, totalShares: number): Promise<{ success: boolean; sharesMinted: number }> {
    console.log('[DomaAPI] Fractionalizing domain from tx:', txHash, 'shares:', totalShares)
    await new Promise((r) => setTimeout(r, 800))
    return { success: true, sharesMinted: totalShares }
  }

  static async getDomainListings(): Promise<DomainListing[]> {
    return MARKETPLACE_LISTINGS.slice().sort((a, b) => new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime())
  }

  static async createDomainListing(domain: string, price: number, currency: string, seller: string): Promise<{ success: boolean; id?: string }> {
    const id = `lst_${Math.random().toString(36).substr(2, 6)}`
    const listing: DomainListing = {
      id,
      domain,
      price,
      currency,
      seller,
      status: 'active',
      listedAt: new Date().toISOString(),
      tokenId: `0x${Math.random().toString(16).substr(2, 6)}`,
      chainId: 11155111,
    }
    MARKETPLACE_LISTINGS.unshift(listing)
    return { success: true, id }
  }

  static async createDomainOffer(domain: string, price: number, currency: string, buyer: string): Promise<{ success: boolean; id?: string }> {
    const id = `ofr_${Math.random().toString(36).substr(2, 6)}`
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600_000).toISOString()
    const offer: DomainOffer = {
      id,
      domain,
      price,
      currency,
      buyer,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt,
      tokenId: undefined,
      chainId: 11155111,
    }
    MARKETPLACE_OFFERS.unshift(offer)
    return { success: true, id }
  }

  // Enhanced real-time polling for events
  static async startEventPolling(
    callback: (events: PollEvent[]) => void,
    intervalMs: number = 30000
  ): Promise<() => void> {
    console.log('[DomaAPI] Starting enhanced event polling with Poll API')
    
    let lastEventId: string | undefined = undefined
    let polling = true
    
    const poll = async () => {
      if (!polling) return
      
      try {
        const response = await this.pollEvents(50, undefined, lastEventId)
        
        if (response.events.length > 0) {
          callback(response.events)
          
          // Acknowledge the events
          if (response.lastId) {
            await this.acknowledgePollEvents(response.lastId)
            lastEventId = response.lastId
          }
        }
      } catch (error) {
        console.warn('[DomaAPI] Event polling error:', error)
      }
      
      if (polling) {
        setTimeout(poll, intervalMs)
      }
    }
    
    // Start polling
    poll()
    
    // Return cleanup function
    return () => {
      polling = false
    }
  }

  // Existing methods with updated configurations...
  static async createAlert(subscription: Omit<AlertSubscription, "id">): Promise<AlertSubscription> {
    return {
      id: Math.random().toString(36).substr(2, 9),
      ...subscription,
    }
  }

  static async getDashboardStats() {
    try {
      const subgraphData = await this.getSubgraphData()
      const now = Date.now()
      const newRegistrations24h = subgraphData.domains.filter((d: any) => {
        const t = Date.parse(d.createdAt || d.expirationDate || '')
        return !isNaN(t) && now - t <= 24 * 60 * 60 * 1000
      }).length

      const recentActivity = (subgraphData.transactions || []).slice(0, 5).map((tx: any) => ({
        type: tx.type,
        tokenId: tx.tokenId,
        timestamp: tx.timestamp,
        transactionHash: tx.transactionHash,
        from: tx.from,
        to: tx.to,
      }))

      const totalDomains = subgraphData.marketMetrics.totalDomains
      const activeListings = Math.max(12, Math.round(totalDomains * 0.08))
      const priceChange24h = parseFloat(((Math.random() * 6 - 3)).toFixed(1))

      return {
        totalDomains,
        activeListings,
        recentActivity,
        priceChange24h,
        newRegistrations24h,
        totalVolume: subgraphData.marketMetrics.totalVolume,
      }
    } catch (error) {
      console.warn('[DomaAPI] getDashboardStats failed, using simulation:', error)
      return {
        totalDomains: 12847,
        activeListings: 842,
        recentActivity: [
          {
            type: 'mint',
            tokenId: '0x1a2b3c',
            timestamp: new Date().toISOString(),
            transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
            from: '0x0000000000000000000000000000000000000000',
            to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e',
          },
        ],
        priceChange24h: parseFloat(((Math.random() * 4 - 2).toFixed(1))),
        newRegistrations24h: 73,
        totalVolume: '2850000',
      }
    }
  }

  static async getMarketMetrics() {
    try {
      const subgraphData = await this.getSubgraphData()
      return {
        totalDomains: subgraphData.marketMetrics.totalDomains,
        tokenizedValue: parseFloat(subgraphData.marketMetrics.totalVolume) || 4200000,
        activeAlerts: 156,
        monthlyRevenue: 28400,
        transactions24h: subgraphData.transactions.length,
        uniqueUsers24h: new Set(subgraphData.transactions.map(tx => tx.from)).size,
        avgTransactionValue: parseFloat(subgraphData.marketMetrics.averagePrice) || 2150,
        activeBots: 89,
        botSubscribers: 1247,
        botRevenue: 12800,
        communityEngagement: 78,
        userAcquisitionRate: 23,
      }
    } catch (error) {
      console.warn('[DomaAPI] Failed to fetch market metrics:', error)
      return {
        totalDomains: 2847,
        tokenizedValue: 4200000,
        activeAlerts: 156,
        monthlyRevenue: 28400,
        transactions24h: 234,
        uniqueUsers24h: 127,
        avgTransactionValue: 2150,
        activeBots: 89,
        botSubscribers: 1247,
        botRevenue: 12800,
        communityEngagement: 78,
        userAcquisitionRate: 23,
      }
    }
  }
}
