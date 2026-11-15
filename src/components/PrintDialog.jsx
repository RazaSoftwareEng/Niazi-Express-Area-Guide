import { useState } from 'react'
import { Printer, X } from 'lucide-react'
import { MAX_RADIUS, MIN_RADIUS, PAPERS } from '../lib/radius'

/**
 * Print se pehle poochta hai: kitne km radius aur kaun sa paper. (Close-up box print nahi hota.)
 * Radius badalte hi peeche map par live preview (onRadius) hota hai.
 */
export default function PrintDialog({ radius, onRadius, countInside, onCancel, onPrint }) {
  const [paper, setPaper] = useState('A3')

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center bg-slate-900/15 p-4 pt-20 print:hidden">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-slate-200">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Printer size={18} /> Print / PDF
          </h2>
          <button onClick={onCancel} className="rounded p-1 text-slate-500 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <label className="block text-sm font-semibold text-slate-700">Kitne radius ka map print karna hai?</label>
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
        <p className="mt-2 text-xs text-slate-500">Peeche map par preview dekh lein — jo nazar aa raha hai wahi print hoga.</p>

        <div className="mt-4 text-sm font-semibold text-slate-700">Paper</div>
        <div className="mt-1.5 grid grid-cols-2 gap-2">
          {Object.entries(PAPERS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setPaper(key)}
              className={`rounded-lg border px-3 py-2 text-sm ${
                paper === key ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p.label} · landscape
            </button>
          ))}
        </div>


        <div className="mt-5 flex gap-2">
          <button onClick={onCancel} className="flex-1 rounded-lg border border-slate-200 py-2 text-sm hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={() => onPrint({ paper })}
            className="flex flex-[2] items-center justify-center gap-2 rounded-lg bg-slate-900 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            <Printer size={16} /> Print karein
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-slate-400">PDF ke liye print window mein "Save as PDF" chunein</p>
      </div>
    </div>
  )
}
