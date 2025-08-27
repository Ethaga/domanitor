import { NextRequest, NextResponse } from 'next/server'
import { forwardToDomaRest } from '@/lib/server/doma-proxy'

export async function GET(_req: NextRequest, { params }: { params: { orderId: string; fulfiller: string } }) {
  const { orderId, fulfiller } = params
  const res = await forwardToDomaRest(`v1/orderbook/offer/${orderId}/${fulfiller}`)
  const data = await res.text()
  return new NextResponse(data, { status: res.status, headers: { 'Content-Type': 'application/json' } })
}
