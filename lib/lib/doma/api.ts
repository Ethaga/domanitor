// lib/doma-api.ts
const BASE_URL = process.env.DOMA_API_URL || "https://api-testnet.doma.xyz";
const API_KEY = process.env.DOMA_API_KEY || "";

export async function apiRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "Api-Key": API_KEY,
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API Error ${res.status}: ${err}`);
  }

  return res.json();
}
