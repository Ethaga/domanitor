import { NextRequest, NextResponse } from 'next/server'
import { forwardToDomaRest } from '@/lib/server/doma-proxy'

export async function GET(_req: NextRequest, { params }: { params: { chainId: string; contract: string; orderbook: string } }) {
  const { chainId, contract, orderbook } = params
  const res = await forwardToDomaRest(`v1/orderbook/currencies/${chainId}/${contract}/${orderbook}`)
  const data = await res.text()
  return new NextResponse(data, { status: res.status, headers: { 'Content-Type': 'application/json' } })
}
