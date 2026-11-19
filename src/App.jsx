import { useCallback, useMemo, useRef, useState } from 'react'
import { Crosshair, Download, PanelLeftClose, PanelLeftOpen, ScanSearch, X } from 'lucide-react'
import MapView from './components/MapView'
import InsetMap from './components/InsetMap'
import Sidebar from './components/Sidebar'
import RadiusControl from './components/RadiusControl'
import PrintDialog from './components/PrintDialog'
import { NorthArrow, PrintHeader, PrintLegend, ServingBadge } from './components/PrintOverlays'
import ExportResult, { ExportProgress } from './components/ExportResult'
import PrintZoomBox from './components/PrintZoomBox'
import { captureFrame } from './lib/exportMap'
import { CATEGORIES, OFFICE, PLACES } from './data/places'
import { distanceKm } from './lib/geo'
import { DEFAULT_RADIUS, MAX_RADIUS, MIN_RADIUS, PAPERS, exportFrame } from './lib/radius'
import { DETAIL_PLACES, focusBounds } from './lib/detail'

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
  // { paper, area, bounds?, zoomBox?, step?, preview? } jab download wali map ban rahi ho.
  // step: 'main' (radius / screen view) phir 'detail' (Yateem Khana close-up page)
  // ?printpreview=A3 (A4..A0) URL mein ho to sirf layout dikhao, file na banao.
  // ?exporttest=A3 ho to file bana kar result dikhao (testing ke liye).
  const [printing, setPrinting] = useState(() => {
    const q = new URLSearchParams(location.search)
    const pp = q.get('printpreview')
    const step = q.get('page') === 'detail' ? 'detail' : 'main'
    const zb = () => { const b = focusBounds(); return [[b.getSouth(), b.getWest()], [b.getNorth(), b.getEast()]] }
    if (PAPERS[pp]) return { paper: pp, area: 'zoom', bounds: zb(), preview: true, step }
    const et = q.get('exporttest')
    if (!PAPERS[et]) return null
    // ?mode=radiusbox → purana version: KM radius map + neeche ZOOM card (same page)
    if (q.get('mode') === 'radiusbox') return { paper: et, area: 'radius', zoomBox: true, step: 'main' }
    return { paper: et, area: 'zoom', bounds: zb(), step: 'main' }
  })
  const [exportResult, setExportResult] = useState(null) // { pages: [{canvas, preview, title}], frame, name, paper }
  const [exportError, setExportError] = useState(null)
  const mapRef = useRef(null)
  const rootRef = useRef(null)
  const pagesRef = useRef([]) // bane hue pages (multi-page PDF ke liye)

  // Map tayyar hone par (tiles load) high-res tasveer banao.
  // true return = abhi agla page (close-up) banna baqi hai.
  const onPrintReady = useCallback(async () => {
    const job = printing
    try {
      const f = exportFrame(job.paper)
      const canvas = await captureFrame(rootRef.current, f)
      // Preview ke liye chhoti copy
      const small = document.createElement('canvas')
      small.width = Math.min(1600, canvas.width)
      small.height = Math.round((canvas.height * small.width) / canvas.width)
      small.getContext('2d').drawImage(canvas, 0, 0, small.width, small.height)
      const page = {
        canvas,
        preview: small.toDataURL('image/jpeg', 0.85),
        title: job.step === 'detail' ? 'Page 2 · Close-up (Yateem Khana)' : 'Page 1 · Area map',
        slug: job.step === 'detail' ? 'closeup' : job.area === 'zoom' ? 'zoomed' : job.bounds ? 'view' : `${radiusKm}km`,
      }
      pagesRef.current = job.step === 'detail' ? [...pagesRef.current, page] : [page]

      if (job.withDetail && job.step !== 'detail') {
        setPrinting({ ...job, step: 'detail' }) // ab close-up page banao
        return true
      }
      setExportResult({
        pages: pagesRef.current,
        frame: f,
        paper: job.paper,
        name: `Niazi-Express-Area-Map-${pagesRef.current[0].slug}-${job.paper}`,
      })
      setPrinting(null)
      return false
    } catch (err) {
      console.error(err)
      setExportError(String(err?.message || err))
      setPrinting(null)
      return false
    }
  }, [printing, radiusKm])

  const toggleCat = (key) =>
    setActiveCats((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const detailPage = printing?.step === 'detail'
  const places = useMemo(() => {
    // Close-up page: Yateem Khana ki saari local jagahen (radius filter nahi)
    if (detailPage) return DETAIL_PLACES.filter((p) => activeCats.has(p.cat))
    // Zoomed download: radius filter nahi (frame ke andar jo bhi hai dikhe)
    if (printing?.area === 'zoom') return PLACES.filter((p) => activeCats.has(p.cat))
    const q = query.trim().toLowerCase()
    return PLACES.filter(
      (p) => activeCats.has(p.cat) && DIST[p.id] <= radiusKm && (!q || p.name.toLowerCase().includes(q)),
    )
  }, [activeCats, query, radiusKm, detailPage, printing?.area])

  // Print header ki doosri line
  const printSubtitle = useMemo(() => {
    if (!printing) return ''
    if (printing.step === 'detail') return 'Close-up: Bund Road / Yateem Khana Bazar  •  Plazas, travel & emergency services'
    if (printing.area === 'zoom') return 'Zoomed: Yateem Khana Bazar / Bund Road, Lahore  •  Plazas, travel & services — asli location'
    if (printing.bounds) {
      const [[s, w], [n, e]] = printing.bounds
      const km = distanceKm({ lat: (s + n) / 2, lng: w }, { lat: (s + n) / 2, lng: e })
      return `Bund Road / Yateem Khana, Lahore  •  Close-up view (~${km.toFixed(1)} km across)`
    }
    return `Bund Road / Yateem Khana, Lahore  •  ${radiusKm} km radius`
  }, [printing, radiusKm])

  // Legend mein sirf woh categories jo map par hain
  // (Zoomed download: sirf woh jagahen jo page ke area mein hain)
  const legendPlaces = useMemo(() => {
    if (printing?.area !== 'zoom') return places
    const [[s, w], [n, e]] = printing.bounds
    return places.filter((p) => p.lat >= s && p.lat <= n && p.lng >= w && p.lng <= e)
  }, [places, printing])
  const legendCats = useMemo(
    () => Object.keys(CATEGORIES).filter((c) => legendPlaces.some((p) => p.cat === c)),
    [legendPlaces],
  )

  const onPick = useCallback((ll) => {
    setPicked(ll)
    const text = `lat: ${ll.lat.toFixed(4)}, lng: ${ll.lng.toFixed(4)}`
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [])

  return (
    <>
    <div
      ref={rootRef}
      className={`flex flex-col overflow-hidden text-slate-900 ${printing ? 'nx-printing bg-white' : 'h-dvh bg-slate-100'}`}
      style={printing ? { width: exportFrame(printing.paper).width, height: exportFrame(printing.paper).height } : undefined}
    >
      {/* Header (print mein professional navy header) */}
      {printing ? (
        <PrintHeader subtitle={printSubtitle} />
      ) : (
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
          <Download size={16} /> <span className="hidden sm:inline">Download / Print</span>
        </button>
      </header>
      )}

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
            mapRef={mapRef}
            places={places}
            selected={selected}
            onSelect={setSelected}
            pickMode={pickMode}
            onPick={onPick}
            picked={picked}
            radiusKm={radiusKm}
            printing={printing}
            onPrintReady={onPrintReady}
          />

          {/* Radius buttons: zoom (+/−) ke neeche */}
          {!printing && (
            <div className="absolute top-[84px] left-[10px] z-[500] print:hidden">
              <RadiusControl value={radiusKm} onChange={setRadiusKm} />
            </div>
          )}

          {/* Print / PDF overlays */}
          {printing && (
            <>
              {/* Top-left: Map Key chart (nishan + naam) */}
              <div className="absolute top-3 left-3 z-[600]">
                <PrintLegend cats={legendCats} places={legendPlaces} />
              </div>
              {/* Neeche left: ZOOM box (plazas ki asli location) — same page */}
              {printing.zoomBox && printing.step !== 'detail' && (
                <div className="absolute bottom-[46px] left-3 z-[600] h-[33%] w-[41%]">
                  <PrintZoomBox />
                </div>
              )}
              <div className="absolute top-3 right-4 z-[600]">
                <NorthArrow />
              </div>
              <div className="absolute right-[10px] bottom-[26px] z-[600]">
                <ServingBadge />
              </div>
            </>
          )}

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
          onPrint={({ paper, area }) => {
            // "Screen wala zoom": abhi jo area screen par hai wahi print par fit hoga
            let bounds = null
            if (area === 'zoom') {
              const b = focusBounds()
              bounds = [
                [b.getSouth(), b.getWest()],
                [b.getNorth(), b.getEast()],
              ]
            } else if (area === 'view' && mapRef.current) {
              const b = mapRef.current.getBounds()
              bounds = [
                [b.getSouth(), b.getWest()],
                [b.getNorth(), b.getEast()],
              ]
            }
            setPrintDialog(null)
            setSelected(null)
            setPrinting({ paper, area, bounds, step: 'main' })
          }}
        />
      )}
    </div>

    {/* Download: progress, result, error (root ke bahar, taake tasveer mein na aayen) */}
    {printing && !printing.preview && <ExportProgress paper={printing.paper} step={printing.step} />}
    {exportResult && <ExportResult result={exportResult} onClose={() => setExportResult(null)} />}
    {exportError && (
      <div className="fixed inset-x-0 bottom-6 z-[2000] mx-auto w-fit max-w-lg rounded-xl bg-red-600 px-4 py-3 text-sm text-white shadow-xl">
        Map nahi ban saki: {exportError}
        <button onClick={() => setExportError(null)} className="ml-3 underline">Theek hai</button>
      </div>
    )}
    </>
  )
}
