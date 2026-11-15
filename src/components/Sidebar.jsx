import { createElement } from 'react'
import { ICONS } from '../lib/iconMap'
import { Search } from 'lucide-react'
import { CATEGORIES, OFFICE, PLACES } from '../data/places'
import { distanceKm, fmtKm } from '../lib/geo'

const Icon = ({ name, ...props }) => createElement(ICONS[name] || ICONS.MapPin, props)

export default function Sidebar({ activeCats, toggleCat, query, setQuery, places, selected, onSelect }) {
  const counts = Object.fromEntries(Object.keys(CATEGORIES).map((c) => [c, PLACES.filter((p) => p.cat === c).length]))

  const list = places
    .map((p) => ({ ...p, km: distanceKm(OFFICE, p) }))
    .sort((a, b) => a.km - b.km)

  return (
    <aside className="flex h-full flex-col gap-4 overflow-hidden bg-white p-4">
      {/* Legend / filters */}
      <section>
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Categories</h2>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(CATEGORIES).map(([key, c]) => {
            const on = activeCats.has(key)
            return (
              <button
                key={key}
                onClick={() => toggleCat(key)}
                className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-left text-sm transition ${
                  on ? 'border-slate-200 bg-slate-50 text-slate-800' : 'border-transparent text-slate-400 opacity-60'
                }`}
              >
                <span
                  className="grid size-6 shrink-0 place-items-center rounded-full"
                  style={{ background: on ? c.color : '#cbd5e1' }}
                >
                  <Icon name={c.icon} size={13} color="#fff" strokeWidth={2.5} />
                </span>
                <span className="flex-1 truncate">{c.label}</span>
                <span className="text-xs text-slate-400">{counts[key]}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Search */}
      <label className="relative block">
        <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Jagah dhoondein…"
          className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm outline-none focus:border-slate-400"
        />
      </label>

      {/* List by distance */}
      <section className="-mx-2 min-h-0 flex-1 overflow-y-auto">
        <h2 className="mb-1 px-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          Office se fasla ({list.length})
        </h2>
        <ul>
          {list.map((p) => {
            const c = CATEGORIES[p.cat]
            return (
              <li key={p.id}>
                <button
                  onClick={() => onSelect(p)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-slate-100 ${
                    selected?.id === p.id ? 'bg-slate-100' : ''
                  }`}
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full" style={{ background: c.color }}>
                    <Icon name={p.icon || c.icon} size={12} color="#fff" strokeWidth={2.5} />
                  </span>
                  <span className="flex-1 truncate text-slate-800">{p.name}</span>
                  <span className="shrink-0 text-xs tabular-nums text-slate-500">{fmtKm(p.km)}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    </aside>
  )
}
