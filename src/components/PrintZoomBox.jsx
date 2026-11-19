import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, Polyline, ScaleControl, TileLayer, useMap } from 'react-leaflet'
import { ZoomIn } from 'lucide-react'
import { OFFICE } from '../data/places'
import { ORANGE_LINE_TRACK } from '../data/orangeLineTrack'
import { officeIcon, placeIcon } from '../lib/icons'
import { layoutLabels } from '../lib/labels'
import { ZOOM_BOUNDS, ZOOM_PLACES } from '../lib/detail'
import { TILE_ATTR, TILE_URL } from './MapView'

/** Box ka zoom + pixel area parho taake labels box ke andar rahein */
function ViewReader({ onView }) {
  const map = useMap()
  useEffect(() => {
    const fit = () => {
      map.invalidateSize()
      map.fitBounds(ZOOM_BOUNDS, { animate: false })
      const pb = map.getPixelBounds()
      onView({ zoom: map.getZoom(), viewport: [pb.min.x + 4, pb.min.y + 4, pb.max.x - 4, pb.max.y - 4] })
    }
    fit()
    const t = setTimeout(fit, 150) // layout settle hone ke baad dobara
    return () => clearTimeout(t)
  }, [map, onView])
  return null
}

/** PDF (single page) ka zoom box: plazas apni asli jagah par, naam ke saath */
export default function PrintZoomBox() {
  const [view, setView] = useState(null)
  const shown = useMemo(
    () => (view ? layoutLabels(ZOOM_PLACES, view.zoom, { office: OFFICE, viewport: view.viewport, labelAll: true }) : new Map()),
    [view],
  )
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border-[3px] border-[#0b1f4f] bg-white shadow-2xl">
      <div className="flex items-center gap-2 bg-[#0b1f4f] px-3 py-1.5 text-white">
        <ZoomIn size={18} strokeWidth={2.5} />
        <span className="text-[15px] font-bold">ZOOM: Yateem Khana Bazar</span>
        <span className="text-[12px] text-white/75">— plazas aur services ki asli location</span>
      </div>
      <div className="min-h-0 flex-1">
        <MapContainer
          bounds={ZOOM_BOUNDS}
          zoomSnap={0.25}
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          touchZoom={false}
          keyboard={false}
          attributionControl={false}
          className="h-full w-full"
        >
          <ViewReader onView={setView} />
          <TileLayer url={TILE_URL} attribution={TILE_ATTR} className="nx-tiles" crossOrigin="anonymous" maxZoom={19} />
          <ScaleControl position="bottomleft" imperial={false} maxWidth={140} />
          <Polyline positions={ORANGE_LINE_TRACK} pathOptions={{ color: '#ffffff', weight: 9, opacity: 0.9 }} />
          <Polyline positions={ORANGE_LINE_TRACK} pathOptions={{ color: '#f58220', weight: 5 }} />
          {ZOOM_PLACES.map((p) => (
            <Marker key={p.id} position={[p.lat, p.lng]} icon={placeIcon(p, { label: shown.get(p.id) })} interactive={false} />
          ))}
          <Marker position={[OFFICE.lat, OFFICE.lng]} icon={officeIcon("I'm Here!")} interactive={false} zIndexOffset={1000} />
        </MapContainer>
      </div>
    </div>
  )
}
