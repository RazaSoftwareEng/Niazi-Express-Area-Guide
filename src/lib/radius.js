import L from 'leaflet'
import { OFFICE } from '../data/places'

export const MIN_RADIUS = 1
export const MAX_RADIUS = 10
export const DEFAULT_RADIUS = 6

const kmLat = (km) => km / 111
const kmLng = (km) => km / (111 * Math.cos((OFFICE.lat * Math.PI) / 180))

/** Office ke gird R km ka square (map ko is par fit karte hain) */
export const radiusBounds = (km) =>
  L.latLngBounds([OFFICE.lat - kmLat(km), OFFICE.lng - kmLng(km)], [OFFICE.lat + kmLat(km), OFFICE.lng + kmLng(km)])

/** Ring label ki position (circle ke upar wala point) */
export const ringTop = (km) => [OFFICE.lat + kmLat(km), OFFICE.lng]

/** Radius ke hisaab se kaun se distance rings dikhane hain */
export function ringsFor(R) {
  const base = R <= 4 ? [1, 2, 3] : [1, 3, 5, 8]
  return [...base.filter((k) => k < R), R]
}

/** Circle ke points – radius se bahar wale area ko grey karne (mask) ke liye */
export function circlePoints(km, n = 96) {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / n) * 2 * Math.PI
    return [OFFICE.lat + kmLat(km) * Math.sin(a), OFFICE.lng + kmLng(km) * Math.cos(a)]
  })
}

/** Paper sizes (landscape, 8mm margin) → CSS px @ 96dpi */
const MM = 96 / 25.4
export const PAPERS = {
  A3: { label: 'A3 (bara)', w: 420, h: 297 },
  A4: { label: 'A4', w: 297, h: 210 },
}
export const PRINT_MARGIN_MM = 8
export const paperPx = (key) => {
  const p = PAPERS[key]
  return {
    width: Math.floor((p.w - 2 * PRINT_MARGIN_MM) * MM),
    height: Math.floor((p.h - 2 * PRINT_MARGIN_MM) * MM) - 4, // -4px: doosra khali page na bane
  }
}
