// lib/doma-api.ts

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
  testnetUrl: "https://doma.xyz",
  d3ApiUrl: "https://api-testnet.doma.xyz",
  forgeApiUrl: "https://forge.doma.xyz/api",
  contractAddress: "0x9A374915648f1352827fFbf0A7bB5752b6995eB7", // testnet ownership token
  chainId: 97476, // Doma Testnet Chain ID
  websocketUrl: "wss://api-testnet.doma.xyz/ws",
  graphqlUrl: "https://api-testnet.doma.xyz/graphql",
  pollApiUrl: "https://api-testnet.doma.xyz/v1/poll",
  smartContractsApiUrl: "https://api-testnet.doma.xyz/v1/smart-contracts"
}

export interface DomainToken {
  id: string
  name: string
  tokenId: string
  owner: string
  registrar: string
  status: "active" | "pending" | "expired" | "transferring"
  floorPrice: number
  expirationDate: string
  fractionalized: boolean
  totalShares: number
  availableShares: number
  chain?: string
}

export interface DomainListing {
  id: string
  domain: string
  tokenId: string
  seller: string
  price: number
  currency: string
  status: "active" | "sold" | "cancelled"
  listedAt: string
  expiresAt?: string
}

export interface DomainOffer {
  id: string
  domain: string
  tokenId: string
  buyer: string
  price: number
  currency: string
  status: "pending" | "accepted" | "rejected" | "expired"
  createdAt: string
  expiresAt: string
}

export interface TokenizationRequest {
  domain: string
  registrar: string
  walletAddress: string
  fractionalize?: boolean
  totalShares?: number
}

export interface BotConfiguration {
  id?: string
  name: string
  type: "telegram" | "twitter" | "discord" | "webhook"
  isActive: boolean
  filters: Array<{
    pattern: string
    priceRange: { min: number; max: number }
    expiryWindow: number
  }>
  actions: Array<{
    trigger: string
    action: string
    parameters: Record<string, any>
  }>
  subscriptionTier: "free" | "pro" | "enterprise"
  metrics?: {
    alertsSent: number
    subscribers: number
    revenue: number
  }
}

// API Class
export class DomaAPI {
  private static baseUrl = DOMA_CONFIG.d3ApiUrl
  private static apiKey = process.env.NEXT_PUBLIC_DOMA_API_KEY || "demo-key"

  private static async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      headers: {
        "Api-Key": this.apiKey,
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    return response.json()
  }

  // Smart Contracts API
  static async getSmartContracts() {
    try {
      return await this.request('/v1/smart-contracts')
    } catch (error) {
      console.error('Failed to fetch smart contracts:', error)
      // Return mock data for demo
      return {
        contracts: [
          {
            name: "DomaRecord",
            address: "0xF6A92E0f8bEa4174297B0219d9d47fEe335f84f8",
            chainId: "eip155:97476",
            version: "1.0.0"
          },
          {
            name: "OwnershipToken",
            address: "0x9A374915648f1352827fFbf0A7bB5752b6995eB7", 
            chainId: "eip155:97476",
            version: "1.0.0"
          }
        ]
      }
    }
  }

  static async getSmartContract(address: string) {
    try {
      return await this.request(`/v1/smart-contracts/${address}`)
    } catch (error) {
      console.error('Failed to fetch smart contract:', error)
      throw error
    }
  }

  // Poll API
  static async pollEvents(params: {
    limit?: number
    eventTypes?: string[]
    chainId?: string
    since?: number
    address?: string
  } = {}) {
    try {
      const searchParams = new URLSearchParams()
      
      if (params.limit) searchParams.set('limit', params.limit.toString())
      if (params.eventTypes?.length) searchParams.set('eventTypes', params.eventTypes.join(','))
      if (params.chainId) searchParams.set('chainId', params.chainId)
      if (params.since) searchParams.set('since', params.since.toString())
      if (params.address) searchParams.set('address', params.address)

      return await this.request(`/v1/poll?${searchParams}`)
    } catch (error) {
      console.error('Failed to poll events:', error)
      // Return mock data for demo
      return {
        events: [
          {
            id: 42,
            type: "NAME_TOKEN_MINTED",
            data: {
              tokenId: "123",
              to: "0x742d35Cc6634C0532925a3b8D4C9db96C4b5Da5e",
              sld: "example",
              tld: "com",
              registrarIanaId: 1,
              expiresAt: "1735689600",
              correlationId: "mint_123_456"
            },
            timestamp: new Date().toISOString(),
            chainId: "eip155:97476",
            blockNumber: 12345,
            transactionHash: "0xabc123..."
          }
        ],
        hasMore: false,
        nextCursor: 43
      }
    }
  }

  static async acknowledgeEvents(lastEventId: number) {
    try {
      return await this.request(`/v1/poll/ack/${lastEventId}`, { method: 'POST' })
    } catch (error) {
      console.error('Failed to acknowledge events:', error)
      throw error
    }
  }

  static async resetPollCursor(eventId: number = 0) {
    try {
      return await this.request(`/v1/poll/reset/${eventId}`, { method: 'POST' })
    } catch (error) {
      console.error('Failed to reset poll cursor:', error)
      throw error
    }
  }

  // Domain Operations
  static async getDomainTokens(walletAddress: string): Promise<DomainToken[]> {
    try {
      // In production, this would query the subgraph or smart contracts
      return [
        {
          id: "1",
          name: "ethaga.ai",
          tokenId: "1",
          owner: walletAddress,
          registrar: "D3",
          status: "active",
          floorPrice: 25000,
          expirationDate: "2027-07-04",
          fractionalized: true,
          totalShares: 1000,
          availableShares: 250,
          chain: "ethereum",
        },
        {
          id: "2",
          name: "ethaga.io",
          tokenId: "2",
          owner: walletAddress,
          registrar: "D3",
          status: "active",
          floorPrice: 15000,
          expirationDate: "2026-07-04",
          fractionalized: false,
          totalShares: 0,
          availableShares: 0,
          chain: "ethereum",
        },
      ]
    } catch (error) {
      console.error("Failed to fetch domain tokens:", error)
      return []
    }
  }

  static async getDomainListings(): Promise<DomainListing[]> {
    try {
      // Mock marketplace listings
      return [
        {
          id: "listing_1",
          domain: "crypto-exchange.com",
          tokenId: "456",
          seller: "0x123...abc",
          price: 125000,
          currency: "USDC",
          status: "active",
          listedAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "listing_2",
          domain: "nft-gallery.xyz",
          tokenId: "789",
          seller: "0x456...def",
          price: 45000,
          currency: "ETH",
          status: "active",
          listedAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ]
    } catch (error) {
      console.error("Failed to fetch domain listings:", error)
      return []
    }
  }

  static async tokenizeDomain(request: TokenizationRequest) {
    try {
      // Simulate tokenization process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      return {
        success: true,
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        tokenId: Math.floor(Math.random() * 10000).toString(),
      }
    } catch (error) {
      return {
        success: false,
        error: "Tokenization failed",
      }
    }
  }

  static async fractionalizeDomain(tokenId: string, totalShares: number) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return {
        success: true,
        fractionalTokenAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        totalShares,
      }
    } catch (error) {
      return {
        success: false,
        error: "Fractionalization failed",
      }
    }
  }

  static async bridgeDomain(tokenId: string, targetChain: string, targetAddress: string) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000))
      return {
        success: true,
        bridgeTxHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      }
    } catch (error) {
      return {
        success: false,
        error: "Bridge failed",
      }
    }
  }

  static async createDomainListing(domain: string, price: number, currency: string, seller: string) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return {
        success: true,
        listingId: `listing_${Date.now()}`,
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to create listing",
      }
    }
  }

  static async createDomainOffer(domain: string, price: number, currency: string, buyer: string) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return {
        success: true,
        offerId: `offer_${Date.now()}`,
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to create offer",
      }
    }
  }

  static async setupDomainMonitoring(domains: string[], webhookUrl: string) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      return {
        success: true,
        monitoringId: `monitor_${Date.now()}`,
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to setup monitoring",
      }
    }
  }

  static async subscribeToAlerts(walletAddress: string, callback: (alert: any) => void): Promise<WebSocket> {
    return new Promise((resolve, reject) => {
      try {
        const ws = new WebSocket(`${DOMA_CONFIG.websocketUrl}?address=${walletAddress}`)
        
        ws.onopen = () => {
          console.log('[DomaAPI] WebSocket connected for alerts')
          resolve(ws)
        }
        
        ws.onmessage = (event) => {
          try {
            const alert = JSON.parse(event.data)
            callback(alert)
          } catch (error) {
            console.error('[DomaAPI] Failed to parse alert:', error)
          }
        }
        
        ws.onerror = (error) => {
          console.error('[DomaAPI] WebSocket error:', error)
          reject(error)
        }
        
        // Simulate periodic alerts for demo
        const interval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            const mockAlert = {
              type: 'expiration',
              domain: `example${Math.floor(Math.random() * 1000)}.com`,
              message: 'Domain expires in 30 days',
              severity: 'medium',
              metadata: { daysUntilExpiration: 30 }
            }
            callback(mockAlert)
          }
        }, 30000)
        
        ws.onclose = () => {
          clearInterval(interval)
        }
        
      } catch (error) {
        reject(error)
      }
    })
  }

  static async createBot(config: Omit<BotConfiguration, "id" | "metrics">): Promise<BotConfiguration> {
    const bot: BotConfiguration = {
      ...config,
      id: `bot_${Date.now()}`,
      metrics: {
        alertsSent: 0,
        subscribers: 0,
        revenue: 0,
      },
    }
    return bot
  }

  static async deployTelegramBot(bot: BotConfiguration) {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    return {
      success: true,
      botToken: `${Math.random().toString(36).substr(2, 9)}:${Math.random().toString(36).substr(2, 35)}`,
      botUsername: `@${bot.name.toLowerCase().replace(/\s+/g, "_")}_bot`,
    }
  }

  static async deployTwitterBot(bot: BotConfiguration) {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    return {
      success: true,
      accountHandle: `@${bot.name.toLowerCase().replace(/\s+/g, "_")}`,
      apiKey: `twitter_${Math.random().toString(36).substr(2, 16)}`,
    }
  }

  static async getDashboardStats() {
    // Enhanced simulation data for dashboard
    return {
      totalDomains: Math.floor(Math.random() * 1000) + 12000,
      activeListings: Math.floor(Math.random() * 100) + 150,
      recentActivity: Math.floor(Math.random() * 50) + 25,
      priceChange24h: (Math.random() * 20 - 10).toFixed(1), // -10% to +10%
      newRegistrations24h: Math.floor(Math.random() * 20) + 10,
      totalVolume: (Math.random() * 1000000 + 2000000).toFixed(0), // 2M-3M
    }
  }

  static async getMarketMetrics() {
    return {
      tokenizedValue: Math.floor(Math.random() * 5000000) + 15000000, // 15M-20M
      transactions24h: Math.floor(Math.random() * 200) + 300,
      uniqueUsers24h: Math.floor(Math.random() * 100) + 150,
      monthlyRevenue: Math.floor(Math.random() * 50000) + 75000,
    }
  }

  static async getDomaAnalytics(timeframe: '24h' | '7d' | '30d') {
    // Generate analytics data based on timeframe
    const baseVolume = timeframe === '24h' ? 50000 : timeframe === '7d' ? 350000 : 1500000
    const baseTransactions = timeframe === '24h' ? 25 : timeframe === '7d' ? 175 : 750
    const baseUsers = timeframe === '24h' ? 15 : timeframe === '7d' ? 105 : 450

    return {
      volume: baseVolume + Math.floor(Math.random() * baseVolume * 0.3),
      transactions: baseTransactions + Math.floor(Math.random() * baseTransactions * 0.3),
      uniqueUsers: baseUsers + Math.floor(Math.random() * baseUsers * 0.3),
      averagePrice: Math.floor(Math.random() * 20000) + 5000,
      floorPrice: Math.floor(Math.random() * 1000) + 500,
      topDomains: [
        {
          name: "crypto.com",
          tokenId: "1",
          owner: "0x123...abc",
          registrar: "D3",
          price: 150000,
          volume: 45000
        },
        {
          name: "defi.xyz", 
          tokenId: "2",
          owner: "0x456...def",
          registrar: "D3",
          price: 89000,
          volume: 32000
        },
        {
          name: "nft.io",
          tokenId: "3", 
          owner: "0x789...ghi",
          registrar: "D3",
          price: 67000,
          volume: 28000
        }
      ],
      recentTransactions: [
        {
          id: "tx_1",
          type: "mint" as const,
          from: "0x000...000",
          to: "0x123...abc", 
          tokenId: "123",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          transactionHash: "0xabc123..."
        },
        {
          id: "tx_2",
          type: "transfer" as const,
          from: "0x123...abc",
          to: "0x456...def",
          tokenId: "456", 
          timestamp: new Date(Date.now() - 600000).toISOString(),
          transactionHash: "0xdef456..."
        }
      ]
    }
  }
}

// Helper function to get timeframe start timestamp
function getTimeframeStart(timeframe: string): string {
  const now = new Date()
  let startDate: Date

  switch (timeframe) {
    case '24h':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  }

  return Math.floor(startDate.getTime() / 1000).toString()
}