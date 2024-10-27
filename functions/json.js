function isValidIPv4(ip) {
  if (!ip) return false;
  // Check if it's an IPv4 address
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Regex.test(ip)) return false;
  
  // Validate each octet
  const octets = ip.split('.');
  return octets.every(octet => {
    const num = parseInt(octet, 10);
    return num >= 0 && num <= 255;
  });
}

function isValidIPv6(ip) {
  if (!ip) return false;
  // Basic IPv6 format check
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$/;
  return ipv6Regex.test(ip);
}

export function onRequest(context) {
  const request = context.request;
  
  // Check if the request is from the allowed domain
  const origin = request.headers.get('Origin');
  const allowedOrigin = 'https://wibble.foo';
  
  // If origin doesn't match, return 403 Forbidden
  if (!origin || origin !== allowedOrigin) {
    return new Response('Forbidden', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }

  // Handle preflight CORS request
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      }
    });
  }
  
  const clientIP = {
    ipv4: null,
    ipv6: null,
    provider: 'Cloudflare'
  };

  // Get IPs from headers
  const connectingIP = request.headers.get('CF-Connecting-IP');
  const ipv4 = request.headers.get('CF-Connecting-IPv4');
  const ipv6 = request.headers.get('CF-Connecting-IPv6');
  const realIP = request.headers.get('X-Real-IP');

  // Try to get IPv4
  if (ipv4 && isValidIPv4(ipv4)) {
    clientIP.ipv4 = ipv4;
  } else if (realIP && isValidIPv4(realIP)) {
    clientIP.ipv4 = realIP;
  } else if (connectingIP && isValidIPv4(connectingIP)) {
    clientIP.ipv4 = connectingIP;
  }

  // Try to get IPv6
  if (ipv6 && isValidIPv6(ipv6)) {
    clientIP.ipv6 = ipv6;
  } else if (connectingIP && isValidIPv6(connectingIP)) {
    clientIP.ipv6 = connectingIP;
  }

  return new Response(JSON.stringify(clientIP, null, 2), {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': allowedOrigin,
      'Vary': 'Origin' // Important when using specific origin instead of wildcard
    }
  });
}