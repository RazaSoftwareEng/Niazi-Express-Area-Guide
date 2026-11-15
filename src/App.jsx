import { useCallback, useEffect, useMemo, useState } from 'react'
import { Crosshair, PanelLeftClose, PanelLeftOpen, Printer, ScanSearch, X } from 'lucide-react'
import MapView from './components/MapView'
import InsetMap from './components/InsetMap'
import Sidebar from './components/Sidebar'
import RadiusControl from './components/RadiusControl'
import PrintDialog from './components/PrintDialog'
import { CATEGORIES, OFFICE, PLACES } from './data/places'
import { distanceKm } from './lib/geo'
import { DEFAULT_RADIUS, MAX_RADIUS, MIN_RADIUS, PAPERS, PRINT_MARGIN_MM, paperPx } from './lib/radius'

const DIST = Object.fromEntries(PLACES.map((p) => [p.id, distanceKm(OFFICE, p)]))

export default function App() {
  const [activeCats, setActiveCats] = useState(() => new Set(Object.keys(CATEGORIES)))
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [pickMode, setPickMode] = useState(false)
  const [picked, setPicked] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [showInset, setShowInset] = useState(true)
  // ?r=3 URL mein ho to wahi radius, warna default
  const [radiusKm, setRadiusKm] = useState(() => {
    const r = Number(new URLSearchParams(location.search).get('r'))
    return r >= MIN_RADIUS && r <= MAX_RADIUS ? r : DEFAULT_RADIUS
  })
  const [printDialog, setPrintDialog] = useState(null) // { prevRadius } jab dialog khula ho
  const [printing, setPrinting] = useState(null) // { paper } jab print chal raha ho

  // Paper size browser ko batao (@page)
  useEffect(() => {
    if (!printing) return
    const el = document.createElement('style')
    el.textContent = `@page { size: ${PAPERS[printing.paper].w}mm ${PAPERS[printing.paper].h}mm; margin: ${PRINT_MARGIN_MM}mm; }`
    document.head.appendChild(el)
    return () => el.remove()
  }, [printing])

  const onPrintDone = useCallback(() => setPrinting(null), [])

  const toggleCat = (key) =>
    setActiveCats((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const places = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PLACES.filter(
      (p) => activeCats.has(p.cat) && DIST[p.id] <= radiusKm && (!q || p.name.toLowerCase().includes(q)),
    )
  }, [activeCats, query, radiusKm])

  const onPick = useCallback((ll) => {
    setPicked(ll)
    const text = `lat: ${ll.lat.toFixed(4)}, lng: ${ll.lng.toFixed(4)}`
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [])

  return (
    <div
      className={`flex flex-col overflow-hidden bg-slate-100 text-slate-900 ${printing ? '' : 'h-dvh'}`}
      style={printing ? paperPx(printing.paper) : undefined}
    >
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-2.5">
        <button
          onClick={() => setShowSidebar((v) => !v)}
          className="grid size-9 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 print:hidden"
          title={showSidebar ? 'Sidebar chhupayein' : 'Sidebar dikhayein'}
        >
          {showSidebar ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
        <div className="grid size-9 place-items-center rounded-lg bg-[#1e1b8f] text-sm font-black text-white">NE</div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-bold leading-tight md:text-lg">Niazi Express – Area Guide</h1>
          <p className="truncate text-xs text-slate-500">Bund Road / Yateem Khana, Lahore · {radiusKm} km radius</p>
        </div>
        <button
          onClick={() => {
            setPickMode((v) => !v)
            setPicked(null)
          }}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm print:hidden ${
            pickMode ? 'border-amber-400 bg-amber-50 text-amber-800' : 'border-slate-200 hover:bg-slate-50'
          }`}
          title="Map par click karein aur coordinates copy ho jayenge"
        >
          <Crosshair size={16} /> <span className="hidden sm:inline">Coordinates</span>
        </button>
        <button
          onClick={() => setPrintDialog({ prevRadius: radiusKm })}
          className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-700 print:hidden"
        >
          <Printer size={16} /> <span className="hidden sm:inline">Print / PDF</span>
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col-reverse md:flex-row">
        <div
          className={`h-[40%] shrink-0 border-t border-slate-200 md:h-auto md:w-80 md:border-t-0 md:border-r print:hidden ${
            showSidebar && !printing ? '' : 'hidden'
          }`}
        >
          <Sidebar
            activeCats={activeCats}
            toggleCat={toggleCat}
            query={query}
            setQuery={setQuery}
            places={places}
            selected={selected}
            onSelect={setSelected}
          />
        </div>

        <main className="relative min-h-0 flex-1">
          <MapView
            places={places}
            selected={selected}
            onSelect={setSelected}
            pickMode={pickMode}
            onPick={onPick}
            picked={picked}
            radiusKm={radiusKm}
            printing={printing}
            onPrintDone={onPrintDone}
          />

          {/* Radius buttons: zoom (+/−) ke neeche */}
          <div className="absolute top-[84px] left-[10px] z-[500] print:hidden">
            <RadiusControl value={radiusKm} onChange={setRadiusKm} />
          </div>

          {/* Close-up box: sirf screen par, print/PDF mein nahi */}
          {printing ? null : showInset ? (
            <div className="absolute right-3 bottom-6 z-[500] hidden lg:block print:hidden">
              <InsetMap
                onOpen={() => setSelected(PLACES.find((p) => p.id === 'niazi-adda'))}
                onClose={() => setShowInset(false)}
              />
            </div>
          ) : (
            <button
              onClick={() => setShowInset(true)}
              className="absolute right-3 bottom-6 z-[500] hidden items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-lg hover:bg-slate-700 lg:flex print:hidden"
            >
              <ScanSearch size={16} /> Close-up dikhayein
            </button>
          )}

          {pickMode && (
            <div className="absolute top-3 left-1/2 z-[600] flex -translate-x-1/2 items-center gap-2 rounded-lg bg-amber-500 px-3 py-2 text-sm font-medium text-white shadow-lg">
              {picked
                ? `${copied ? '✓ Copied: ' : ''}lat: ${picked.lat.toFixed(4)}, lng: ${picked.lng.toFixed(4)}`
                : 'Map par click karein — coordinates copy ho jayenge'}
              <button onClick={() => setPickMode(false)} className="rounded p-0.5 hover:bg-white/20">
                <X size={14} />
              </button>
            </div>
          )}
        </main>
      </div>

      {printDialog && (
        <PrintDialog
          radius={radiusKm}
          onRadius={setRadiusKm}
          countInside={PLACES.filter((p) => DIST[p.id] <= radiusKm).length}
          onCancel={() => {
            setRadiusKm(printDialog.prevRadius)
            setPrintDialog(null)
          }}
          onPrint={(opts) => {
            setPrintDialog(null)
            setSelected(null)
            setPrinting(opts)
          }}
        />
      )}
    </div>
  )
}
