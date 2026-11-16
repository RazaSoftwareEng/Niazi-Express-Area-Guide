import { useState } from 'react'
import { Download, X } from 'lucide-react'
import { MAX_RADIUS, MIN_RADIUS, PAPERS } from '../lib/radius'

/** Radius ke hisaab se kam se kam kaun sa size saaf parha jayega */
const recommendFor = (km) => (km <= 2 ? 'A4' : km <= 4 ? 'A3' : km <= 6 ? 'A2' : km <= 8 ? 'A1' : 'A0')

/**
 * Download se pehle poochta hai: KM radius ya screen wala zoom, aur paper size.
 * Radius badalte hi peeche map par live preview (onRadius) hota hai.
 */
export default function PrintDialog({ radius, onRadius, countInside, onCancel, onPrint }) {
  const [paper, setPaper] = useState('A3')
  const [area, setArea] = useState('radius') // 'radius' = KM ke hisaab se, 'view' = screen wala zoom
  const [withDetail, setWithDetail] = useState(true) // Page 2: Yateem Khana close-up
  const rec = area === 'radius' ? recommendFor(radius) : null

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto bg-slate-900/15 p-4 pt-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-slate-200">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Download size={18} /> Map download karein
          </h2>
          <button onClick={onCancel} className="rounded p-1 text-slate-500 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          {[
            ['radius', 'KM radius', 'Office ke gird chuna hua area'],
            ['view', 'Screen wala zoom', 'Jo abhi screen par hai'],
          ].map(([key, title, sub]) => (
            <button
              key={key}
              onClick={() => setArea(key)}
              className={`rounded-lg border px-3 py-2 text-left ${
                area === key ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-sm font-semibold">{title}</div>
              <div className={`text-[11px] ${area === key ? 'text-white/70' : 'text-slate-500'}`}>{sub}</div>
            </button>
          ))}
        </div>

        {area === 'radius' ? (
          <>
            <label className="block text-sm font-semibold text-slate-700">Kitne radius ka map chahiye?</label>
            <div className="mt-2 flex items-end gap-3">
              <span className="text-4xl font-black tabular-nums">{radius}</span>
              <span className="pb-1 text-slate-500">km</span>
              <span className="ml-auto pb-1 text-xs text-slate-500">{countInside} jagahen andar</span>
            </div>
            <input
              type="range"
              min={MIN_RADIUS}
              max={MAX_RADIUS}
              step={1}
              value={radius}
              onChange={(e) => onRadius(Number(e.target.value))}
              className="mt-2 w-full accent-slate-900"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{MIN_RADIUS} km</span>
              <span>{MAX_RADIUS} km</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">File mein radius ka circle nahi aayega, sirf itna area aayega.</p>
          </>
        ) : (
          <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
            Screen par jitna area / zoom hai wahi file mein aayega. Pehle map ko zoom karke set kar lein.
          </p>
        )}

        <div className="mt-4 flex items-baseline justify-between">
          <span className="text-sm font-semibold text-slate-700">Size (landscape)</span>
          {rec && <span className="text-[11px] text-emerald-700">{radius} km ke liye kam se kam {PAPERS[rec].label.split(' ')[0]} behtar</span>}
        </div>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {Object.entries(PAPERS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setPaper(key)}
              className={`relative rounded-lg border px-2 py-2 text-left ${
                paper === key ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="text-sm font-semibold">{p.label}</div>
              <div className={`text-[11px] ${paper === key ? 'text-white/70' : 'text-slate-500'}`}>{p.sub}</div>
              {key === rec && (
                <span className="absolute -top-2 right-1 rounded bg-emerald-600 px-1 text-[9px] font-bold text-white">BEST</span>
              )}
            </button>
          ))}
        </div>

        <label className="mt-4 flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm">
          <input
            type="checkbox"
            checked={withDetail}
            onChange={(e) => setWithDetail(e.target.checked)}
            className="mt-0.5 size-4 accent-emerald-700"
          />
          <span>
            <b>Close-up page bhi banayein</b> (Page 2)
            <span className="block text-xs text-slate-600">
              Yateem Khana / Bund Road zoom karke — har plaza, travel company, police, fire brigade alag alag naam ke saath
            </span>
          </span>
        </label>

        <div className="mt-5 flex gap-2">
          <button onClick={onCancel} className="flex-1 rounded-lg border border-slate-200 py-2 text-sm hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={() => onPrint({ paper, area, withDetail })}
            className="flex flex-[2] items-center justify-center gap-2 rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            <Download size={16} /> Map banayein
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-slate-400">
          High-quality PDF / PNG banegi — zoom karke bhi saaf parhi jayegi, print shop par bhi de sakte hain
        </p>
      </div>
    </div>
  )
}
