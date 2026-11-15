import L from 'leaflet'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ICONS } from './iconMap'
import { CATEGORIES } from '../data/places'

const svgCache = {}
function svg(name, size) {
  const key = `${name}-${size}`
  if (!svgCache[key]) {
    const Cmp = ICONS[name] || ICONS.MapPin
    svgCache[key] = renderToStaticMarkup(createElement(Cmp, { size, strokeWidth: 2.25, color: '#fff' }))
  }
  return svgCache[key]
}

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

/**
 * Category-coloured pin + name label.
 * label: { x, y, w, line } (labels.js se) — ya null to label nahi dikhana.
 */
export function placeIcon(place, { label, selected }) {
  const cat = CATEGORIES[place.cat]
  const size = place.tier === 1 ? 30 : 26
  const c = size / 2
  const line = label?.line
    ? `<svg class="nx-leader" width="1" height="1"><line x1="${c}" y1="${c}" x2="${c + label.line.x}" y2="${c + label.line.y}" /></svg>`
    : ''
  const html = `
    <div class="nx-marker ${selected ? 'is-selected' : ''} ${place.highlight ? 'is-highlight' : ''}" style="--c:${cat.color}">
      ${line}
      <div class="nx-pin" style="width:${size}px;height:${size}px">${svg(place.icon || cat.icon, size * 0.55)}</div>
      ${label ? `<div class="nx-label" style="left:${c + label.x}px;top:${c + label.y}px;width:${label.w}px">${esc(place.name)}</div>` : ''}
    </div>`
  return L.divIcon({ html, className: 'nx-icon', iconSize: [size, size], iconAnchor: [size / 2, size / 2] })
}

/** Bara red "I'm Here" pin */
export function officeIcon(label) {
  const html = `
    <div class="nx-office">
      <svg viewBox="0 0 24 34" width="44" height="62"><path d="M12 0C5.4 0 0 5.3 0 11.9 0 20.8 12 34 12 34s12-13.2 12-22.1C24 5.3 18.6 0 12 0z" fill="#ea4335" stroke="#a52714" stroke-width="1"/><circle cx="12" cy="12" r="4.5" fill="#a52714"/></svg>
      <div class="nx-office-label">${esc(label)}</div>
    </div>`
  return L.divIcon({ html, className: 'nx-icon', iconSize: [44, 62], iconAnchor: [22, 62] })
}
