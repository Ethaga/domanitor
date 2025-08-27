import { NextRequest, NextResponse } from 'next/server'
import { forwardToDomaRest } from '@/lib/server/doma-proxy'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const res = await forwardToDomaRest('v1/orderbook/list', { method: 'POST', body })
  const data = await res.text()
  return new NextResponse(data, { status: res.status, headers: { 'Content-Type': 'application/json' } })
}
