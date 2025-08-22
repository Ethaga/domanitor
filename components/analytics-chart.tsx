"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, DollarSign, Activity, Users } from "lucide-react"

const portfolioData = [
  { month: "Jan", value: 1200000, transactions: 45, users: 120 },
  { month: "Feb", value: 1350000, transactions: 52, users: 145 },
  { month: "Mar", value: 1180000, transactions: 38, users: 132 },
  { month: "Apr", value: 1420000, transactions: 61, users: 168 },
  { month: "May", value: 1680000, transactions: 73, users: 195 },
  { month: "Jun", value: 1850000, transactions: 89, users: 234 },
  { month: "Jul", value: 2100000, transactions: 102, users: 267 },
  { month: "Aug", value: 2400000, transactions: 118, users: 298 },
]

const chainDistribution = [
  { name: "Doma", value: 45, color: "#8b5cf6" },
  { name: "Ethereum", value: 30, color: "#4f46e5" },
  { name: "Polygon", value: 15, color: "#d97706" },
  { name: "Arbitrum", value: 10, color: "#ea580c" },
]

const domainCategories = [
  { category: "DeFi", count: 234, value: 890000 },
  { category: "NFT", count: 156, value: 670000 },
  { category: "Gaming", count: 89, value: 340000 },
  { category: "Tech", count: 198, value: 520000 },
  { category: "Finance", count: 145, value: 780000 },
]

export function AnalyticsChart() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Portfolio Value</p>
                <p className="text-2xl font-bold">$2.4M</p>
                <p className="text-xs text-green-600">+18.2% from last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                <p className="text-2xl font-bold">118</p>
                <p className="text-xs text-green-600">+15.6% from last month</p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">298</p>
                <p className="text-xs text-green-600">+12.4% from last month</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
                <p className="text-2xl font-bold">24.8%</p>
                <p className="text-xs text-green-600">+3.2% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Value Trend</CardTitle>
            <CardDescription>Monthly portfolio value and growth</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "Portfolio Value",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--chart-1))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chain Distribution</CardTitle>
            <CardDescription>Domains tokenized across different chains</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                doma: {
                  label: "Doma",
                  color: "#8b5cf6",
                },
                ethereum: {
                  label: "Ethereum",
                  color: "#4f46e5",
                },
                polygon: {
                  label: "Polygon",
                  color: "#d97706",
                },
                arbitrum: {
                  label: "Arbitrum",
                  color: "#ea580c",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chainDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chainDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Volume</CardTitle>
            <CardDescription>Monthly transaction activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                transactions: {
                  label: "Transactions",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="transactions" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Domain Categories</CardTitle>
            <CardDescription>Portfolio breakdown by domain type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {domainCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{category.category}</div>
                    <div className="text-sm text-muted-foreground">{category.count} domains</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-semibold">${(category.value / 1000).toFixed(0)}K</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
