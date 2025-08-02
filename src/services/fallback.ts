// Fallback IP and location data for when APIs fail

import type { IPData, LocationData } from './api'

// Sample fallback data that could represent different scenarios
const fallbackData: Array<{ ipData: IPData; locationData: LocationData }> = [
  {
    ipData: { ip: '203.0.113.195', type: 'IPv4' },
    locationData: {
      ip: '203.0.113.195',
      city: 'San Francisco',
      region: 'California',
      country: 'United States',
      country_code: 'US',
      isp: 'Cloudflare, Inc.',
      org: 'AS13335 Cloudflare, Inc.',
      timezone: 'America/Los_Angeles',
      latitude: 37.7749,
      longitude: -122.4194,
    }
  },
  {
    ipData: { ip: '86.150.160.32', type: 'IPv4' },
    locationData: {
      ip: '86.150.160.32',
      city: 'Nottingham',
      region: 'England',
      country: 'United Kingdom',
      country_code: 'GB',
      isp: 'British Telecommunications PLC',
      org: 'British Telecommunications PLC',
      timezone: 'Europe/London',
      latitude: 52.9687,
      longitude: -1.0889,
    }
  },
  {
    ipData: { ip: '2001:db8::1', type: 'IPv6' },
    locationData: {
      ip: '2001:db8::1',
      city: 'Tokyo',
      region: 'Tokyo',
      country: 'Japan',
      country_code: 'JP',
      isp: 'NTT Communications Corporation',
      org: 'AS2914 NTT America, Inc.',
      timezone: 'Asia/Tokyo',
      latitude: 35.6762,
      longitude: 139.6503,
    }
  },
  {
    ipData: { ip: '192.168.1.100', type: 'IPv4' },
    locationData: {
      ip: '192.168.1.100',
      city: 'Sydney',
      region: 'New South Wales',
      country: 'Australia',
      country_code: 'AU',
      isp: 'Telstra Corporation Limited',
      org: 'AS1221 Telstra Corporation',
      timezone: 'Australia/Sydney',
      latitude: -33.8688,
      longitude: 151.2093,
    }
  }
]

// Get fallback data based on various factors
export function getFallbackData(): { ipData: IPData; locationData: LocationData } {
  // Try to get a semi-realistic fallback based on user's timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  
  // Simple mapping of timezones to likely regions
  if (timezone.includes('America')) {
    return fallbackData[0] // San Francisco
  } else if (timezone.includes('Europe')) {
    return fallbackData[1] // Nottingham
  } else if (timezone.includes('Asia')) {
    return fallbackData[2] // Tokyo
  } else if (timezone.includes('Australia')) {
    return fallbackData[3] // Sydney
  }
  
  // Default to San Francisco if we can't determine
  return fallbackData[0]
}

// Get random fallback for demonstration
export function getRandomFallbackData(): { ipData: IPData; locationData: LocationData } {
  const randomIndex = Math.floor(Math.random() * fallbackData.length)
  return fallbackData[randomIndex]
}

// Local mock API that simulates the real APIs but always works
export async function fetchLocalIPData(): Promise<{ ipData: IPData; locationData: LocationData }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))
  
  // Get timezone-based fallback
  const data = getFallbackData()
  
  // Add some randomization to make it feel more realistic
  const jitter = {
    latitude: (Math.random() - 0.5) * 0.01, // Small random offset
    longitude: (Math.random() - 0.5) * 0.01
  }
  
  return {
    ipData: data.ipData,
    locationData: {
      ...data.locationData,
      latitude: data.locationData.latitude + jitter.latitude,
      longitude: data.locationData.longitude + jitter.longitude,
    }
  }
}