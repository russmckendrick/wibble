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
    <div className="min-h-screen geometric-bg flex flex-col" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)' }}>
      {/* Floating Header */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="hero-title">Wibble</h1>
          <div className="flex items-center gap-3">
            <Button
              onClick={refetch}
              disabled={loading}
              variant="outline"
              size="icon"
              className="transition-all duration-300 hover:scale-105 backdrop-blur-md"
              style={{ 
                borderColor: 'var(--glass-border)',
                backgroundColor: 'rgba(var(--color-card-rgb), 0.8)',
                color: 'var(--color-foreground)'
              }}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Hero Data Zone - 40% viewport */}
      <section className="flex-none pt-24 pb-8" style={{ minHeight: '40vh' }}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Status indicators */}
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

          {/* Asymmetrical Hero Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Large IP Display - 3 columns */}
            <div className="lg:col-span-3 space-y-8">
              {loading ? (
                <div className="space-y-6">
                  <Skeleton className="h-24 w-full" />
                  <div className="flex gap-3">
                    <Skeleton className="h-12 w-24" />
                    <Skeleton className="h-12 w-24" />
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="ip-display">
                    {ipData?.ip || 'Loading...'}
                  </div>
                  <div className="flex gap-4">
                    <Badge className={`status-badge ipv4-badge ${ipData?.type === 'IPv4' ? 'active' : ''}`}>
                      IPv4
                    </Badge>
                    <Badge className={`status-badge ipv6-badge ${ipData?.type === 'IPv6' ? 'active' : ''}`}>
                      IPv6
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Particle System Visualization - 2 columns */}
            <div className="lg:col-span-2">
              {loading ? (
                <Skeleton className="aspect-square w-full rounded-xl" />
              ) : locationData ? (
                <MapComponent
                  latitude={locationData.latitude}
                  longitude={locationData.longitude}
                  city={locationData.city}
                  country={locationData.country}
                  className="aspect-square w-full"
                />
              ) : (
                <div className="aspect-square w-full flex items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--color-muted)' }}>
                  <div className="text-center">
                    <Globe className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--color-blue)' }} />
                    <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Visualization unavailable</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Information Flow Zone - 40% viewport */}
      <section className="flex-1" style={{ minHeight: '40vh' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Location Hierarchy Card */}
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
                  <div className="space-y-6">
                    <div>
                      <div className="data-label">Country</div>
                      <div className="data-value text-xl">{locationData?.country || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="data-label">Region</div>
                      <div className="data-value">{locationData?.region || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="data-label">City</div>
                      <div className="data-value">{locationData?.city || 'Unknown'}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                      <div>
                        <div className="stat-number text-lg">{locationData?.latitude.toFixed(2)}°</div>
                        <div className="stat-label">Latitude</div>
                      </div>
                      <div>
                        <div className="stat-number text-lg">{locationData?.longitude.toFixed(2)}°</div>
                        <div className="stat-label">Longitude</div>
                      </div>
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
                  <div className="space-y-6">
                    <div>
                      <div className="data-label">ISP</div>
                      <div className="data-value leading-tight">{locationData?.isp || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="data-label">Connection Type</div>
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

            {/* Additional Data Card */}
            <Card className="location-card">
              <CardHeader className="pb-4">
                <CardTitle className="section-title">
                  <Globe className="mr-2 h-5 w-5" />
                  Details
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                {loading ? (
                  <div className="space-y-4">
                    <div>
                      <Skeleton className="h-3 w-12 mb-2" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <div>
                      <Skeleton className="h-3 w-16 mb-2" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <div className="data-label">IP Version</div>
                      <div className="data-value text-xl font-bold" style={{ color: ipData?.type === 'IPv6' ? 'var(--color-violet)' : 'var(--color-blue)' }}>
                        {ipData?.type || 'Unknown'}
                      </div>
                    </div>
                    <div>
                      <div className="data-label">Data Source</div>
                      <div className="data-value">
                        {error ? 'Fallback' : isFromCache ? 'Cache' : 'Live'}
                      </div>
                    </div>
                    <div>
                      <div className="data-label">Precision</div>
                      <div className="data-value">
                        {locationData ? 'City Level' : 'Unknown'}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Interactive Data Zone - 20% viewport */}
      <section className="flex-none py-8" style={{ minHeight: '20vh' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center space-y-8">
            
            {/* Primary Action Button */}
            <Button 
              onClick={copyToClipboard} 
              className="copy-button" 
              disabled={!ipData?.ip || loading}
            >
              <Copy className="mr-3 h-5 w-5" />
              Copy IP Address
            </Button>

            {/* Secondary Actions */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="transition-all duration-300 hover:scale-105 backdrop-blur-md"
                style={{ 
                  borderColor: 'var(--glass-border)',
                  backgroundColor: 'rgba(var(--color-card-rgb), 0.6)',
                  color: 'var(--color-foreground)'
                }}
                onClick={() => {
                  if (locationData) {
                    const data = {
                      ip: ipData?.ip,
                      location: locationData,
                      timestamp: new Date().toISOString()
                    };
                    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                    toast.success("Full data copied as JSON", {
                      style: {
                        backgroundColor: 'var(--color-card)',
                        color: 'var(--color-foreground)',
                        border: '1px solid var(--color-border)'
                      }
                    });
                  }
                }}
                disabled={!locationData}
              >
                <Globe className="mr-2 h-4 w-4" />
                Export Data
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="transition-all duration-300 hover:scale-105 backdrop-blur-md"
                style={{ 
                  borderColor: 'var(--glass-border)',
                  backgroundColor: 'rgba(var(--color-card-rgb), 0.6)',
                  color: 'var(--color-foreground)'
                }}
                onClick={() => {
                  if (locationData) {
                    const url = `https://www.google.com/maps/@${locationData.latitude},${locationData.longitude},12z`;
                    window.open(url, '_blank');
                  }
                }}
                disabled={!locationData}
              >
                <MapPin className="mr-2 h-4 w-4" />
                View on Map
              </Button>
            </div>

            {/* Subtle footer info */}
            <div className="text-center space-y-2 opacity-60">
              <p className="text-xs" style={{ color: 'var(--color-base01)' }}>
                Powered by modern web technologies & open APIs
              </p>
              <div className="flex items-center justify-center gap-4 text-xs">
                <span>React + TypeScript</span>
                <span>•</span>
                <span>Three.js</span>
                <span>•</span>
                <span>Tailwind CSS</span>
              </div>
            </div>

          </div>
        </div>
      </section>
      
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
