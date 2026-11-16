import L from 'leaflet'

const CRS = L.CRS.EPSG3857
const overlapArea = (a, b) =>
  Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1]))
export const pinSize = (p) => (p.tier === 1 ? 30 : 26)

const LABEL_H = 20
export const labelWidth = (name) => Math.ceil(name.length * 6.8 + 16)

/**
 * Lazmi labels: zoom 14+ par har jagah ka naam, us se kam par sirf bari (tier 1)
 * jagahen. Chhoti local jagahen tab bhi dikhti hain agar khali jagah ho.
 */
export const FORCE_ALL_FROM_ZOOM = 14
export const FORCE_TIER1_FROM_ZOOM = 12

/**
 * Label ki jagahen (pin ke center se pixel offset, label ka top-left).
 * Pehle qareeb wali jagahen try hoti hain, phir door wali (line ke saath).
 */
function candidates(h, w) {
  const r = h + 4
  const l = -h - 4 - w
  const c = -w / 2
  const mid = -LABEL_H / 2
  const step = LABEL_H + 4
  return [
    [r, mid], [l, mid], [c, -h - 4 - LABEL_H], [c, h + 4],
    [r, mid - step], [r, mid + step], [l, mid - step], [l, mid + step],
    [r + 10, mid - 2 * step], [r + 10, mid + 2 * step], [l - 10, mid - 2 * step], [l - 10, mid + 2 * step],
    [c, -h - 4 - LABEL_H - 2 * step], [c, h + 4 + 2 * step],
  ]
}

/**
 * viewport (optional): pixel box jis ke andar labels rehne chahiyen (inset map).
 * Har place ke label ki position nikalta hai taake labels ek dosre aur pins
 * ke upar na aayein. Return: Map(id -> { x, y, w, line }) — x,y pin center se offset;
 * line = { x, y } agar label door hai to pin se label tak line.
 */
export function layoutLabels(places, zoom, { selectedId, office, viewport, labelAll } = {}) {
  const mustShow = (p) =>
    p.id === selectedId || zoom >= FORCE_ALL_FROM_ZOOM || (p.tier === 1 && zoom >= FORCE_TIER1_FROM_ZOOM)
  const pts = new Map(places.map((p) => [p.id, CRS.latLngToPoint(L.latLng(p.lat, p.lng), zoom)]))

  const pins = places.map((p) => {
    const { x, y } = pts.get(p.id)
    const h = pinSize(p) / 2 + 2
    return { id: p.id, box: [x - h, y - h, x + h, y + h] }
  })

  const taken = []
  if (office) {
    const { x, y } = CRS.latLngToPoint(L.latLng(office.lat, office.lng), zoom)
    taken.push([x - 22, y - 62, x + 22, y], [x + 18, y - 30, x + 100, y - 10]) // pin + "I'm Here!"
  }

  const rank = (p) => (p.id === selectedId ? 4 : p.highlight ? 3 : p.tier === 1 ? 2 : 1)
  const order = [...places].sort((a, b) => rank(b) - rank(a))

  const result = new Map()
  for (const p of order) {
    if (p.noLabel && !labelAll) continue // plazas: sirf icon, label nahi (detail page par label bhi)
    const { x, y } = pts.get(p.id)
    const h = pinSize(p) / 2
    const w = labelWidth(p.name)

    let best = null
    for (const [i, [dx, dy]] of candidates(h, w).entries()) {
      const box = [x + dx, y + dy, x + dx + w, y + dy + LABEL_H]
      let score = i * 0.01 // qareeb wali jagah ko tarjeeh
      for (const o of pins) if (o.id !== p.id) score += overlapArea(box, o.box) * 2
      for (const t of taken) score += overlapArea(box, t) * 3
      // viewport = [minX, minY, maxX, maxY]: label box ke bahar kata na ho
      if (viewport) score += (w * LABEL_H - overlapArea(box, viewport)) * 4
      if (!best || score < best.score) best = { score, dx, dy, box }
      if (score < 1) break // bilkul khali jagah mil gayi
    }

    const clean = best.score < 1
    if (clean || mustShow(p)) {
      taken.push(best.box)
      const { dx, dy } = best
      // Label pin se door hai? To pin se label ke qareebi kinare tak line
      const cx = Math.max(dx, Math.min(0, dx + w))
      const cy = Math.max(dy, Math.min(0, dy + LABEL_H))
      const far = Math.hypot(cx, cy) > h + 8
      result.set(p.id, { x: dx, y: dy, w, line: far ? { x: cx, y: cy } : null })
    }
  }
  return result
}
