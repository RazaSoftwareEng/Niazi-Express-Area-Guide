import { useEffect, useMemo, useRef, useState } from 'react'
import { Circle, MapContainer, Marker, Polygon, Polyline, Popup, Rectangle, ScaleControl, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { CATEGORIES, OFFICE } from '../data/places'
import { ORANGE_LINE_TRACK } from '../data/orangeLineTrack'
import { distanceKm, fmtKm } from '../lib/geo'
import { officeIcon, placeIcon } from '../lib/icons'
import { layoutLabels } from '../lib/labels'
import { circlePoints, radiusBounds, ringsFor, ringTop } from '../lib/radius'
import { detailBounds, ZOOM_BOUNDS } from '../lib/detail'

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
  const prev = useRef(radiusKm) // sirf tab fit karo jab radius waqai badle
  useEffect(() => {
    if (prev.current === radiusKm) return
    prev.current = radiusKm
    map.fitBounds(radiusBounds(radiusKm), { animate: true })
  }, [radiusKm, map])
  return null
}

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Print ka process: layout paper size par set hone do → map radius (ya screen wale
 * view) par fit → tiles load hone ka intezar → browser print → wapas screen view.
 * printing.preview = true ho to sirf layout dikhao, print window na kholo.
 */
function PrintRunner({ printing, radiusKm, onReady }) {
  const map = useMap()
  useEffect(() => {
    if (!printing) return
    let cancelled = false
    ;(async () => {
      await nextFrame()
      map.invalidateSize()
      const target =
        printing.step === 'detail'
          ? detailBounds()
          : printing.bounds
            ? L.latLngBounds(printing.bounds)
            : radiusBounds(radiusKm)
      map.fitBounds(target, { animate: false, padding: [6, 6] })
      // Page ke SAARE maps (main + zoom box) ke tiles load hone ka intezar (max ~12s)
      await wait(500)
      const pending = () => [...document.querySelectorAll('img.leaflet-tile')].some((img) => !img.complete)
      for (let t = 0; t < 60 && pending(); t++) await wait(200)
      await wait(400)
      if (cancelled || printing.preview) return
      if (document.fonts?.ready) await document.fonts.ready
      const more = await onReady() // App yahan high-res tasveer banati hai
      if (more) return // agla page (close-up) abhi banega
      await nextFrame()
      map.invalidateSize()
      // Screen ko pehle wale view par wapas lao
      map.fitBounds(printing.bounds ? L.latLngBounds(printing.bounds) : radiusBounds(radiusKm), { animate: false })
    })()
    return () => {
      cancelled = true
    }
  }, [printing, radiusKm, map, onReady])
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

export default function MapView({ mapRef, places, selected, onSelect, pickMode, onPick, picked, radiusKm, printing, onPrintReady }) {
  const [zoom, setZoom] = useState(14)
  const markerRefs = useRef({})

  const orangePath = ORANGE_LINE_TRACK
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

  // Plazas (tier 3) zoom 14 se kam par nahi — door se sirf dhabba bante hain aur labels dhak dete hain
  // Zoomed download / detail page: plazas ke naam bhi likho
  const detailPage = printing?.step === 'detail' || printing?.area === 'zoom'
  const visible = useMemo(
    () => places.filter((p) => p.tier !== 3 || zoom >= 14 || detailPage),
    [places, zoom, detailPage],
  )

  const shown = useMemo(
    () => layoutLabels(visible, zoom, { selectedId: selected?.id, office: OFFICE, labelAll: detailPage }),
    [visible, zoom, selected, detailPage],
  )

  return (
    <MapContainer
      ref={mapRef}
      {...initialView(radiusKm)}
      zoomSnap={0.25}
      zoomDelta={0.5}
      minZoom={11}
      maxZoom={18}
      className={`h-full w-full ${pickMode ? 'cursor-crosshair' : ''}`}
    >
      {/* crossOrigin: download ke waqt tiles ko image mein capture karne ke liye zaroori */}
      <TileLayer url={TILE_URL} attribution={TILE_ATTR} maxZoom={19} className="nx-tiles" crossOrigin="anonymous" />
      <MapEvents onZoom={setZoom} pickMode={pickMode} onPick={onPick} />
      <FlyToSelected place={selected} markerRefs={markerRefs} />
      <AutoResize />
      <FitRadius radiusKm={radiusKm} />
      <PrintRunner printing={printing} radiusKm={radiusKm} onReady={onPrintReady} />

      {/* Print / PDF mein: scale bar (km); radius circle, grey area aur rings nahi */}
      {printing && <ScaleControl position="bottomleft" imperial={false} maxWidth={220} />}
      {/* Zoom box kis hisse ka hai — dashed chokor */}
      {printing?.zoomBox && (
        <Rectangle
          bounds={ZOOM_BOUNDS}
          pathOptions={{ color: '#0b1f4f', weight: 2.5, dashArray: '7 5', fill: true, fillOpacity: 0.06, interactive: false }}
        />
      )}

      {!printing && (
        <>
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
        </>
      )}

      {/* Orange Line */}
      <Polyline positions={orangePath} pathOptions={{ color: '#ffffff', weight: 9, opacity: 0.9 }} />
      <Polyline positions={orangePath} pathOptions={{ color: '#f58220', weight: 5 }} />

      {/* Places */}
      {visible.map((p) => (
        <Marker
          key={p.id}
          ref={(r) => (markerRefs.current[p.id] = r)}
          position={[p.lat, p.lng]}
          icon={placeIcon(p, { label: shown.get(p.id), selected: p.id === selected?.id })}
          zIndexOffset={p.highlight ? 500 : p.tier === 1 ? 100 : 0}
          eventHandlers={{ click: () => onSelect(p) }}
        >
          {/* Plazas ka label nahi hota — cursor le jane par naam dikhao */}
          {p.noLabel && (
            <Tooltip direction="top" offset={[0, -14]}>
              {p.name}
            </Tooltip>
          )}
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

      {picked && !printing && (
        <Marker position={picked} icon={L.divIcon({ html: '<div class="nx-pick"></div>', className: 'nx-icon', iconSize: [16, 16], iconAnchor: [8, 8] })} />
      )}
    </MapContainer>
  )
}
