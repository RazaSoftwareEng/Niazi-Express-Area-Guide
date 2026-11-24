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

/**
 * Download sizes (landscape). Bara paper = zyada zoom/detail, aur `scale` se
 * labels/header bhi physically bare hote hain taake chart door se parha ja sake.
 */
const MM = 96 / 25.4
export const PAPERS = {
  A4: { label: 'A4', sub: '29.7 × 21 cm', w: 297, h: 210, dpi: 200 },
  A3: { label: 'A3', sub: '42 × 29.7 cm', w: 420, h: 297, dpi: 200 },
  A2: { label: 'A2', sub: '59.4 × 42 cm', w: 594, h: 420, dpi: 150 },
  A1: { label: 'A1 · Chart', sub: '84 × 59.4 cm', w: 841, h: 594, dpi: 150 },
  A0: { label: 'A0 · Large', sub: '119 × 84 cm', w: 1189, h: 841, dpi: 130 },
}

/**
 * Export frame: CSS size (layout) + pixelRatio (capture resolution).
 * scale = (paper width / A4 width)^0.3: A4 1×, A1 ~1.37×, A0 ~1.5×.
 * Bara paper par map ko zyada jagah milti hai (zyada zoom) aur labels bhi thore bare.
 */
export function exportFrame(key, big = false) {
  const p = PAPERS[key]
  // big: labels/icons aur bare (door se parhne ke liye)
  const scale = Math.pow(p.w / 297, big ? 0.62 : 0.3)
  return {
    width: Math.round((p.w * MM) / scale),
    height: Math.round((p.h * MM) / scale),
    pixelRatio: (p.dpi / 96) * scale,
    mm: [p.w, p.h],
  }
}
