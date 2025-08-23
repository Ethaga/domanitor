import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Play, FileText, Shield, Star } from "lucide-react"
import { CountdownTimer } from "@/components/countdown-timer"
import Image from "next/image"

export default function HackathonPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image src="/domanitor-logo.png" alt="Domanitor Logo" width={32} height={32} className="h-8 w-8" />
              <h1 className="text-2xl font-bold text-foreground">Domanitor</h1>
              <Badge variant="secondary" className="bg-accent text-accent-foreground">
                DomainFi Challenge
              </Badge>
            </div>
            <Button variant="outline" asChild>
              <a href="/">Back to Dashboard</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <CountdownTimer />

          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">🚀 DomainFi Challenge Submission</h1>
            <p className="text-xl text-muted-foreground">
              Revolutionizing Domain Finance with Doma Protocol Integration
            </p>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Track 3: Bots & Event Subscriptions
            </Badge>
          </div>

          {/* Submission Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Demo Video
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Watch our comprehensive demo showcasing Domanitor's innovative features
                </p>
                <Button asChild className="w-full">
                  <a
                    href="https://loom.com/share/domanitor-demo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Demo Video
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Whitepaper
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Technical documentation and architecture overview</p>
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <a
                    href="https://docs.domanitor.xyz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Read Whitepaper
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Audit Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Security audit and code review documentation</p>
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <a
                    href="https://github.com/Ethaga/domanitor/blob/main/audit.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Audit Report
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Unique Selling Proposition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  <strong>Fractional ownership + lending untuk domain Web3</strong>
                </p>
                <div className="space-y-2 text-sm">
                  <div>• AI-powered domain valuation engine</div>
                  <div>• Cross-chain domain tokenization</div>
                  <div>• Automated bot alerts & subscriptions</div>
                  <div>• DeFi lending with domain collateral</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Features */}
          <Card>
            <CardHeader>
              <CardTitle>🏆 Key Innovation Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">Doma Protocol Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Native integration with Doma testnet for domain tokenization and state synchronization
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Automated Bot System</h3>
                  <p className="text-sm text-muted-foreground">
                    Smart alerts for domain expiration, sales events, and market opportunities
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">DeFi Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Domain-backed lending, fractional ownership, and yield generation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <a
                href="https://dorahacks.io/domainfi/submit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-5 w-5" />
                Submit Project to DoraHacks
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
