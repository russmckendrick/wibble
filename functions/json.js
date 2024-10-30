export function onRequest(context) {
  const request = context.request;
  
  const clientIP = {
    ipv4: null,
    ipv6: null,
    provider: 'Wibble'
  };

  // Get connecting IP
  const connectingIP = request.headers.get('CF-Connecting-IP');

  // If connecting IP exists, determine if it's IPv4 or IPv6
  if (connectingIP) {
    if (isValidIPv4(connectingIP)) {
      clientIP.ipv4 = connectingIP;
    } else if (isValidIPv6(connectingIP)) {
      clientIP.ipv6 = connectingIP;
    }
  }

  // Try specific CF headers if connecting IP wasn't set or was only one type
  if (!clientIP.ipv4) {
    const ipv4 = request.headers.get('CF-Connecting-IPv4');
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

  // Fallback to X-Real-IP if still no IPv4
  if (!clientIP.ipv4) {
    const realIP = request.headers.get('X-Real-IP');
    if (realIP && isValidIPv4(realIP)) {
      clientIP.ipv4 = realIP;
    }
  }

  return new Response(JSON.stringify(clientIP, null, 2), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

// Helper functions remain unchanged
function isValidIPv4(ip) {
  if (!ip) return false;
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Regex.test(ip)) return false;
  
  const octets = ip.split('.');
  return octets.every(octet => {
    const num = parseInt(octet, 10);
    return num >= 0 && num <= 255;
  });
}

function isValidIPv6(ip) {
  if (!ip) return false;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$/;
  return ipv6Regex.test(ip);
}