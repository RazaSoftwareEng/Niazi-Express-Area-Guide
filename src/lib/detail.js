import L from 'leaflet'
import { OFFICE, PLACES } from '../data/places'

/**
 * Close-up detail page ka area: Bund Road / Yateem Khana ki saari local jagahen
 * (travel companies, plazas, police, fire brigade, school...) + office.
 */
export const DETAIL_PLACES = PLACES.filter(
  (p) => (p.tier >= 2 && p.cat !== 'metro') || ['niazi-adda', 'yateem-chowk'].includes(p.id),
)
export const detailBounds = () =>
  L.latLngBounds([...DETAIL_PLACES, OFFICE].map((p) => [p.lat, p.lng])).pad(0.08)
