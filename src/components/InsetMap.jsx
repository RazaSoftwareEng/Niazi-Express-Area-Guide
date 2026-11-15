import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { X } from 'lucide-react'
import { OFFICE, PLACES } from '../data/places'
import { ORANGE_LINE_TRACK } from '../data/orangeLineTrack'
import { officeIcon, placeIcon } from '../lib/icons'
import { layoutLabels } from '../lib/labels'
import { TILE_ATTR, TILE_URL } from './MapView'

const CORE = PLACES.filter((p) => (p.tier >= 2 && p.cat !== 'metro') || ['niazi-adda', 'yateem-chowk'].includes(p.id))
const bounds = L.latLngBounds([...CORE, OFFICE].map((p) => [p.lat, p.lng])).pad(0.15)
// Jo Orange Line stations is box ke andar aate hain, woh bhi dikhao
const LOCAL = [...CORE, ...PLACES.filter((p) => p.cat === 'metro' && bounds.contains([p.lat, p.lng]))]

/** Inset ka zoom aur pixel area parhta hai taake labels box ke andar rahein */
function ViewReader({ onView }) {
  const map = useMap()
  useEffect(() => {
    const pb = map.getPixelBounds()
    onView({ zoom: map.getZoom(), viewport: [pb.min.x + 4, pb.min.y + 4, pb.max.x - 4, pb.max.y - 4] })
  }, [map, onView])
  return null
}

/** Zoomed-in box: Yateem Khana / Niazi Adda ka close-up, jahan sab chhoti jagahen saaf nazar aayen */
export default function InsetMap({ onOpen, onClose }) {
  const [view, setView] = useState(null)
  const shown = useMemo(
    () => (view ? layoutLabels(LOCAL, view.zoom, { office: OFFICE, viewport: view.viewport }) : new Map()),
    [view],
  )

  return (
    <div className="overflow-hidden rounded-xl border-2 border-white bg-white shadow-xl ring-1 ring-slate-300">
      <div className="flex items-center justify-between bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">
        <span>Close-up: Niazi Adda / Yateem Khana</span>
        <div className="flex items-center gap-1.5 print:hidden">
          <button onClick={onOpen} className="rounded bg-white/15 px-2 py-0.5 hover:bg-white/25">
            Zoom karein
          </button>
          <button onClick={onClose} className="rounded p-0.5 hover:bg-white/25" title="Close-up band karein">
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="h-[300px] w-[480px] max-w-full">
        <MapContainer
          bounds={bounds}
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
          <TileLayer url={TILE_URL} attribution={TILE_ATTR} className="nx-tiles" />
          <Polyline positions={ORANGE_LINE_TRACK} pathOptions={{ color: '#f58220', weight: 5 }} />
          {LOCAL.map((p) => (
            <Marker key={p.id} position={[p.lat, p.lng]} icon={placeIcon(p, { label: shown.get(p.id) })} interactive={false} />
          ))}
          <Marker position={[OFFICE.lat, OFFICE.lng]} icon={officeIcon("I'm Here!")} interactive={false} />
        </MapContainer>
      </div>
    </div>
  )
}
