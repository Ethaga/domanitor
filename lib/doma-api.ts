// Tambahkan pada class DomaAPI
static async getDashboardStats() {
  try {
    const response = await fetch('https://api-testnet.doma.xyz/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            chainStatistics {
              totalActiveWallets
              totalTransactions
              totalNamesTokenized
              totalNamesTokenizedCumulative
              totalRevenueUsd
            }
          }
        `
      }),
    });
    if (!response.ok) throw new Error('Failed to fetch chain statistics');
    const { data } = await response.json();
    const stats = data.chainStatistics;
    return {
      totalDomains: stats.totalNamesTokenized,
      activeListings: stats.totalActiveWallets, // penyesuaian field, modify as needed
      recentActivity: [], // Belum ada di schema, bisa diisi dari query lain jika butuh
      priceChange24h: 0, // Belum ada di schema, set 0 atau ambil dari API lain jika ada
      newRegistrations24h: 0, // Belum ada di schema, set 0 atau ambil dari API lain jika ada
      totalVolume: stats.totalRevenueUsd,
      totalTransactions: stats.totalTransactions
    };
  } catch (error) {
    console.error('[DomaAPI] getDashboardStats error:', error);
    return {
      totalDomains: 0,
      activeListings: 0,
      recentActivity: [],
      priceChange24h: 0,
      newRegistrations24h: 0,
      totalVolume: 0,
      totalTransactions: 0
    };
  }
}