// functions/json.js

export function onRequest(context) {
  const request = context.request;
  
  const clientIP = {
    ipv4: null,
    ipv6: null,
    provider: 'Cloudflare'
  };

  // Try specific IPv4 headers first
  clientIP.ipv4 = request.headers.get('CF-Connecting-IPv4') || 
                  request.headers.get('X-Real-IP');

  // Try specific IPv6 headers
  clientIP.ipv6 = request.headers.get('CF-Connecting-IPv6');

  // If we don't have both yet, try the general CF-Connecting-IP
  const connectingIP = request.headers.get('CF-Connecting-IP');
  if (connectingIP) {
    if (connectingIP.includes(':') && !clientIP.ipv6) {
      clientIP.ipv6 = connectingIP;
    } else if (!connectingIP.includes(':') && !clientIP.ipv4) {
      clientIP.ipv4 = connectingIP;
    }
  }

  // Check if we can get the IPv4 from the client hints
  if (!clientIP.ipv4 && request.headers.get('sec-ch-ua-platform')) {
    const xff = request.headers.get('X-Forwarded-For');
    if (xff) {
      const ips = xff.split(',').map(ip => ip.trim());
      const possibleIPv4 = ips[0];
      if (possibleIPv4 && !possibleIPv4.includes(':')) {
        clientIP.ipv4 = possibleIPv4;
      }
    }
  }

  return new Response(JSON.stringify(clientIP, null, 2), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}