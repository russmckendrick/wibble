interface IPInfo {
	ipv4?: string
	ipv6?: string
	timestamp: string
	source: string
}

function isIPv4(ip: string): boolean {
	return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)
}

function isIPv6(ip: string): boolean {
	return ip.includes(':') && /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$|^([0-9a-fA-F]{1,4}:)*::([0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$/.test(ip)
}

async function getIPFromHeaders(request: Request): Promise<Partial<IPInfo>> {
	const connectingIP = request.headers.get('CF-Connecting-IP') || 
						 request.headers.get('True-Client-IP') ||
						 request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
						 request.headers.get('X-Real-IP')
	
	const ipv6Header = request.headers.get('CF-Connecting-IPv6')
	
	const result: Partial<IPInfo> = { source: 'cloudflare-headers' }
	
	if (connectingIP) {
		if (isIPv4(connectingIP)) {
			result.ipv4 = connectingIP
		} else if (isIPv6(connectingIP)) {
			result.ipv6 = connectingIP
		}
	}
	
	if (ipv6Header && isIPv6(ipv6Header)) {
		result.ipv6 = ipv6Header
	}
	
	return result
}

async function getIPFromExternalAPIs(): Promise<Partial<IPInfo>> {
	const results: Partial<IPInfo> = { source: 'external-apis' }
	
	const ipServices = [
		'https://api.ipify.org?format=text',
		'https://icanhazip.com/',
		'https://ipinfo.io/ip',
		'https://checkip.amazonaws.com/'
	]
	
	const ipv6Services = [
		'https://api64.ipify.org?format=text', 
		'https://icanhazip.com/',
		'https://ipv6.icanhazip.com/'
	]
	
	// Try to get IPv4
	for (const service of ipServices) {
		try {
			const response = await fetch(service, {
				cf: { cacheTtl: 300 }
			})
			if (response.ok) {
				const ip = (await response.text()).trim()
				if (isIPv4(ip)) {
					results.ipv4 = ip
					break
				}
			}
		} catch (err) {
			console.warn(`Failed to fetch IPv4 from ${service}:`, err)
		}
	}
	
	// Try to get IPv6
	for (const service of ipv6Services) {
		try {
			const response = await fetch(service, {
				cf: { cacheTtl: 300 }
			})
			if (response.ok) {
				const ip = (await response.text()).trim()
				if (isIPv6(ip)) {
					results.ipv6 = ip
					break
				}
			}
		} catch (err) {
			console.warn(`Failed to fetch IPv6 from ${service}:`, err)
		}
	}
	
	return results
}

async function getIPInfo(request: Request): Promise<IPInfo> {
	// Get the real client IP from Cloudflare headers
	const clientIP = request.headers.get('CF-Connecting-IP') || 
					 request.headers.get('True-Client-IP') ||
					 request.headers.get('X-Real-IP')
	
	const result: IPInfo = {
		timestamp: new Date().toISOString(),
		source: 'cloudflare-headers'
	}
	
	if (clientIP) {
		if (isIPv4(clientIP)) {
			result.ipv4 = clientIP
		} else if (isIPv6(clientIP)) {
			result.ipv6 = clientIP
		}
	}
	
	// If we didn't get an IP from headers, fall back to external APIs
	if (!result.ipv4 && !result.ipv6) {
		const externalInfo = await getIPFromExternalAPIs()
		return {
			...externalInfo,
			timestamp: result.timestamp
		}
	}
	
	return result
}

async function serveStaticAsset(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url)
	let pathname = url.pathname
	
	if (pathname === '/') {
		pathname = '/index.html'
	}
	
	try {
		const response = await env.ASSETS.fetch(request)
		return response
	} catch (error) {
		console.error(`Failed to serve asset ${pathname}:`, error)
		return new Response('Not Found', { status: 404 })
	}
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url)
		
		if (url.pathname === '/json') {
			const ipInfo = await getIPInfo(request)
			return new Response(JSON.stringify(ipInfo, null, 2), {
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Cache-Control': 'no-cache'
				}
			})
		}
		
		return serveStaticAsset(request, env)
	},
} satisfies ExportedHandler<Env>;
