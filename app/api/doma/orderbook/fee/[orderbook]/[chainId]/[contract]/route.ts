import { NextRequest, NextResponse } from 'next/server'
import { forwardToDomaRest } from '@/lib/server/doma-proxy'

export async function GET(_req: NextRequest, { params }: { params: { orderbook: string; chainId: string; contract: string } }) {
  const { orderbook, chainId, contract } = params
  const res = await forwardToDomaRest(`v1/orderbook/fee/${orderbook}/${chainId}/${contract}`)
  const data = await res.text()
  return new NextResponse(data, { status: res.status, headers: { 'Content-Type': 'application/json' } })
}
