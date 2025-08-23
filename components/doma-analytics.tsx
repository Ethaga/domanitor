"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DomaAPI } from "@/lib/doma-api"
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Globe,
  Users,
  Zap,
  Target,
  ArrowUp,
  ArrowDown,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Coins,
  Network,
  Clock,
  Shield
} from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface AnalyticsData {
  volume: number
  transactions: number
  uniqueUsers: number
  averagePrice: number
  floorPrice: number
  topDomains: Array<{
    name: string
    tokenId: string
    owner: string
    registrar: string
    price?: number
    volume?: number
  }>
  recentTransactions: Array<{
    id: string
    type: 'mint' | 'transfer' | 'burn'
    from: string
    to: string
    tokenId: string
    timestamp: string
    transactionHash: string
  }>
  chartData: {
    volume: Array<{ date: string; volume: number; transactions: number }>
    registrars: Array<{ name: string; count: number; percentage: number }>
    priceDistribution: Array<{ range: string; count: number }>
    activity: Array<{ date: string; mints: number; transfers: number; burns: number }>
  }
}

interface DomaAnalyticsProps {
  walletAddress: string
  isConnected: boolean
}

const CHART_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

export function DomaAnalytics({ walletAddress, isConnected }: DomaAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('7d')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadAnalyticsData()
  }, [timeframe])

  const loadAnalyticsData = async () => {
    setLoading(true)
    try {
      const data = await DomaAPI.getDomaAnalytics(timeframe)
      
      // Generate mock chart data based on timeframe
      const chartData = generateChartData(timeframe)
      
      const fullAnalyticsData: AnalyticsData = {
        ...data,
        chartData
      }
      
      setAnalyticsData(fullAnalyticsData)
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await loadAnalyticsData()
    setRefreshing(false)
  }

  const generateChartData = (timeframe: string) => {
    const days = timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : 30
    const dataPoints = timeframe === '24h' ? 24 : days
    
    return {
      volume: Array.from({ length: dataPoints }, (_, i) => {
        const date = new Date()
        if (timeframe === '24h') {
          date.setHours(date.getHours() - (dataPoints - i - 1))
          return {
            date: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            volume: Math.floor(Math.random() * 50000) + 10000,
            transactions: Math.floor(Math.random() * 100) + 20
          }
        } else {
          date.setDate(date.getDate() - (dataPoints - i - 1))
          return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            volume: Math.floor(Math.random() * 200000) + 50000,
            transactions: Math.floor(Math.random() * 500) + 100
          }
        }
      }),
      registrars: [
        { name: 'D3', count: 45, percentage: 45 },
        { name: 'GoDaddy', count: 25, percentage: 25 },
        { name: 'Namecheap', count: 15, percentage: 15 },
        { name: 'Cloudflare', count: 10, percentage: 10 },
        { name: 'Others', count: 5, percentage: 5 }
      ],
      priceDistribution: [
        { range: '< $100', count: 120 },
        { range: '$100-$1K', count: 85 },
        { range: '$1K-$10K', count: 45 },
        { range: '$10K-$100K', count: 15 },
        { range: '> $100K', count: 5 }
      ],
      activity: Array.from({ length: dataPoints }, (_, i) => {
        const date = new Date()
        if (timeframe === '24h') {
          date.setHours(date.getHours() - (dataPoints - i - 1))
          return {
            date: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            mints: Math.floor(Math.random() * 20) + 5,
            transfers: Math.floor(Math.random() * 30) + 10,
            burns: Math.floor(Math.random() * 5) + 1
          }
        } else {
          date.setDate(date.getDate() - (dataPoints - i - 1))
          return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            mints: Math.floor(Math.random() * 50) + 20,
            transfers: Math.floor(Math.random() * 80) + 30,
            burns: Math.floor(Math.random() * 10) + 2
          }
        }
      })
    }
  }

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
                <div className="h-32 bg-muted rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Analytics unavailable</h3>
          <p className="text-muted-foreground">Unable to load analytics data at this time</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Doma Protocol Analytics
              </CardTitle>
              <CardDescription>
                Comprehensive analytics powered by Doma subgraph data and on-chain metrics
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeframe} onValueChange={(value: any) => setTimeframe(value)}>
                <SelectTrigger className="w-[120px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={refreshData} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold">{formatCurrency(analyticsData.volume)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+12.5%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">{formatNumber(analyticsData.transactions)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+8.2%</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Users</p>
                <p className="text-2xl font-bold">{formatNumber(analyticsData.uniqueUsers)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+15.7%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Price</p>
                <p className="text-2xl font-bold">{formatCurrency(analyticsData.averagePrice)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowDown className="h-3 w-3 text-red-600" />
                  <span className="text-xs text-red-600">-2.1%</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="volume" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="volume">Volume & Transactions</TabsTrigger>
          <TabsTrigger value="registrars">Registrars</TabsTrigger>
          <TabsTrigger value="pricing">Price Analysis</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="domains">Top Domains</TabsTrigger>
        </TabsList>

        <TabsContent value="volume" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Volume & Transaction Trends</CardTitle>
              <CardDescription>Trading volume and transaction count over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.chartData.volume}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'volume' ? formatCurrency(Number(value)) : value,
                      name === 'volume' ? 'Volume' : 'Transactions'
                    ]}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="volume"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Volume (USD)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="transactions"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Transactions"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registrars" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Registrar Distribution</CardTitle>
                <CardDescription>Domain distribution by registrar</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={analyticsData.chartData.registrars}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                    >
                      {analyticsData.chartData.registrars.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registrar Statistics</CardTitle>
                <CardDescription>Detailed breakdown by registrar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.chartData.registrars.map((registrar, index) => (
                    <div key={registrar.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                        />
                        <span className="font-medium">{registrar.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{registrar.count} domains</div>
                        <div className="text-sm text-muted-foreground">{registrar.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Price Distribution</CardTitle>
                <CardDescription>Domain count by price range</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.chartData.priceDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Price Metrics</CardTitle>
                <CardDescription>Key pricing statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-blue-600" />
                      <span>Floor Price</span>
                    </div>
                    <span className="font-bold">{formatCurrency(analyticsData.floorPrice)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span>Average Price</span>
                    </div>
                    <span className="font-bold">{formatCurrency(analyticsData.averagePrice)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <span>Median Price</span>
                    </div>
                    <span className="font-bold">{formatCurrency(analyticsData.averagePrice * 0.7)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-4 w-4 text-orange-600" />
                      <span>Highest Sale</span>
                    </div>
                    <span className="font-bold">{formatCurrency(analyticsData.averagePrice * 15)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Domain Activity</CardTitle>
              <CardDescription>Mints, transfers, and burns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.chartData.activity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="mints" stackId="a" fill="#10b981" name="Mints" />
                  <Bar dataKey="transfers" stackId="a" fill="#3b82f6" name="Transfers" />
                  <Bar dataKey="burns" stackId="a" fill="#ef4444" name="Burns" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full w-fit mx-auto mb-3">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {analyticsData.chartData.activity.reduce((sum, day) => sum + day.mints, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Mints</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit mx-auto mb-3">
                  <ArrowRightLeft className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {analyticsData.chartData.activity.reduce((sum, day) => sum + day.transfers, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Transfers</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full w-fit mx-auto mb-3">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {analyticsData.chartData.activity.reduce((sum, day) => sum + day.burns, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Burns</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="domains" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Domains by Value</CardTitle>
                <CardDescription>Highest valued tokenized domains</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.topDomains.slice(0, 5).map((domain, index) => (
                    <div key={domain.tokenId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            {domain.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {domain.registrar} • Token #{domain.tokenId}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${(Math.random() * 50000 + 10000).toFixed(0)}</div>
                        <div className="text-sm text-muted-foreground">Est. Value</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest domain transactions on Doma Protocol</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.recentTransactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          tx.type === 'mint' ? 'bg-green-100 dark:bg-green-900/20' :
                          tx.type === 'transfer' ? 'bg-blue-100 dark:bg-blue-900/20' :
                          'bg-red-100 dark:bg-red-900/20'
                        }`}>
                          {tx.type === 'mint' && <Zap className="h-3 w-3 text-green-600" />}
                          {tx.type === 'transfer' && <ArrowRightLeft className="h-3 w-3 text-blue-600" />}
                          {tx.type === 'burn' && <Trash2 className="h-3 w-3 text-red-600" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium capitalize">{tx.type}</div>
                          <div className="text-xs text-muted-foreground">
                            Token #{tx.tokenId}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono">
                          {tx.from.slice(0, 6)}...
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Additional Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Doma Protocol Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg mb-3">
                <Network className="h-8 w-8 text-blue-600 mx-auto" />
              </div>
              <h4 className="font-semibold mb-2">Cross-Chain Support</h4>
              <p className="text-sm text-muted-foreground">
                Seamless domain transfers across multiple blockchain networks
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg mb-3">
                <Shield className="h-8 w-8 text-green-600 mx-auto" />
              </div>
              <h4 className="font-semibold mb-2">ICANN Compliance</h4>
              <p className="text-sm text-muted-foreground">
                Full regulatory compliance maintained throughout tokenization
              </p>
            </div>

            <div className="text-center">
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg mb-3">
                <Clock className="h-8 w-8 text-purple-600 mx-auto" />
              </div>
              <h4 className="font-semibold mb-2">Real-time Sync</h4>
              <p className="text-sm text-muted-foreground">
                Instant synchronization between blockchain and DNS systems
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ArrowRightLeft({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18m-7-8l4-4m0 0l-4-4m4 4H3" />
    </svg>
  )
}

function Trash2({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}
