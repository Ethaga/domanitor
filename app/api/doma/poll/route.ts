import { NextRequest, NextResponse } from 'next/server'
import { forwardToDomaRest } from '@/lib/server/doma-proxy'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const sp = new URLSearchParams(url.searchParams)
  const res = await forwardToDomaRest('v1/poll', { searchParams: sp })
  const data = await res.text()
  return new NextResponse(data, { status: res.status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } })
}
