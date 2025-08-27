// High-level integration helpers for Doma Subgraph, Orderbook, Fractionalization, and Explorer validation
import { DOMA_ENDPOINTS, DOMA_API_KEY } from './doma-api'

export type Timeframe = '24h' | '7d' | '30d'

interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{ message: string }>
}

async function postGraphQL<T>(query: string, variables?: Record<string, any>): Promise<T | null> {
  try {
    const res = await fetch(DOMA_ENDPOINTS.subgraph, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DOMA_API_KEY}`,
      },
      body: JSON.stringify({ query, variables })
    })
    if (!res.ok) return null
    const json = (await res.json()) as GraphQLResponse<T>
    if (json.errors) return null
    return json.data ?? null
  } catch {
    return null
  }
}

function timeframeToMs(timeframe: Timeframe): number {
  if (timeframe === '24h') return 24 * 60 * 60 * 1000
  if (timeframe === '7d') return 7 * 24 * 60 * 60 * 1000
  return 30 * 24 * 60 * 60 * 1000
}

export interface SubgraphUsersAndTx {
  transactions: Array<{
    id: string
    from: string
    to: string
    tokenId: string
    timestamp: string
    transactionHash: string
    type?: string
  }>
  uniqueUsers: number
}

export async function getSubgraphUsersAndTransactions(timeframe: Timeframe): Promise<SubgraphUsersAndTx> {
  const sinceEpochSec = Math.floor((Date.now() - timeframeToMs(timeframe)) / 1000)

  // Primary query (as used by existing code)
  const primaryQuery = `
    query GetTransfers($since: BigInt!) {
      tokenTransfers(first: 200, orderBy: timestamp, orderDirection: desc, where: { timestamp_gte: $since }) {
        id
        from
        to
        tokenId
        timestamp
        transactionHash
        __typename
      }
    }
  `

  type PrimaryResp = { tokenTransfers: Array<any> }
  const primary = await postGraphQL<PrimaryResp>(primaryQuery, { since: `${sinceEpochSec}` })

  let txs: SubgraphUsersAndTx['transactions'] = []
  if (primary?.tokenTransfers) {
    txs = primary.tokenTransfers.map(t => ({
      id: t.id,
      from: (t.from ?? '').toLowerCase(),
      to: (t.to ?? '').toLowerCase(),
      tokenId: t.tokenId,
      timestamp: t.timestamp,
      transactionHash: t.transactionHash,
      type: t.__typename
    }))
  } else {
    // Fallback to the names/tokens style query shown in UI docs
    const fallbackQuery = `
      query GetNames($skip: Int, $take: Int) {
        names(skip: $skip, take: $take) {
          items {
            tokens {
              ownerAddress
              tokenId
              networkId
            }
          }
        }
      }
    `
    type FallbackResp = { names: { items: Array<{ tokens?: Array<any> }> } }
    const fb = await postGraphQL<FallbackResp>(fallbackQuery, { skip: 0, take: 100 })
    const owners = new Set<string>()
    fb?.names?.items?.forEach(n => n.tokens?.forEach(tok => owners.add((tok.ownerAddress ?? '').toLowerCase())))
    return { transactions: [], uniqueUsers: owners.size }
  }

  const users = new Set<string>()
  txs.forEach(t => {
    if (t.from) users.add(t.from)
    if (t.to) users.add(t.to)
  })

  return { transactions: txs, uniqueUsers: users.size }
}

export interface OrderbookStats {
  volumeUsd: number
  trades: number
  liquidityCount: number
  liquidityUsd: number
}

export async function getOrderbookVolumeAndLiquidity(timeframe: Timeframe): Promise<OrderbookStats> {
  // Approximate recent sales volume via Poll API events and liquidity via listings on subgraph.
  // 1) Poll events for purchases
  let volumeUsd = 0
  let trades = 0
  try {
    const params = new URLSearchParams()
    params.set('limit', '200')
    const res = await fetch(`${DOMA_ENDPOINTS.poll}?${params.toString()}`, {
      headers: { 'Authorization': `Bearer ${DOMA_API_KEY}` }
    })
    if (res.ok) {
      const json = await res.json() as { events?: Array<{ type?: string; timestamp?: string; data?: any }> }
      const cutoff = Date.now() - timeframeToMs(timeframe)
      json.events?.forEach(evt => {
        const t = evt.timestamp ? Date.parse(evt.timestamp) : 0
        const type = (evt.type ?? '').toUpperCase()
        const looksLikePurchase = type.includes('PURCHASE') || type.includes('SALE') || type.includes('MARKETPLACE')
        if (t >= cutoff && looksLikePurchase) {
          // Try to parse numeric price (assume already USD or native, no reliable currency info in poll response)
          const priceRaw = evt.data?.price ?? evt.data?.amount ?? 0
          const price = typeof priceRaw === 'string' ? Number(priceRaw) : Number(priceRaw)
          if (!Number.isNaN(price)) {
            volumeUsd += price
          }
          trades += 1
        }
      })
    }
  } catch {}

  // 2) Subgraph listings for liquidity approximation
  let liquidityCount = 0
  let liquidityUsd = 0
  try {
    const listingsQuery = `
      query GetListings($skip: Float, $take: Float) {
        listings(skip: $skip, take: $take) {
          items {
            price
            currency { symbol decimals }
          }
          totalCount
        }
      }
    `
    type ListingsResp = { listings: { items: Array<{ price: string; currency?: { symbol: string; decimals: number } }>; totalCount: number } }
    const data = await postGraphQL<ListingsResp>(listingsQuery, { skip: 0, take: 100 })
    if (data?.listings) {
      liquidityCount = data.listings.totalCount ?? 0
      // Without FX, treat listed currency as USD-like nominal for a rough proxy.
      liquidityUsd = data.listings.items.reduce((acc, l) => {
        const p = Number(l.price)
        return acc + (Number.isFinite(p) ? p : 0)
      }, 0)
    }
  } catch {}

  return { volumeUsd, trades, liquidityCount, liquidityUsd }
}

export interface FractionalizationStats {
  fractionalizedCount: number
  buyoutsCount: number
  realizedRevenueUsd: number
  marketPotentialUsd: number
}

export async function getFractionalizationRevenueAndPotential(timeframe: Timeframe): Promise<FractionalizationStats> {
  const cutoff = Date.now() - timeframeToMs(timeframe)
  let fractionalizedCount = 0
  let buyoutsCount = 0
  let realizedRevenueUsd = 0
  let marketPotentialUsd = 0

  try {
    const params = new URLSearchParams()
    params.set('limit', '200')
    const res = await fetch(`${DOMA_ENDPOINTS.poll}?${params.toString()}`, {
      headers: { 'Authorization': `Bearer ${DOMA_API_KEY}` }
    })
    if (res.ok) {
      const json = await res.json() as { events?: Array<{ type?: string; timestamp?: string; data?: any }> }
      json.events?.forEach(evt => {
        const t = evt.timestamp ? Date.parse(evt.timestamp) : 0
        if (t < cutoff) return
        const type = (evt.type ?? '').toUpperCase()
        if (type.includes('FRACTION')) {
          fractionalizedCount += 1
          const minBuyout = evt.data?.minimumBuyoutPrice ?? 0
          const val = typeof minBuyout === 'string' ? Number(minBuyout) : Number(minBuyout)
          if (Number.isFinite(val)) marketPotentialUsd += val
        }
        if (type.includes('BUY') || type.includes('BOUGHT')) {
          buyoutsCount += 1
          const priceRaw = evt.data?.buyoutPrice ?? evt.data?.price ?? 0
          const price = typeof priceRaw === 'string' ? Number(priceRaw) : Number(priceRaw)
          if (Number.isFinite(price)) realizedRevenueUsd += price
        }
      })
    }
  } catch {}

  return { fractionalizedCount, buyoutsCount, realizedRevenueUsd, marketPotentialUsd }
}

export interface ExplorerValidationResult {
  checked: Array<{ tx: string; ok: boolean }>
}

export async function validateOnExplorer(txHashes: string[]): Promise<ExplorerValidationResult> {
  const limited = txHashes.slice(0, 5)
  const results: Array<{ tx: string; ok: boolean }> = []
  await Promise.all(limited.map(async (tx) => {
    try {
      const res = await fetch(`https://explorer-testnet.doma.xyz/tx/${tx}`, { method: 'GET' })
      results.push({ tx, ok: res.ok })
    } catch {
      results.push({ tx, ok: false })
    }
  }))
  return { checked: results }
}

