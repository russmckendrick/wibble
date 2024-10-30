export async function onRequest(context) {
  const request = context.request;

  const clientIP = {
    ipv4: null,
    ipv6: null,
    provider: 'Wibble',
    city: 'Unknown',
    region: 'Unknown',
    postal: 'Unknown',
    country: 'Unknown',
    timezone: 'Unknown',
    isp: 'Unknown',
  };

  // Get connecting IP from headers
  const connectingIP = request.headers.get('CF-Connecting-IP');

  // Determine if it's IPv4 or IPv6
  if (connectingIP) {
    if (isValidIPv4(connectingIP)) {
      clientIP.ipv4 = connectingIP;
    } else if (isValidIPv6(connectingIP)) {
      clientIP.ipv6 = connectingIP;
    }
  }

  // Fallback methods if connecting IP wasn't set or was only one type
  if (!clientIP.ipv4) {
    const ipv4 = request.headers.get('CF-Connecting-IPv4') || request.headers.get('X-Real-IP');
    if (ipv4 && isValidIPv4(ipv4)) {
      clientIP.ipv4 = ipv4;
    }
  }

  if (!clientIP.ipv6) {
    const ipv6 = request.headers.get('CF-Connecting-IPv6');
    if (ipv6 && isValidIPv6(ipv6)) {
      clientIP.ipv6 = ipv6;
    }
  }

  // Fetch geolocation information from IP API if IPv4 is found
  if (clientIP.ipv4) {
    try {
      const response = await fetch(`https://ipapi.co/${clientIP.ipv4}/json/`);
      const data = await response.json();

      if (!data.error) {
        clientIP.city = data.city || 'Unknown';
        clientIP.region = data.region || 'Unknown';
        clientIP.postal = data.postal || 'Unknown';
        clientIP.country = data.country_name || 'Unknown';
        clientIP.timezone = data.timezone || 'Unknown';
        clientIP.isp = data.org || 'Unknown';
      }
    } catch (error) {
      console.error('Error fetching geolocation data:', error);
    }
  }

  return new Response(JSON.stringify(clientIP, null, 2), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
