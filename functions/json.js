// functions/json.js

async function getIpAddresses() {
    // Try ipify first
    try {
      const ipv4Response = await fetch('https://api.ipify.org?format=json');
      const ipv4Data = await ipv4Response.json();
      const addresses = {
        ipv4: ipv4Data.ip,
        provider: 'ipify.org'
      };
  
      try {
        const ipv6Response = await fetch('https://api64.ipify.org?format=json');
        const ipv6Data = await ipv6Response.json();
        if (ipv6Data.ip !== addresses.ipv4) {
          addresses.ipv6 = ipv6Data.ip;
        }
      } catch (ipv6Error) {
        console.log('IPv6 not available');
      }
  
      return new Response(JSON.stringify(addresses, null, 2), {
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      console.log('ipify failed, trying ip-api...');
    }
  
    // Try ip-api as fallback
    try {
      const response = await fetch('http://ip-api.com/json/?fields=query,status');
      const data = await response.json();
      if (data.status === 'success') {
        return new Response(JSON.stringify({
          ipv4: data.query,
          provider: 'ip-api.com'
        }, null, 2), {
          headers: {
            'content-type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      throw new Error('ip-api request failed');
    } catch (error) {
      console.log('ip-api failed, trying ipapi.co...');
    }
  
    // Try ipapi.co as final fallback
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return new Response(JSON.stringify({
        ipv4: data.ip,
        provider: 'ipapi.co'
      }, null, 2), {
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Unable to fetch IP address information'
      }, null, 2), {
        status: 503,
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
  
  export function onRequest() {
    return getIpAddresses();
  }