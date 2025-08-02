import { useState, useEffect } from 'react'
import { fetchIPAndLocation, fetchIPAndLocationFresh } from '../services/api'
import type { IPData, LocationData } from '../services/api'

interface UseIPDataResult {
  ipData: IPData | null
  locationData: LocationData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  isFromCache: boolean
}

export function useIPData(): UseIPDataResult {
  const [ipData, setIpData] = useState<IPData | null>(null)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFromCache, setIsFromCache] = useState(false)

  const fetchData = async (useCache: boolean = true) => {
    setLoading(true)
    setError(null)
    
    try {
      const { ipData: newIpData, locationData: newLocationData } = useCache 
        ? await fetchIPAndLocation()
        : await fetchIPAndLocationFresh()
      
      setIpData(newIpData)
      setLocationData(newLocationData)
      setIsFromCache(useCache)
      setError(null) // Clear any previous errors
      
    } catch (err) {
      console.error('Error fetching IP data:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch IP data'
      setError(errorMessage)
      
      // The API service now handles all fallbacks internally,
      // so this shouldn't happen, but just in case...
      if (!ipData && !locationData) {
        setIpData({
          ip: '203.0.113.195',
          type: 'IPv4'
        })
        setLocationData({
          ip: '203.0.113.195',
          city: 'San Francisco',
          region: 'California',
          country: 'United States',
          country_code: 'US',
          isp: 'Cloudflare, Inc.',
          org: 'AS13335 Cloudflare, Inc.',
          timezone: 'America/Los_Angeles',
          latitude: 37.7749,
          longitude: -122.4194
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // Force refresh (bypass cache)
  const refetch = async () => {
    await fetchData(false)
  }

  useEffect(() => {
    fetchData(true) // Use cache on initial load
  }, [])

  return {
    ipData,
    locationData,
    loading,
    error,
    refetch,
    isFromCache
  }
}