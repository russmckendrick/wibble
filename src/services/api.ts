// API services for IP and geolocation data with caching and fallbacks

import { ipCache } from './cache'
import { fetchLocalIPData, getFallbackData } from './fallback'

export interface IPData {
  ip: string
  type: 'IPv4' | 'IPv6'
}

export interface LocationData {
  ip: string
  city: string
  region: string
  country: string
  country_code: string
  isp: string
  org: string
  timezone: string
  latitude: number
  longitude: number
  accuracy?: number
}

const CACHE_KEY = 'ip-location-data'
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

// Get user's IP address from ipify.org with CORS proxy fallback
async function fetchUserIP(): Promise<IPData> {
  const endpoints = [
    'https://api.ipify.org?format=json',
    'https://api64.ipify.org?format=json', // IPv6 support
    'https://ipapi.co/ip/', // Alternative service
  ]
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(5000)
      })
      
      if (!response.ok) continue
      
      let data
      if (endpoint.includes('ipapi.co')) {
        // ipapi.co returns plain text for /ip/ endpoint
        const ip = await response.text()
        data = { ip: ip.trim() }
      } else {
        data = await response.json()
      }
      
      const type: 'IPv4' | 'IPv6' = data.ip.includes(':') ? 'IPv6' : 'IPv4'
      
      return { ip: data.ip, type }
    } catch (error) {
      console.warn(`Failed to fetch from ${endpoint}:`, error)
      continue
    }
  }
  
  throw new Error('All IP services failed')
}

// Get geolocation data from ipapi.co with fallbacks
async function fetchLocationData(ip: string): Promise<LocationData> {
  const endpoints = [
    `https://ipapi.co/${ip}/json/`,
    `https://api.ipapi.com/${ip}?access_key=free`, // Free tier alternative
  ]
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(8000)
      })
      
      if (!response.ok) continue
      
      const data = await response.json()
      
      if (data.error) continue
      
      return {
        ip: data.ip,
        city: data.city || 'Unknown',
        region: data.region || data.region_name || 'Unknown',
        country: data.country_name || data.country || 'Unknown',
        country_code: data.country_code || data.country || 'XX',
        isp: data.org || data.isp || 'Unknown ISP',
        org: data.org || data.isp || 'Unknown Organization',
        timezone: data.timezone || 'Unknown',
        latitude: data.latitude || data.lat || 0,
        longitude: data.longitude || data.lon || 0,
        accuracy: data.accuracy
      }
    } catch (error) {
      console.warn(`Failed to fetch location from ${endpoint}:`, error)
      continue
    }
  }
  
  throw new Error('All location services failed')
}

// Main function with comprehensive fallback chain
export async function fetchIPAndLocation(): Promise<{ ipData: IPData; locationData: LocationData }> {
  // 1. Try to get from cache first
  try {
    const cached = await ipCache.get(CACHE_KEY)
    if (cached) {
      console.log('Using cached IP data')
      return cached
    }
  } catch (error) {
    console.warn('Cache read failed:', error)
  }
  
  // 2. Try real APIs
  try {
    console.log('Fetching from real APIs...')
    const ipData = await fetchUserIP()
    const locationData = await fetchLocationData(ipData.ip)
    
    const result = { ipData, locationData }
    
    // Cache successful result
    try {
      await ipCache.set(CACHE_KEY, result, CACHE_DURATION)
      console.log('Cached successful API response')
    } catch (error) {
      console.warn('Cache write failed:', error)
    }
    
    return result
    
  } catch (error) {
    console.warn('Real APIs failed:', error)
  }
  
  // 3. Try local mock API (simulates working service)
  try {
    console.log('Using local mock API...')
    const result = await fetchLocalIPData()
    
    // Cache fallback result for shorter duration
    try {
      await ipCache.set(CACHE_KEY, result, 60 * 1000) // 1 minute cache for fallback
    } catch (error) {
      console.warn('Cache write failed:', error)
    }
    
    return result
    
  } catch (error) {
    console.warn('Local mock API failed:', error)
  }
  
  // 4. Final fallback - static data
  console.log('Using static fallback data')
  return getFallbackData()
}

// Force refresh (bypass cache)
export async function fetchIPAndLocationFresh(): Promise<{ ipData: IPData; locationData: LocationData }> {
  try {
    await ipCache.delete(CACHE_KEY)
  } catch (error) {
    console.warn('Cache clear failed:', error)
  }
  
  return fetchIPAndLocation()
}

// Clear all cached data
export async function clearCache(): Promise<void> {
  try {
    await ipCache.clear()
    console.log('Cache cleared successfully')
  } catch (error) {
    console.warn('Cache clear failed:', error)
  }
}