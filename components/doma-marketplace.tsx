"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DomaAPI, type DomainListing, type DomainOffer } from "@/lib/doma-api"
import {
  ShoppingCart,
  Tag,
  TrendingUp,
  Clock,
  ExternalLink,
  Eye,
  Heart,
  Search,
  Filter,
  Gavel,
  ArrowUpDown,
  Wallet,
  DollarSign,
  Globe,
  Shield
} from "lucide-react"

interface DomaMarketplaceProps {
  walletAddress: string
  isConnected: boolean
}

export function DomaMarketplace({ walletAddress, isConnected }: DomaMarketplaceProps) {
  const [listings, setListings] = useState<DomainListing[]>([])
  const [offers, setOffers] = useState<DomainOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"price" | "name" | "listed_date">("price")
  const [priceRange, setPriceRange] = useState<"all" | "under_1k" | "1k_10k" | "over_10k">("all")
  const [selectedCurrency, setSelectedCurrency] = useState<"all" | "ETH" | "USDC">("all")
  
  // Create listing form state
  const [listingForm, setListingForm] = useState({
    domain: "",
    price: "",
    currency: "USDC",
    duration: "30"
  })
  
  // Create offer form state
  const [offerForm, setOfferForm] = useState({
    domain: "",
    price: "",
    currency: "USDC",
    duration: "7"
  })

  const [createListingLoading, setCreateListingLoading] = useState(false)
  const [createOfferLoading, setCreateOfferLoading] = useState(false)

  useEffect(() => {
    loadMarketplaceData()
  }, [])

  const loadMarketplaceData = async () => {
    setLoading(true)
    try {
      const [listingsData] = await Promise.all([
        DomaAPI.getDomainListings()
      ])
      setListings(listingsData)
    } catch (error) {
      console.error('Failed to load marketplace data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateListing = async () => {
    if (!isConnected || !listingForm.domain || !listingForm.price) return

    setCreateListingLoading(true)
    try {
      const result = await DomaAPI.createDomainListing(
        listingForm.domain,
        parseFloat(listingForm.price),
        listingForm.currency,
        walletAddress
      )

      if (result.success) {
        await loadMarketplaceData()
        setListingForm({ domain: "", price: "", currency: "USDC", duration: "30" })
      }
    } catch (error) {
      console.error('Failed to create listing:', error)
    } finally {
      setCreateListingLoading(false)
    }
  }

  const handleCreateOffer = async () => {
    if (!isConnected || !offerForm.domain || !offerForm.price) return

    setCreateOfferLoading(true)
    try {
      const result = await DomaAPI.createDomainOffer(
        offerForm.domain,
        parseFloat(offerForm.price),
        offerForm.currency,
        walletAddress
      )

      if (result.success) {
        setOfferForm({ domain: "", price: "", currency: "USDC", duration: "7" })
      }
    } catch (error) {
      console.error('Failed to create offer:', error)
    } finally {
      setCreateOfferLoading(false)
    }
  }

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.domain.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCurrency = selectedCurrency === "all" || listing.currency === selectedCurrency
    const matchesPrice = priceRange === "all" || 
      (priceRange === "under_1k" && listing.price < 1000) ||
      (priceRange === "1k_10k" && listing.price >= 1000 && listing.price <= 10000) ||
      (priceRange === "over_10k" && listing.price > 10000)
    
    return matchesSearch && matchesCurrency && matchesPrice
  }).sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price
      case "name":
        return a.domain.localeCompare(b.domain)
      case "listed_date":
        return new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime()
      default:
        return 0
    }
  })

  return (
    <div className="space-y-6">
      {/* Marketplace Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Doma Domain Marketplace
          </CardTitle>
          <CardDescription>
            Trade tokenized domains using Doma Protocol's ICANN-compliant orderbook system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{listings.length}</div>
              <div className="text-sm text-muted-foreground">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${listings.reduce((sum, l) => sum + l.price, 0).toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${listings.length > 0 ? Math.round(listings.reduce((sum, l) => sum + l.price, 0) / listings.length).toLocaleString() : 0}
              </div>
              <div className="text-sm text-muted-foreground">Avg. Price</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                ${listings.length > 0 ? Math.min(...listings.map(l => l.price)).toLocaleString() : 0}
              </div>
              <div className="text-sm text-muted-foreground">Floor Price</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Listings</TabsTrigger>
          <TabsTrigger value="list">List Domain</TabsTrigger>
          <TabsTrigger value="offers">Make Offers</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search domains..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-[180px]">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price">Sort by Price</SelectItem>
                    <SelectItem value="name">Sort by Name</SelectItem>
                    <SelectItem value="listed_date">Sort by Date</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priceRange} onValueChange={(value: any) => setPriceRange(value)}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under_1k">Under $1K</SelectItem>
                    <SelectItem value="1k_10k">$1K - $10K</SelectItem>
                    <SelectItem value="over_10k">Over $10K</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedCurrency} onValueChange={(value: any) => setSelectedCurrency(value)}>
                  <SelectTrigger className="w-[120px]">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Currencies</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Domain Listings Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-8 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          {listing.domain}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Token #{listing.tokenId}
                          </Badge>
                          <Badge variant={listing.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {listing.status}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold">
                            {listing.price.toLocaleString()} {listing.currency}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Listed {new Date(listing.listedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Seller:</span>
                          <span className="font-mono">{listing.seller.slice(0, 6)}...{listing.seller.slice(-4)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Chain:</span>
                          <span>Doma Network Testnet</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1" disabled={!isConnected}>
                          <Wallet className="h-4 w-4 mr-2" />
                          Buy Now
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredListings.length === 0 && !loading && (
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No domains found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                List Your Domain
              </CardTitle>
              <CardDescription>
                List your tokenized domain on the Doma marketplace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isConnected && (
                <Alert>
                  <AlertDescription>
                    Connect your wallet to list domains on the marketplace.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="list-domain">Domain Name</Label>
                  <Input
                    id="list-domain"
                    placeholder="example.com"
                    value={listingForm.domain}
                    onChange={(e) => setListingForm(prev => ({ ...prev, domain: e.target.value }))}
                    disabled={!isConnected}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="list-price">Price</Label>
                  <Input
                    id="list-price"
                    type="number"
                    placeholder="1000"
                    value={listingForm.price}
                    onChange={(e) => setListingForm(prev => ({ ...prev, price: e.target.value }))}
                    disabled={!isConnected}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="list-currency">Currency</Label>
                  <Select
                    value={listingForm.currency}
                    onValueChange={(value) => setListingForm(prev => ({ ...prev, currency: value }))}
                    disabled={!isConnected}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="ETH">ETH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="list-duration">Duration (days)</Label>
                  <Select
                    value={listingForm.duration}
                    onValueChange={(value) => setListingForm(prev => ({ ...prev, duration: value }))}
                    disabled={!isConnected}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Shield className="h-4 w-4 text-blue-600" />
                <div className="text-sm">
                  <strong>Doma Protocol ensures:</strong> ICANN compliance, instant settlement, and automated escrow
                </div>
              </div>

              <Button
                onClick={handleCreateListing}
                disabled={!isConnected || !listingForm.domain || !listingForm.price || createListingLoading}
                className="w-full"
              >
                {createListingLoading ? "Creating Listing..." : "List Domain"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Make an Offer
              </CardTitle>
              <CardDescription>
                Submit offers on domains you're interested in purchasing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="offer-domain">Domain Name</Label>
                  <Input
                    id="offer-domain"
                    placeholder="example.com"
                    value={offerForm.domain}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, domain: e.target.value }))}
                    disabled={!isConnected}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offer-price">Offer Price</Label>
                  <Input
                    id="offer-price"
                    type="number"
                    placeholder="1000"
                    value={offerForm.price}
                    onChange={(e) => setOfferForm(prev => ({ ...prev, price: e.target.value }))}
                    disabled={!isConnected}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offer-currency">Currency</Label>
                  <Select
                    value={offerForm.currency}
                    onValueChange={(value) => setOfferForm(prev => ({ ...prev, currency: value }))}
                    disabled={!isConnected}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="ETH">ETH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offer-duration">Offer Duration</Label>
                  <Select
                    value={offerForm.duration}
                    onValueChange={(value) => setOfferForm(prev => ({ ...prev, duration: value }))}
                    disabled={!isConnected}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleCreateOffer}
                disabled={!isConnected || !offerForm.domain || !offerForm.price || createOfferLoading}
                className="w-full"
              >
                {createOfferLoading ? "Submitting Offer..." : "Submit Offer"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
