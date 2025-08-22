"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, ExternalLink, Clock, DollarSign, TrendingUp } from "lucide-react"

const mockDomains = [
  {
    name: "crypto-defi.com",
    status: "tokenized",
    value: "$45,000",
    expiry: "2025-12-15",
    chain: "Doma",
    alerts: 2,
  },
  {
    name: "web3-domains.xyz",
    status: "pending",
    value: "$12,500",
    expiry: "2025-03-22",
    chain: "Ethereum",
    alerts: 0,
  },
  {
    name: "nft-marketplace.io",
    status: "tokenized",
    value: "$78,900",
    expiry: "2026-01-08",
    chain: "Doma",
    alerts: 1,
  },
  {
    name: "blockchain-tech.net",
    status: "monitoring",
    value: "$23,400",
    expiry: "2025-06-30",
    chain: "Polygon",
    alerts: 3,
  },
]

export function DomainMonitor() {
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "tokenized":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "monitoring":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Domain Portfolio Monitor
          </CardTitle>
          <CardDescription>Real-time monitoring of your tokenized domains across multiple chains</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search domains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline">Add Domain</Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Chain</TableHead>
                  <TableHead>Alerts</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDomains.map((domain, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{domain.name}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(domain.status)}>{domain.status}</Badge>
                    </TableCell>
                    <TableCell className="font-mono">{domain.value}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {domain.expiry}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{domain.chain}</Badge>
                    </TableCell>
                    <TableCell>
                      {domain.alerts > 0 ? (
                        <Badge variant="destructive">{domain.alerts}</Badge>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Bulk Tokenize</h3>
                <p className="text-sm text-muted-foreground">Tokenize multiple domains</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Market Analysis</h3>
                <p className="text-sm text-muted-foreground">View domain trends</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Clock className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Renewal Manager</h3>
                <p className="text-sm text-muted-foreground">Manage expirations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
