// functions/json.js

export function onRequest(context) {
  const request = context.request;
  
  // Get client IP addresses from the request
  const clientIP = {
    ipv4: null,
    ipv6: null,
    provider: 'Cloudflare'
  };

  // Get IP from CF-Connecting-IP header (most reliable)
  const ip = request.headers.get('CF-Connecting-IP');
  
  // Determine if it's IPv4 or IPv6
  if (ip.includes(':')) {
    clientIP.ipv6 = ip;
    // Try to get IPv4 from CF headers
    const ipv4 = request.headers.get('X-Real-IP') || 
                 request.headers.get('CF-Connecting-IPv4');
    if (ipv4 && !ipv4.includes(':')) {
      clientIP.ipv4 = ipv4;
    }
  } else {
    clientIP.ipv4 = ip;
  }

  return new Response(JSON.stringify(clientIP, null, 2), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}