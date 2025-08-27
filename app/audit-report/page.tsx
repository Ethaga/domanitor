"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Shield, CheckCircle } from "lucide-react"
import Image from "next/image"

export default function AuditReportPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image src="/domanitor-logo.png" alt="Domanitor Logo" width={32} height={32} className="h-8 w-8" />
              <h1 className="text-2xl font-bold text-foreground">Domanitor</h1>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <Shield className="h-3 w-3 mr-1" />
                Audited
              </Badge>
            </div>
            <Button variant="outline" asChild>
              <a href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Smart Contract Audit Report</h1>
            <p className="text-xl text-muted-foreground">Security Analysis for Domanitor DomainToken Contract</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Audit Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Auditor:</strong> CertiK (Simulated Report)
                  </p>
                  <p>
                    <strong>Date:</strong> August 25, 2025
                  </p>
                  <p>
                    <strong>Contract Version:</strong> v1.2.0
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Audit Type:</strong> Smart Contract Security Review
                  </p>
                  <p>
                    <strong>Blockchain:</strong> Ethereum (Doma Mainnet)
                  </p>
                  <p>
                    <strong>Status:</strong> <Badge className="bg-green-100 text-green-800">Passed</Badge>
                  </p>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-green-800 dark:text-green-200">Overall Assessment</h3>
                </div>
                <p className="text-green-700 dark:text-green-300">
                  No critical vulnerabilities found. Minor recommendations have been applied. The smart contract is
                  secure for production deployment.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Findings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Severity</th>
                      <th className="text-left p-3 font-semibold">Issue</th>
                      <th className="text-left p-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">
                        <Badge className="bg-orange-100 text-orange-800">Medium</Badge>
                      </td>
                      <td className="p-3">Reentrancy risk in withdraw function</td>
                      <td className="p-3">
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Fixed
                        </Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">
                        <Badge className="bg-yellow-100 text-yellow-800">Low</Badge>
                      </td>
                      <td className="p-3">Event emission missing in transfer</td>
                      <td className="p-3">
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Fixed
                        </Badge>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">
                        <Badge className="bg-blue-100 text-blue-800">Info</Badge>
                      </td>
                      <td className="p-3">Gas optimization opportunities</td>
                      <td className="p-3">
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Implemented
                        </Badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vulnerabilities Fixed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Security Improvements Implemented
                  </h4>
                  <ul className="space-y-2 text-green-700 dark:text-green-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                      <span>Reentrancy protection added to withdraw functions using OpenZeppelin ReentrancyGuard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                      <span>Improved input validation for domain names with regex pattern matching</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                      <span>Gas optimization for bulk operations (15% reduction in transaction costs)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                      <span>Enhanced access control with role-based permissions and multi-signature requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                      <span>Emergency pause functionality for critical security incidents</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Access Control
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Role-based permissions with multi-signature requirements
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Reentrancy Protection
                  </h4>
                  <p className="text-sm text-muted-foreground">OpenZeppelin ReentrancyGuard implementation</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Input Validation
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive parameter validation and bounds checking
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Emergency Controls
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Pause functionality and emergency withdrawal mechanisms
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => alert("Full audit report download would be available in production")}
            >
              <Download className="h-5 w-5 mr-2" />
              Download Full Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
