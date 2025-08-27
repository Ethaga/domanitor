import { NextRequest, NextResponse } from 'next/server'
import { forwardToDomaRest } from '@/lib/server/doma-proxy'

export async function GET(_req: NextRequest, { params }: { params: { orderId: string; buyer: string } }) {
  const { orderId, buyer } = params
  const res = await forwardToDomaRest(`v1/orderbook/listing/${orderId}/${buyer}`)
  const data = await res.text()
  return new NextResponse(data, { status: res.status, headers: { 'Content-Type': 'application/json' } })
}
