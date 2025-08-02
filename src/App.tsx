import { ThemeProvider } from "./components/theme-provider"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Badge } from "./components/ui/badge"
import { Toaster } from "./components/ui/sonner"
import { Skeleton } from "./components/ui/skeleton"
import { useTheme } from "./components/theme-provider"
import { Moon, Sun, Copy, MapPin, Globe, Wifi, RefreshCw } from "lucide-react"
import { useIPData } from "./hooks/useIPData"
import { MapComponent } from "./components/MapComponent"
import { toast } from "sonner"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  const toggleTheme = () => {
    const currentTheme = theme === "system" 
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : theme
    setTheme(currentTheme === "light" ? "dark" : "light")
  }

  const isDark = theme === "dark" || 
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative border-2 transition-all duration-300"
      style={{ 
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-card)',
        color: 'var(--color-foreground)'
      }}
    >
      {isDark ? (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all duration-300" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all duration-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

function AppContent() {
  const { ipData, locationData, loading, error, refetch, isFromCache } = useIPData()

  const copyToClipboard = async () => {
    if (!ipData?.ip) return
    
    try {
      await navigator.clipboard.writeText(ipData.ip)
      toast.success("IP address copied to clipboard!", {
        style: {
          backgroundColor: 'var(--color-card)',
          color: 'var(--color-foreground)',
          border: '1px solid var(--color-border)'
        }
      })
    } catch (err) {
      toast.error("Failed to copy IP address", {
        style: {
          backgroundColor: 'var(--color-card)',
          color: 'var(--color-foreground)',
          border: '1px solid var(--color-border)'
        }
      })
    }
  }

  return (
    <div className="min-h-screen geometric-bg" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="hero-title">Wibble</h1>
          <div className="flex items-center gap-3">
            <Button
              onClick={refetch}
              disabled={loading}
              variant="outline"
              size="icon"
              className="transition-all duration-200 hover:scale-105"
              style={{ 
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-card)',
                color: 'var(--color-foreground)'
              }}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Status Display */}
        {error && (
          <div className="mb-8 p-4 rounded-xl status-indicator warning">
            <p className="font-semibold">Using Fallback Data</p>
            <p className="text-sm opacity-90 mt-1">Real APIs unavailable due to CORS restrictions</p>
          </div>
        )}
        
        {isFromCache && !error && (
          <div className="mb-8 p-4 rounded-xl status-indicator">
            <p className="font-semibold">📱 Data loaded from browser cache</p>
            <p className="text-sm opacity-90 mt-1">Click refresh to fetch latest information</p>
          </div>
        )}

        {/* Clean Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* IP Address Card - Spans 2 columns */}
          <Card className="ip-card lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="section-title">
                Your IP Address
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              {loading ? (
                <div className="space-y-6">
                  <Skeleton className="h-20 w-full" />
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                  <Skeleton className="h-12 w-44" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="ip-display">
                    {ipData?.ip || 'Loading...'}
                  </div>
                  <div className="flex gap-3">
                    <Badge className={`status-badge ipv4-badge ${ipData?.type === 'IPv4' ? 'active' : ''}`}>
                      IPv4
                    </Badge>
                    <Badge className={`status-badge ipv6-badge ${ipData?.type === 'IPv6' ? 'active' : ''}`}>
                      IPv6
                    </Badge>
                  </div>
                  <Button onClick={copyToClipboard} className="copy-button" disabled={!ipData?.ip}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy IP Address
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="location-card">
            <CardHeader className="pb-4">
              <CardTitle className="section-title">
                <MapPin className="mr-2 h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="card-decoration location-icon"></div>
              {loading ? (
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-3 w-8 mb-2" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-12 mb-2" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-14 mb-2" />
                    <Skeleton className="h-5 w-28" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="data-label">City</div>
                    <div className="data-value">{locationData?.city || 'Unknown'}</div>
                  </div>
                  <div>
                    <div className="data-label">Region</div>
                    <div className="data-value">{locationData?.region || 'Unknown'}</div>
                  </div>
                  <div>
                    <div className="data-label">Country</div>
                    <div className="data-value">{locationData?.country || 'Unknown'}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Map Card - Spans 2 columns */}
          <Card className="location-card lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="section-title">
                <Globe className="mr-2 h-5 w-5" />
                Geographic Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="aspect-video w-full rounded-xl" />
              ) : locationData ? (
                <div className="space-y-6">
                  <div className="map-container">
                    <MapComponent
                      latitude={locationData.latitude}
                      longitude={locationData.longitude}
                      city={locationData.city}
                      country={locationData.country}
                      className="aspect-video"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="stat-number">{locationData.latitude.toFixed(4)}°</div>
                      <div className="stat-label">Latitude</div>
                    </div>
                    <div>
                      <div className="stat-number">{locationData.longitude.toFixed(4)}°</div>
                      <div className="stat-label">Longitude</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video flex items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--color-muted)' }}>
                  <div className="text-center">
                    <MapPin className="h-8 w-8 mx-auto mb-2" style={{ color: 'var(--color-blue)' }} />
                    <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Location unavailable</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Network Information Card */}
          <Card className="location-card">
            <CardHeader className="pb-4">
              <CardTitle className="section-title">
                <Wifi className="mr-2 h-5 w-5" />
                Network
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="card-decoration network-icon"></div>
              {loading ? (
                <div className="space-y-4">
                  <div>
                    <Skeleton className="h-3 w-6 mb-2" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-16 mb-2" />
                    <Skeleton className="h-5 w-28" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-12 mb-2" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="data-label">ISP</div>
                    <div className="data-value leading-tight">{locationData?.isp || 'Unknown'}</div>
                  </div>
                  <div>
                    <div className="data-label">Type</div>
                    <div className="data-value">
                      {ipData?.type === 'IPv6' ? 'IPv6' : locationData?.isp?.includes('Cloudflare') ? 'CDN' : 'ISP'}
                    </div>
                  </div>
                  <div>
                    <div className="data-label">Timezone</div>
                    <div className="data-value">{locationData?.timezone || 'Unknown'}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
      
      <Toaster />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="wibble-ui-theme">
      <AppContent />
    </ThemeProvider>
  )
}

export default App
