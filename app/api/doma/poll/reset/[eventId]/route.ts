import { NextRequest, NextResponse } from 'next/server'
import { forwardToDomaRest } from '@/lib/server/doma-proxy'

export async function POST(_req: NextRequest, { params }: { params: { eventId: string } }) {
  const { eventId } = params
  const res = await forwardToDomaRest(`v1/poll/reset/${eventId}`, { method: 'POST' })
  const data = await res.text()
  return new NextResponse(data, { status: res.status, headers: { 'Content-Type': 'application/json' } })
}
