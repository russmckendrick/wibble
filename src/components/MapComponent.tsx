import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in React Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

interface MapComponentProps {
  latitude: number
  longitude: number
  city: string
  country: string
  className?: string
}

export function MapComponent({ 
  latitude, 
  longitude, 
  city, 
  country, 
  className = "" 
}: MapComponentProps) {
  const position: [number, number] = [latitude, longitude]

  return (
    <div className={`${className} map-container`}>
      <MapContainer
        center={position}
        zoom={10}
        scrollWheelZoom={false}
        className="w-full h-full min-h-[400px] rounded-2xl"
        style={{ backgroundColor: 'var(--color-card)' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="text-center">
              <strong>{city}, {country}</strong><br />
              <small>
                {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
              </small>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}