import { createElement } from 'react'
import { MapPin } from 'lucide-react'
import { CATEGORIES } from '../data/places'
import { ICONS } from '../lib/iconMap'

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

/** Neeche left: legend (sirf woh categories jo map par hain) */
export function PrintLegend({ cats }) {
  return (
    <div className="w-[210px] overflow-hidden rounded-xl border-2 bg-white/95 shadow-lg" style={{ borderColor: NAVY }}>
      <div className="px-3 py-1.5 text-[15px] font-bold text-white" style={{ background: NAVY }}>
        Legend
      </div>
      <ul className="space-y-[5px] px-3 py-2 text-[12.5px] font-medium text-slate-800">
        <li className="flex items-center gap-2.5">
          <svg viewBox="0 0 24 34" width="14" height="20" className="mx-[2px]">
            <path d="M12 0C5.4 0 0 5.3 0 11.9 0 20.8 12 34 12 34s12-13.2 12-22.1C24 5.3 18.6 0 12 0z" fill="#ea4335" />
            <circle cx="12" cy="12" r="4.5" fill="#a52714" />
          </svg>
          Your Location
        </li>
        {cats.map((key) => (
          <li key={key} className="flex items-center gap-2.5">
            <LegendDot color={CATEGORIES[key].color} icon={CATEGORIES[key].icon} />
            {key === 'metro' ? 'Train Station' : CATEGORIES[key].label}
          </li>
        ))}
        <li className="flex items-center gap-2.5">
          <span className="h-[5px] w-[18px] shrink-0 rounded bg-[#f58220]" />
          Orange Line (Metro)
        </li>
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
