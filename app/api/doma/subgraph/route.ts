import { NextRequest, NextResponse } from 'next/server'
import { forwardToDomaGraphql } from '@/lib/server/doma-proxy'

export async function POST(req: NextRequest) {
  const res = await forwardToDomaGraphql(req)
  const data = await res.text()
  return new NextResponse(data, { status: res.status, headers: { 'Content-Type': 'application/json' } })
}
