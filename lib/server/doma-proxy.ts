import { NextRequest } from 'next/server'

const DOMA_API_BASE = process.env.DOMA_API_BASE || 'https://api.doma.xyz'
const DOMA_GRAPHQL_URL = process.env.DOMA_GRAPHQL_URL || 'https://api.doma.xyz/graphql'
const DOMA_API_KEY = process.env.DOMA_API_KEY || ''

export interface ForwardOptions {
  method?: string
  headers?: Record<string, string>
  body?: BodyInit | null
  searchParams?: URLSearchParams
}

function buildUrl(path: string, searchParams?: URLSearchParams) {
  const url = new URL(path, DOMA_API_BASE.endsWith('/') ? DOMA_API_BASE : DOMA_API_BASE + '/')
  if (searchParams) {
    searchParams.forEach((v, k) => url.searchParams.set(k, v))
  }
  return url.toString()
}

export async function forwardToDomaRest(path: string, opts: ForwardOptions = {}) {
  const url = buildUrl(path, opts.searchParams)
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Api-Key': DOMA_API_KEY,
    ...(opts.headers || {}),
  }
  const res = await fetch(url, {
    method: opts.method || 'GET',
    headers,
    body: opts.body ?? null,
    // Explicitly no cache; these are transactional endpoints
    cache: 'no-store'
  })
  return res
}

export async function forwardToDomaGraphql(req: NextRequest) {
  const res = await fetch(DOMA_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': DOMA_API_KEY,
    },
    body: await req.text(),
    cache: 'no-store'
  })
  return res
}
