// lib/doma-smart-contracts.ts
import { apiRequest } from "./doma-api";

// Request tokenization
export async function requestTokenization(body: any) {
  return apiRequest("/v1/smart-contract/requestTokenization", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// Claim domain
export async function claimDomain(body: any) {
  return apiRequest("/v1/smart-contract/claimDomain", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// Bridge domain
export async function bridgeDomain(body: any) {
  return apiRequest("/v1/smart-contract/bridgeDomain", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
