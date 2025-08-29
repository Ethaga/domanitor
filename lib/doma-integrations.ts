// lib/doma-integrations.ts
import { apiRequest } from './doma-api'

// Subgraph: Users & Transactions
export async function getSubgraphUsersAndTransactions(timeframe: string) {
  return apiRequest(`/subgraph?timeframe=${timeframe}`)
}

// Poll API (event stream)
export async function getPollEvents(limit = 100) {
  return apiRequest(`/poll?limit=${limit}`)
}

// Orderbook stats
export async function getOrderbookStats(timeframe: string) {
  return apiRequest(`/orderbook/stats?timeframe=${timeframe}`)
}

// Network info
export async function getNetworkInfo() {
  return apiRequest(`/network`)
}

// Deployed contracts
export async function getContracts() {
  return apiRequest(`/contracts`)
}

// Supported TLDs
export async function getSupportedTLDs() {
  return apiRequest(`/tlds`)
}

// Fractionalization stats
export async function getFractionalizationStats(timeframe: string) {
  return apiRequest(`/fractionalization/stats?timeframe=${timeframe}`)
}
