"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DomaAPI, type DomainToken } from "@/lib/doma-api"
import { Search, ExternalLink, Clock, DollarSign, TrendingUp, Layers, RefreshCw } from "lucide-react"

interface DomainMonitorProps {
  walletAddress: string
  isConnected: boolean
}

export function DomainMonitor({ walletAddress, isConnected }: DomainMonitorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [domains, setDomains] = useState<DomainToken[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isConnected && walletAddress) {
      loadDomains()
    }
  }, [isConnected, walletAddress])

  const loadDomains = async () => {
    if (!walletAddress) return

    setLoading(true)
    setError("")

    try {
      const domainTokens = await DomaAPI.getDomainTokens(walletAddress)
      setDomains(domainTokens)
    } catch (err) {
      setError("Failed to load domain portfolio")
      console.error("[v0] Error loading domains:", err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "transferring":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const filteredDomains = domains.filter((domain) => domain.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Doma Protocol Portfolio
          </CardTitle>
          <CardDescription>Real-time monitoring of your tokenized domains on Doma Protocol</CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected && (
            <Alert className="mb-6">
              <AlertDescription>
                Connect your wallet to view your tokenized domain portfolio from Doma Protocol.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search your domains..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                disabled={!isConnected}
              />
            </div>
            <Button onClick={loadDomains} disabled={!isConnected || loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" asChild>
              <a href="https://start.doma.xyz" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Doma Testnet
              </a>
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isConnected && (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Domain</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Floor Price</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Registrar</TableHead>
                    <TableHead>Shares</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2" />
                        Loading domains from Doma Protocol...
                      </TableCell>
                    </TableRow>
                  ) : filteredDomains.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {isConnected
                          ? "No tokenized domains found. Start by tokenizing your first domain!"
                          : "Connect wallet to view domains"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDomains.map((domain) => (
                      <TableRow key={domain.id}>
                        <TableCell className="font-medium">{domain.name}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(domain.status)}>{domain.status}</Badge>
                        </TableCell>
                        <TableCell className="font-mono">${domain.floorPrice.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {domain.expirationDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{domain.registrar}</Badge>
                        </TableCell>
                        <TableCell>
                          {domain.fractionalized ? (
                            <div className="flex items-center gap-1">
                              <Layers className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {domain.availableShares}/{domain.totalShares}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">Whole</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={`https://sepolia.etherscan.io/token/${domain.tokenId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
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
                <p className="text-sm text-muted-foreground">Tokenize multiple domains on Doma</p>
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
                <p className="text-sm text-muted-foreground">View DomainFi trends</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Layers className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Fractionalize</h3>
                <p className="text-sm text-muted-foreground">Split domains into shares</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
