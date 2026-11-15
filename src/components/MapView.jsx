import { useEffect, useMemo, useRef, useState } from 'react'
import { Circle, MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { CATEGORIES, OFFICE, ORANGE_LINE } from '../data/places'
import { distanceKm, fmtKm } from '../lib/geo'
import { officeIcon, placeIcon } from '../lib/icons'
import { layoutLabels } from '../lib/labels'
import { circlePoints, radiusBounds, ringsFor, ringTop } from '../lib/radius'

// Free OpenStreetMap tiles (demo ke liye). Production / zyada traffic ke liye
// MapTiler ya Stadia ki free API key wale tiles lagayein.
export const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
export const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

/** URL hash (#zoom/lat/lng) ho to wahi view, warna default radius */
function initialView(radiusKm) {
  const [z, lat, lng] = location.hash.slice(1).split('/').map(Number)
  return [z, lat, lng].every(Number.isFinite) ? { center: [lat, lng], zoom: z } : { bounds: radiusBounds(radiusKm) }
}

/** Radius badle to map us radius par fit ho (pehli dafa skip, taake URL wala view rahe) */
function FitRadius({ radiusKm }) {
  const map = useMap()
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    map.fitBounds(radiusBounds(radiusKm), { animate: true })
  }, [radiusKm, map])
  return null
}

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Print ka process: layout paper size par set hone do → map radius par fit →
 * tiles load hone ka intezar → browser print → wapas screen view.
 */
function PrintRunner({ printing, radiusKm, onDone }) {
  const map = useMap()
  useEffect(() => {
    if (!printing) return
    let cancelled = false
    ;(async () => {
      await nextFrame()
      map.invalidateSize()
      map.fitBounds(radiusBounds(radiusKm), { animate: false, padding: [6, 6] })
      let tiles
      map.eachLayer((l) => l instanceof L.TileLayer && (tiles = l))
      await wait(400)
      for (let t = 0; t < 40 && tiles?.isLoading?.(); t++) await wait(200) // max ~8s
      await wait(300)
      if (cancelled) return
      window.print()
      onDone()
      await nextFrame()
      map.invalidateSize()
      map.fitBounds(radiusBounds(radiusKm), { animate: false })
    })()
    return () => {
      cancelled = true
    }
  }, [printing, radiusKm, map, onDone])
  return null
}

/** Zoom level track karta hai (labels dikhane/chhupane ke liye) aur picker clicks */
function MapEvents({ onZoom, pickMode, onPick }) {
  const map = useMapEvents({
    zoomend: () => onZoom(map.getZoom()),
    // URL mein view save karo (#zoom/lat/lng) taake link share karne par wahi view khule
    moveend: () => {
      const c = map.getCenter()
      history.replaceState(null, '', `#${map.getZoom()}/${c.lat.toFixed(4)}/${c.lng.toFixed(4)}`)
    },
    click: (e) => pickMode && onPick(e.latlng),
  })
  useEffect(() => onZoom(map.getZoom()), [map, onZoom])
  return null
}

function FlyToSelected({ place, markerRefs }) {
  const map = useMap()
  useEffect(() => {
    if (!place) return
    map.flyTo([place.lat, place.lng], Math.max(map.getZoom(), 16), { duration: 0.8 })
    const t = setTimeout(() => markerRefs.current[place.id]?.openPopup(), 850)
    return () => clearTimeout(t)
  }, [place, map, markerRefs])
  return null
}

/** Sidebar band/khulne ya print par map ka size dobara calculate karo */
function AutoResize() {
  const map = useMap()
  useEffect(() => {
    const fix = () => map.invalidateSize()
    const ro = new ResizeObserver(fix)
    ro.observe(map.getContainer())
    window.addEventListener('beforeprint', fix)
    window.addEventListener('afterprint', fix)
    return () => {
      ro.disconnect()
      window.removeEventListener('beforeprint', fix)
      window.removeEventListener('afterprint', fix)
    }
  }, [map])
  return null
}

export function PlacePopup({ place }) {
  const cat = CATEGORIES[place.cat]
  return (
    <div className="min-w-44">
      <div className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: cat.color }}>
        {cat.label}
      </div>
      <div className="text-base font-bold text-slate-900">{place.name}</div>
      {place.ur && <div className="font-[system-ui] text-sm text-slate-600" dir="rtl">{place.ur}</div>}
      <div className="mt-1 text-sm text-slate-700">
        Office se: <b>{fmtKm(distanceKm(OFFICE, place))}</b> <span className="text-slate-400">(seedhi line)</span>
      </div>
      {place.approx && <div className="mt-1 text-[11px] text-amber-600">⚠ Location andaze se hai</div>}
    </div>
  )
}

export default function MapView({ places, selected, onSelect, pickMode, onPick, picked, radiusKm, printing, onPrintDone }) {
  const [zoom, setZoom] = useState(14)
  const markerRefs = useRef({})

  const orangePath = useMemo(() => ORANGE_LINE.map((s) => [s.lat, s.lng]), [])
  const rings = ringsFor(radiusKm)
  // Radius se bahar ka area halka grey: bara rectangle jis mein circle ka "hole" hai
  const mask = useMemo(() => {
    const o = 1.5
    const outer = [
      [OFFICE.lat - o, OFFICE.lng - o], [OFFICE.lat - o, OFFICE.lng + o],
      [OFFICE.lat + o, OFFICE.lng + o], [OFFICE.lat + o, OFFICE.lng - o],
    ]
    return [outer, circlePoints(radiusKm)]
  }, [radiusKm])

  const shown = useMemo(
    () => layoutLabels(places, zoom, { selectedId: selected?.id, office: OFFICE }),
    [places, zoom, selected],
  )

  return (
    <MapContainer
      {...initialView(radiusKm)}
      zoomSnap={0.25}
      zoomDelta={0.5}
      minZoom={11}
      maxZoom={18}
      className={`h-full w-full ${pickMode ? 'cursor-crosshair' : ''}`}
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTR} maxZoom={19} className="nx-tiles" />
      <MapEvents onZoom={setZoom} pickMode={pickMode} onPick={onPick} />
      <FlyToSelected place={selected} markerRefs={markerRefs} />
      <AutoResize />
      <FitRadius radiusKm={radiusKm} />
      <PrintRunner printing={printing} radiusKm={radiusKm} onDone={onPrintDone} />

      {/* Radius se bahar wala area */}
      <Polygon positions={mask} pathOptions={{ stroke: false, fillColor: '#334155', fillOpacity: 0.28, interactive: false }} />
      <Circle
        center={[OFFICE.lat, OFFICE.lng]}
        radius={radiusKm * 1000}
        pathOptions={{ color: '#1e1b8f', weight: 2.5, opacity: 0.9, fill: false, interactive: false }}
      />

      {/* Distance rings */}
      {rings.slice(0, -1).map((km) => (
        <Circle
          key={km}
          center={[OFFICE.lat, OFFICE.lng]}
          radius={km * 1000}
          pathOptions={{ color: '#0f172a', weight: 1.2, opacity: 0.45, dashArray: '6 6', fill: false, interactive: false }}
        />
      ))}
      {rings.map((km) => (
        <Marker
          key={`ring-${km}`}
          position={ringTop(km)}
          icon={L.divIcon({ html: `<div class="nx-ring-label">${km} km</div>`, className: 'nx-icon', iconSize: [0, 0] })}
          interactive={false}
        />
      ))}

      {/* Orange Line */}
      <Polyline positions={orangePath} pathOptions={{ color: '#ffffff', weight: 9, opacity: 0.9 }} />
      <Polyline positions={orangePath} pathOptions={{ color: '#f58220', weight: 5 }} />

      {/* Places */}
      {places.map((p) => (
        <Marker
          key={p.id}
          ref={(r) => (markerRefs.current[p.id] = r)}
          position={[p.lat, p.lng]}
          icon={placeIcon(p, { label: shown.get(p.id), selected: p.id === selected?.id })}
          zIndexOffset={p.highlight ? 500 : p.tier === 1 ? 100 : 0}
          eventHandlers={{ click: () => onSelect(p) }}
        >
          <Popup>
            <PlacePopup place={p} />
          </Popup>
        </Marker>
      ))}

      {/* Office */}
      <Marker position={[OFFICE.lat, OFFICE.lng]} icon={officeIcon("I'm Here!")} zIndexOffset={1000}>
        <Popup>
          <div className="font-bold">{OFFICE.name}</div>
          <div className="text-sm text-slate-600" dir="rtl">{OFFICE.ur}</div>
        </Popup>
      </Marker>

      {picked && (
        <Marker position={picked} icon={L.divIcon({ html: '<div class="nx-pick"></div>', className: 'nx-icon', iconSize: [16, 16], iconAnchor: [8, 8] })} />
      )}
    </MapContainer>
  )
}
