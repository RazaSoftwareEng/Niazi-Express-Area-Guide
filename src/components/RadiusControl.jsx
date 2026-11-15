import { MAX_RADIUS, MIN_RADIUS } from '../lib/radius'

const OPTIONS = Array.from({ length: MAX_RADIUS - MIN_RADIUS + 1 }, (_, i) => MIN_RADIUS + i)

/** Zoom (+/−) ke neeche radius buttons: click karte hi map us radius par fit ho jata hai */
export default function RadiusControl({ value, onChange }) {
  return (
    <div className="overflow-hidden rounded-[4px] border-2 border-black/20 bg-white bg-clip-padding text-center shadow-sm">
      <div className="border-b border-slate-200 px-1 py-1 text-[10px] font-bold leading-none text-slate-500 uppercase">
        km
      </div>
      {OPTIONS.map((km) => (
        <button
          key={km}
          onClick={() => onChange(km)}
          title={`${km} km radius dekhein`}
          className={`block h-[26px] w-[30px] border-b border-slate-100 text-xs font-semibold last:border-b-0 ${
            km === value ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          {km}
        </button>
      ))}
    </div>
  )
}
