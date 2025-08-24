"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DomaAPI } from "@/lib/doma-api"
import {
  Bell,
  Zap,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Globe,
  Radio,
  Webhook,
  Settings,
  Plus,
  Trash2,
  Eye,
  PauseCircle,
  PlayCircle,
  TrendingUp,
  Shield,
  Target
} from "lucide-react"

interface MonitoringAlert {
  id: string
  type: 'expiration' | 'transfer' | 'sale' | 'price_change' | 'renewal'
  domain: string
  message: string
  timestamp: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  read: boolean
  metadata?: Record<string, any>
}

interface DomainMonitor {
  id: string
  domain: string
  isActive: boolean
  alertTypes: string[]
  webhookUrl?: string
  telegramChatId?: string
  emailAddress?: string
  createdAt: string
  lastCheck: string
  alertCount: number
}

interface DomaMonitoringProps {
  walletAddress: string
  isConnected: boolean
}

export function DomaMonitoring({ walletAddress, isConnected }: DomaMonitoringProps) {
  const [monitors, setMonitors] = useState<DomainMonitor[]>([])
  const [alerts, setAlerts] = useState<MonitoringAlert[]>([])
  const [realtimeEnabled, setRealtimeEnabled] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const [unreadCount, setUnreadCount] = useState(0)
  
  // WebSocket ref for real-time monitoring
  const wsRef = useRef<WebSocket | null>(null)
  
  // New monitor form
  const [newMonitor, setNewMonitor] = useState({
    domain: "",
    alertTypes: [] as string[],
    webhookUrl: "",
    telegramChatId: "",
    emailAddress: ""
  })

  useEffect(() => {
    if (isConnected) {
      loadExistingMonitors()
      loadRecentAlerts()
    }
  }, [isConnected, walletAddress])

  useEffect(() => {
    if (realtimeEnabled && isConnected) {
      connectWebSocket()
    } else {
      disconnectWebSocket()
    }

    return () => {
      disconnectWebSocket()
    }
  }, [realtimeEnabled, isConnected])

  useEffect(() => {
    const count = alerts.filter(alert => !alert.read).length
    setUnreadCount(count)
  }, [alerts])

  const loadExistingMonitors = () => {
    // Mock data for existing monitors
    const mockMonitors: DomainMonitor[] = [
      {
        id: "monitor_1",
        domain: "crypto.com",
        isActive: true,
        alertTypes: ["expiration", "transfer", "sale"],
        webhookUrl: "https://api.example.com/webhook",
        telegramChatId: "@cryptomonitor",
        emailAddress: "alerts@example.com",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        lastCheck: new Date(Date.now() - 300000).toISOString(),
        alertCount: 12
      },
      {
        id: "monitor_2",
        domain: "defi.xyz",
        isActive: true,
        alertTypes: ["expiration", "price_change"],
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        lastCheck: new Date(Date.now() - 600000).toISOString(),
        alertCount: 5
      }
    ]
    setMonitors(mockMonitors)
  }

  const loadRecentAlerts = () => {
    // Mock recent alerts
    const mockAlerts: MonitoringAlert[] = [
      {
        id: "alert_1",
        type: "expiration",
        domain: "crypto.com",
        message: "Domain expires in 30 days",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        severity: "medium",
        read: false,
        metadata: { daysUntilExpiration: 30 }
      },
      {
        id: "alert_2",
        type: "transfer",
        domain: "nft.io",
        message: "Domain ownership transferred",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        severity: "high",
        read: false,
        metadata: { 
          from: "0x123...abc",
          to: "0x456...def",
          txHash: "0x789...xyz"
        }
      },
      {
        id: "alert_3",
        type: "price_change",
        domain: "defi.xyz",
        message: "Domain price increased by 25%",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        severity: "low",
        read: true,
        metadata: { 
          oldPrice: 1000,
          newPrice: 1250,
          changePercent: 25
        }
      }
    ]
    setAlerts(mockAlerts)
  }

  const connectWebSocket = async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    setConnectionStatus('connecting')
    
    try {
      const ws = await DomaAPI.subscribeToAlerts(walletAddress, (alert) => {
        const newAlert: MonitoringAlert = {
          id: `alert_${Date.now()}`,
          type: alert.type,
          domain: alert.domain,
          message: alert.message,
          timestamp: new Date().toISOString(),
          severity: alert.severity || 'medium',
          read: false,
          metadata: alert.metadata
        }
        
        setAlerts(prev => [newAlert, ...prev])
        
        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(`Domain Alert: ${alert.domain}`, {
            body: alert.message,
            icon: '/domanitor-logo.png'
          })
        }
      })

      wsRef.current = ws
      setConnectionStatus('connected')
      setRealtimeEnabled(true)
      
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
      setConnectionStatus('disconnected')
      setRealtimeEnabled(false)
    }
  }

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setConnectionStatus('disconnected')
  }

  const handleCreateMonitor = async () => {
    if (!isConnected || !newMonitor.domain || newMonitor.alertTypes.length === 0) return

    try {
      const result = await DomaAPI.setupDomainMonitoring(
        [newMonitor.domain],
        newMonitor.webhookUrl || `https://api.doma.xyz/webhook/${walletAddress}`
      )

      if (result.success) {
        const monitor: DomainMonitor = {
          id: result.monitoringId!,
          domain: newMonitor.domain,
          isActive: true,
          alertTypes: newMonitor.alertTypes,
          webhookUrl: newMonitor.webhookUrl || undefined,
          telegramChatId: newMonitor.telegramChatId || undefined,
          emailAddress: newMonitor.emailAddress || undefined,
          createdAt: new Date().toISOString(),
          lastCheck: new Date().toISOString(),
          alertCount: 0
        }

        setMonitors(prev => [monitor, ...prev])
        setNewMonitor({
          domain: "",
          alertTypes: [],
          webhookUrl: "",
          telegramChatId: "",
          emailAddress: ""
        })
      }
    } catch (error) {
      console.error('Failed to create monitor:', error)
    }
  }

  const toggleMonitor = (monitorId: string) => {
    setMonitors(prev => 
      prev.map(monitor => 
        monitor.id === monitorId 
          ? { ...monitor, isActive: !monitor.isActive }
          : monitor
      )
    )
  }

  const deleteMonitor = (monitorId: string) => {
    setMonitors(prev => prev.filter(monitor => monitor.id !== monitorId))
  }

  const markAlertAsRead = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    )
  }

  const markAllAlertsAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })))
  }

  const handleAlertTypeToggle = (alertType: string) => {
    setNewMonitor(prev => ({
      ...prev,
      alertTypes: prev.alertTypes.includes(alertType)
        ? prev.alertTypes.filter(type => type !== alertType)
        : [...prev.alertTypes, alertType]
    }))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'low': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />
      case 'high': return <XCircle className="h-4 w-4" />
      case 'medium': return <Clock className="h-4 w-4" />
      case 'low': return <CheckCircle className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Monitoring Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5" />
            Domain Monitoring Dashboard
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Real-time monitoring of your domains using Doma Protocol webhooks and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{monitors.length}</div>
              <div className="text-sm text-muted-foreground">Active Monitors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{monitors.filter(m => m.isActive).length}</div>
              <div className="text-sm text-muted-foreground">Running</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{alerts.length}</div>
              <div className="text-sm text-muted-foreground">Total Alerts</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500' : 
                  connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 
                  'bg-red-500'
                }`}></div>
                <div className="text-sm font-medium">
                  {connectionStatus === 'connected' ? 'Live' : 
                   connectionStatus === 'connecting' ? 'Connecting' : 'Offline'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={realtimeEnabled}
                  onCheckedChange={setRealtimeEnabled}
                  disabled={!isConnected}
                />
                <Label>Real-time Monitoring</Label>
              </div>
              {Notification.permission === 'default' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => Notification.requestPermission()}
                >
                  Enable Notifications
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={markAllAlertsAsRead} disabled={unreadCount === 0}>
                Mark All Read
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="monitors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monitors">Active Monitors</TabsTrigger>
          <TabsTrigger value="alerts">Recent Alerts</TabsTrigger>
          <TabsTrigger value="setup">Setup Monitor</TabsTrigger>
        </TabsList>

        <TabsContent value="monitors" className="space-y-4">
          {monitors.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No monitors configured</h3>
                <p className="text-muted-foreground mb-4">Set up your first domain monitor to get started</p>
                <Button onClick={() => window.location.hash = '#setup'}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Monitor
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {monitors.map((monitor) => (
                <Card key={monitor.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${monitor.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span className="font-semibold">{monitor.domain}</span>
                            {!monitor.isActive && (
                              <Badge variant="secondary">Paused</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {monitor.alertCount} alerts • Last check: {new Date(monitor.lastCheck).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex flex-wrap gap-1">
                          {monitor.alertTypes.map((type) => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleMonitor(monitor.id)}
                        >
                          {monitor.isActive ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMonitor(monitor.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {(monitor.webhookUrl || monitor.telegramChatId || monitor.emailAddress) && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {monitor.webhookUrl && (
                            <div className="flex items-center gap-2">
                              <Webhook className="h-3 w-3" />
                              <span className="truncate">Webhook: {monitor.webhookUrl}</span>
                            </div>
                          )}
                          {monitor.telegramChatId && (
                            <div className="flex items-center gap-2">
                              <Bell className="h-3 w-3" />
                              <span>Telegram: {monitor.telegramChatId}</span>
                            </div>
                          )}
                          {monitor.emailAddress && (
                            <div className="flex items-center gap-2">
                              <Bell className="h-3 w-3" />
                              <span>Email: {monitor.emailAddress}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {alerts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No alerts yet</h3>
                <p className="text-muted-foreground">Alerts will appear here when domain events are detected</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <Card 
                  key={alert.id} 
                  className={`${!alert.read ? 'border-l-4 border-l-blue-500' : ''} hover:shadow-md transition-shadow`}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)}`}>
                          {getSeverityIcon(alert.severity)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Globe className="h-4 w-4" />
                            <span className="font-semibold">{alert.domain}</span>
                            <Badge variant="outline" className="text-xs">
                              {alert.type}
                            </Badge>
                            <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                              {alert.severity}
                            </Badge>
                            {!alert.read && (
                              <Badge variant="default" className="text-xs">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm mb-2">{alert.message}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{new Date(alert.timestamp).toLocaleString()}</span>
                            {alert.metadata && (
                              <span>
                                {Object.entries(alert.metadata).map(([key, value]) => (
                                  <span key={key} className="mr-2">
                                    {key}: {String(value)}
                                  </span>
                                ))}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!alert.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAlertAsRead(alert.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="setup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Setup New Monitor
              </CardTitle>
              <CardDescription>
                Configure monitoring for a domain with custom alert types and notification channels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isConnected && (
                <Alert>
                  <AlertDescription>
                    Connect your wallet to set up domain monitoring.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="monitor-domain">Domain Name</Label>
                  <Input
                    id="monitor-domain"
                    placeholder="example.com"
                    value={newMonitor.domain}
                    onChange={(e) => setNewMonitor(prev => ({ ...prev, domain: e.target.value }))}
                    disabled={!isConnected}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Alert Types</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { id: 'expiration', label: 'Expiration Warning', icon: Clock },
                      { id: 'transfer', label: 'Ownership Transfer', icon: Zap },
                      { id: 'sale', label: 'Domain Sale', icon: TrendingUp },
                      { id: 'price_change', label: 'Price Changes', icon: Activity },
                      { id: 'renewal', label: 'Domain Renewal', icon: Shield },
                    ].map(({ id, label, icon: Icon }) => (
                      <div key={id} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <input
                          type="checkbox"
                          id={id}
                          checked={newMonitor.alertTypes.includes(id)}
                          onChange={() => handleAlertTypeToggle(id)}
                          disabled={!isConnected}
                          className="rounded"
                        />
                        <label htmlFor={id} className="flex items-center gap-2 text-sm cursor-pointer">
                          <Icon className="h-4 w-4" />
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL (Optional)</Label>
                    <Input
                      id="webhook-url"
                      placeholder="https://api.example.com/webhook"
                      value={newMonitor.webhookUrl}
                      onChange={(e) => setNewMonitor(prev => ({ ...prev, webhookUrl: e.target.value }))}
                      disabled={!isConnected}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telegram-chat">Telegram Chat ID (Optional)</Label>
                    <Input
                      id="telegram-chat"
                      placeholder="@username or chat_id"
                      value={newMonitor.telegramChatId}
                      onChange={(e) => setNewMonitor(prev => ({ ...prev, telegramChatId: e.target.value }))}
                      disabled={!isConnected}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-address">Email Address (Optional)</Label>
                    <Input
                      id="email-address"
                      type="email"
                      placeholder="alerts@example.com"
                      value={newMonitor.emailAddress}
                      onChange={(e) => setNewMonitor(prev => ({ ...prev, emailAddress: e.target.value }))}
                      disabled={!isConnected}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <div className="text-sm">
                    <strong>Doma Protocol Monitoring:</strong> Real-time alerts, webhook integration, and cross-chain support
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCreateMonitor}
                disabled={!isConnected || !newMonitor.domain || newMonitor.alertTypes.length === 0}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Monitor
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
