import { NextRequest, NextResponse } from 'next/server'
import {
  getSubgraphUsersAndTransactions,
  getOrderbookVolumeAndLiquidity,
  getFractionalizationRevenueAndPotential,
  validateOnExplorer,
  type Timeframe
} from '@/lib/doma-integrations'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const timeframe = (searchParams.get('timeframe') as Timeframe) || '7d'

  try {
    const [subgraph, orderbook, fractional] = await Promise.all([
      getSubgraphUsersAndTransactions(timeframe),
      getOrderbookVolumeAndLiquidity(timeframe),
      getFractionalizationRevenueAndPotential(timeframe)
    ])

    const txHashes = subgraph.transactions.map(t => t.transactionHash).filter(Boolean)
    const explorer = await validateOnExplorer(txHashes)

    return new NextResponse(JSON.stringify({
      timeframe,
      subgraph,
      orderbook,
      fractional,
      explorer
    }), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
  } catch (e: any) {
    return new NextResponse(JSON.stringify({ error: e?.message ?? 'Aggregation failed' }), { status: 500, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
  }
}

