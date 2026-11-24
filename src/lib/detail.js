import L from 'leaflet'
import { OFFICE, PLACES } from '../data/places'
import { distanceKm } from './geo'

// Sirf office ke qareeb wale plazas (markets wale door ke plazas nahi)
const nearOffice = (p, km) => distanceKm(OFFICE, p) <= km

/**
 * Close-up detail page ka area: Bund Road / Yateem Khana ki saari local jagahen
 * (travel companies, plazas, police, fire brigade, school...) + office.
 */
export const DETAIL_PLACES = PLACES.filter(
  (p) =>
    (p.tier >= 2 && p.cat !== 'metro' && p.cat !== 'market' && nearOffice(p, 1.3)) ||
    ['niazi-adda', 'yateem-chowk'].includes(p.id),
)
export const detailBounds = () =>
  L.latLngBounds([...DETAIL_PLACES, OFFICE].map((p) => [p.lat, p.lng])).pad(0.08)

/**
 * Single-page PDF ka "ZOOM" box: plazas + office wala hissa (asli jagah dikhane ke liye).
 * Is area ki saari jagahen (stations samait) box mein label ke saath aati hain.
 */
const PLAZAS = PLACES.filter((p) => p.cat === 'plaza' && nearOffice(p, 0.6))
export const ZOOM_BOUNDS = L.latLngBounds([...PLAZAS, OFFICE].map((p) => [p.lat, p.lng])).pad(0.18)
export const ZOOM_PLACES = PLACES.filter((p) => ZOOM_BOUNDS.contains([p.lat, p.lng]))

/** "Zoomed area" download: poora page isi area par zoom (sides kat jati hain) */
export const focusBounds = () => L.latLngBounds([...DETAIL_PLACES, OFFICE].map((p) => [p.lat, p.lng])).pad(0.2)
