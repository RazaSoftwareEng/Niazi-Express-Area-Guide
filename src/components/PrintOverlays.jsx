import { createElement } from 'react'
import { MapPin } from 'lucide-react'
import { CATEGORIES } from '../data/places'
import { ICONS } from '../lib/iconMap'
import { HIGHLIGHT_ROADS } from '../data/highlightRoads'

/*
 * Ye sab sirf Print / PDF mein dikhta hai (professional layout):
 * navy header band, legend, north arrow aur "Serving Lahore" badge.
 */

const NAVY = '#0b1f4f'

/** Upar wali navy patti: logo, title, radius, tagline */
export function PrintHeader({ subtitle }) {
  return (
    <header
      className="flex items-center gap-5 px-6 py-3 text-white"
      style={{ background: `linear-gradient(90deg, ${NAVY} 0%, #12306f 60%, #1a3d85 100%)` }}
    >
      <div className="grid size-16 shrink-0 place-items-center rounded-xl border-[3px] border-white/90 bg-[#13306e] text-2xl font-black tracking-tight">
        NE
      </div>
      <div className="h-14 w-[2px] shrink-0 bg-white/70" />
      <div className="min-w-0 flex-1">
        <h1 className="text-[30px] leading-tight font-extrabold">Niazi Express – Area Guide</h1>
        <p className="text-[16px] text-white/90">{subtitle}</p>
      </div>
      <div className="shrink-0 text-[30px] text-white/95" style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 600 }}>
        Fast. Reliable. Across Lahore
      </div>
    </header>
  )
}

function LegendDot({ color, icon }) {
  return (
    <span className="grid size-[18px] shrink-0 place-items-center rounded-full" style={{ background: color }}>
      {createElement(ICONS[icon] || MapPin, { size: 10, color: '#fff', strokeWidth: 2.75 })}
    </span>
  )
}

/**
 * Top-left "Map Key" chart: har nishan (icon) ka matlab + us category ki jagahon ke naam,
 * taake dekhne wala samajh sake kaun sa nishan kya hai.
 */
export function PrintLegend({ cats, places }) {
    return (
    <div className="w-[290px] overflow-hidden rounded-xl border-[3px] bg-white/[0.97] shadow-xl" style={{ borderColor: NAVY }}>
      <div className="flex items-baseline justify-between px-3.5 py-2 text-white" style={{ background: NAVY }}>
        <span className="text-[17px] font-bold">Map Key</span>
      </div>
      <ul className="divide-y divide-slate-100 px-3.5 py-1.5">
        <li className="flex items-center gap-2.5 py-1.5">
          <svg viewBox="0 0 24 34" width="18" height="25" className="shrink-0">
            <path d="M12 0C5.4 0 0 5.3 0 11.9 0 20.8 12 34 12 34s12-13.2 12-22.1C24 5.3 18.6 0 12 0z" fill="#ea4335" />
            <circle cx="12" cy="12" r="4.5" fill="#a52714" />
          </svg>
          <div>
            <div className="text-[13.5px] font-bold text-slate-900">I'm Here! — Niazi Express</div>
          </div>
        </li>
        {cats.map((key) => (
          <li key={key} className="flex items-center gap-2.5 py-1.5">
            <span className="grid size-[22px] shrink-0 place-items-center rounded-full" style={{ background: CATEGORIES[key].color }}>
              {createElement(ICONS[CATEGORIES[key].icon] || MapPin, { size: 12, color: '#fff', strokeWidth: 2.75 })}
            </span>
            <div className="min-w-0">
              <div className="text-[13.5px] font-bold" style={{ color: CATEGORIES[key].color }}>
                {key === 'metro' ? 'Orange Line Stations' : CATEGORIES[key].label}
              </div>
            </div>
          </li>
        ))}
        <li className="flex items-center gap-2.5 py-1.5">
          <span className="h-[6px] w-[22px] shrink-0 rounded bg-[#f58220]" />
          <span className="text-[13px] font-semibold text-slate-800">Orange Line (Metro track)</span>
        </li>
        {HIGHLIGHT_ROADS.map((r) => (
          <li key={r.id} className="flex items-center gap-2.5 py-1.5">
            <span className="h-[6px] w-[22px] shrink-0 rounded" style={{ background: r.color }} />
            <span className="text-[13px] font-semibold text-slate-800">{r.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Upar right: North arrow */
export function NorthArrow() {
  return (
    <div className="flex flex-col items-center drop-shadow" style={{ color: NAVY }}>
      <span className="text-[22px] leading-none font-black">N</span>
      <svg viewBox="0 0 40 48" width="40" height="48">
        <path d="M20 0 L38 46 L20 34 L2 46 Z" fill={NAVY} />
        <path d="M20 0 L20 34 L2 46 Z" fill="#2a4a9a" />
      </svg>
    </div>
  )
}

/** Neeche right: "Serving Lahore" badge */
export function ServingBadge() {
  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-white shadow-lg" style={{ background: NAVY }}>
      <MapPin size={30} strokeWidth={2.25} />
      <div className="text-[17px] leading-tight font-bold">
        Serving Lahore
        <br />
        Within This Area
      </div>
    </div>
  )
}
