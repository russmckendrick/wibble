// Theme management
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');
const toast = document.querySelector('.toast');
const bsToast = new bootstrap.Toast(toast, { delay: 2000 });

function setTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        sunIcon.classList.add('d-none');
        moonIcon.classList.remove('d-none');
    } else {
        sunIcon.classList.remove('d-none');
        moonIcon.classList.add('d-none');
    }
}

// Theme initialization
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme('dark');
} else {
    setTheme('light');
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
    }
});

// Copy functionality
document.addEventListener('click', async (e) => {
    if (e.target.classList.contains('copy-button')) {
        const targetId = e.target.dataset.clipboardTarget;
        const textToCopy = document.getElementById(targetId).textContent;
        
        try {
            await navigator.clipboard.writeText(textToCopy);
            bsToast.show();
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }
});

// Main functionality
document.addEventListener('DOMContentLoaded', async () => {

    // Curl command is now hardcoded to https://wibble.foo/json

    // Copy functionality for all copy buttons
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('copy-button')) {
            const targetId = e.target.dataset.clipboardTarget;
            const textToCopy = document.getElementById(targetId).textContent;
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                // Store original button text
                const originalText = e.target.innerHTML;
                // Update button text to show success
                e.target.innerHTML = '✅ Copied!';
                // Reset button text after 2 seconds
                setTimeout(() => {
                    e.target.innerHTML = originalText;
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                e.target.innerHTML = '❌ Failed';
                setTimeout(() => {
                    e.target.innerHTML = originalText;
                }, 2000);
            }
        }
    });
    const loadingEl = document.getElementById('loading');
    const loadingText = document.getElementById('loading-text');
    const resultsEl = document.getElementById('results');
    const errorEl = document.getElementById('error');
    const ipv4El = document.getElementById('ipv4');
    const ipv6El = document.getElementById('ipv6');
    const ipv6ContainerEl = document.getElementById('ipv6-container');
    const mapEl = document.getElementById('map');
    
    try {
        if (window.location.pathname.endsWith('/json')) {
            document.body.innerHTML = '';
            const data = await getIpData(loadingText);
            document.body.textContent = JSON.stringify(data, null, 2);
            document.body.style.whiteSpace = 'pre';
            document.body.style.fontFamily = 'monospace';
            return;
        }

        const data = await getIpData(loadingText);
        
        // Update IP addresses
        ipv4El.textContent = data.query || 'Not available';
        if (data.ipv6) {
            ipv6El.textContent = data.ipv6;
        } else {
            ipv6ContainerEl.classList.add('d-none');
        }

        // Update geolocation info
        document.getElementById('city').textContent = data.city || 'Unknown';
        document.getElementById('region').textContent = data.regionName || 'Unknown';
        document.getElementById('country').textContent = data.country || 'Unknown';
        document.getElementById('isp').textContent = data.isp || 'Unknown';
        document.getElementById('timezone').textContent = data.timezone || 'Unknown';
        
        // Initialize map
        if (data.lat && data.lon) {
            // Clear any existing map instance
            const mapContainer = document.getElementById('map');
            mapContainer.innerHTML = '';
            
            const map = L.map('map', {
                center: [data.lat, data.lon],
                zoom: 13,
                zoomControl: true,
                scrollWheelZoom: true
            });

            // Add the tile layer with proper attribution
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // Add marker with popup
            const marker = L.marker([data.lat, data.lon])
                .addTo(map)
                .bindPopup(`Your location: ${data.city}, ${data.regionName}`)
                .openPopup();

            // Force a map refresh
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }

        // Show results
        loadingEl.classList.add('d-none');
        resultsEl.classList.remove('d-none');
        
        // Update provider info
        document.getElementById('ipapi-link').classList.remove('d-none');

    } catch (error) {
        console.error('Error:', error);
        loadingEl.classList.add('d-none');
        errorEl.classList.remove('d-none');
    }
});

async function getIpData(loadingText) {
    try {
        // Get IPv4 address from ipify
        loadingText.textContent = 'Fetching IPv4 address... 🔍';
        const ipv4Response = await fetch('https://api.ipify.org?format=json');
        const ipv4Data = await ipv4Response.json();
        
        // Get IPv6 address from ipify
        loadingText.textContent = 'Fetching IPv6 address... 🔍';
        let ipv6Address = null;
        try {
            const ipv6Response = await fetch('https://api64.ipify.org?format=json');
            const ipv6Data = await ipv6Response.json();
            if (ipv6Data.ip !== ipv4Data.ip) {
                ipv6Address = ipv6Data.ip;
            }
        } catch (ipv6Error) {
            console.log('IPv6 not available:', ipv6Error);
        }

        // Get location data from ipapi.co
        loadingText.textContent = 'Fetching location information... 🔍';
        const ipapiResponse = await fetch('https://ipapi.co/json/');
        const ipapiData = await ipapiResponse.json();
        
        if (!ipapiData.error) {
            return {
                status: 'success',
                query: ipv4Data.ip,  // IPv4 address
                ipv6: ipv6Address,   // IPv6 address (if available)
                city: ipapiData.city,
                regionName: ipapiData.region,
                country: ipapiData.country_name,
                lat: ipapiData.latitude,
                lon: ipapiData.longitude,
                timezone: ipapiData.timezone,
                isp: ipapiData.org,
                org: ipapiData.org
            };
        }
    } catch (error) {
        console.error('ipapi.co failed:', error);
    }

    // Fallback to ipify for basic IP info
    loadingText.textContent = 'Trying alternative service (ipify)... 🔄';
    try {
        const ipifyResponse = await fetch('https://api.ipify.org?format=json');
        const ipifyData = await ipifyResponse.json();
    
        return basicIpData;
    } catch (error) {
        console.error('All services failed:', error);
        throw new Error('Unable to fetch IP information. Please try again later.');
    }
}