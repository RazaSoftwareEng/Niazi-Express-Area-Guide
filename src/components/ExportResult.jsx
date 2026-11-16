import { useState } from 'react'
import { Download, FileImage, FileText, Loader2, X } from 'lucide-react'
import { PAPERS } from '../lib/radius'
import { downloadPdf, downloadPng } from '../lib/exportMap'

/** "Map ban raha hai…" — capture ke dauran screen par */
export function ExportProgress({ paper, step }) {
  return (
    <div className="fixed inset-0 z-[2000] grid place-items-center bg-slate-900/60">
      <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-2xl">
        <Loader2 className="animate-spin" size={22} />
        <div>
          <div className="font-semibold">
            {PAPERS[paper].label} {step === 'detail' ? 'close-up page (2/2)' : 'map'} ban raha hai…
          </div>
          <div className="text-xs text-slate-500">Map ke tiles load ho rahe hain, thora intezar karein</div>
        </div>
      </div>
    </div>
  )
}

/** Bani hui map ka preview + PDF / PNG download */
export default function ExportResult({ result, onClose }) {
  const [busy, setBusy] = useState(null)
  const { pages, frame, name, paper } = result

  const run = async (kind) => {
    setBusy(kind)
    try {
      if (kind === 'pdf') await downloadPdf(pages.map((p) => p.canvas), frame, name)
      else {
        const p = pages[kind]
        await downloadPng(p.canvas, `${name}${kind > 0 ? `-${p.slug}` : ''}`)
      }
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/60 p-4">
      <div className="flex max-h-full w-full max-w-5xl flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Download size={18} /> Map tayyar hai
            </h2>
            <p className="text-xs text-slate-500">
              {PAPERS[paper].label} ({PAPERS[paper].sub}) · {pages.length} page · {pages[0].canvas.width} × {pages[0].canvas.height} px
            </p>
          </div>
          <button onClick={onClose} className="rounded p-1 text-slate-500 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className={`grid min-h-0 flex-1 gap-4 overflow-auto bg-slate-100 p-4 ${pages.length > 1 ? 'md:grid-cols-2' : ''}`}>
          {pages.map((p, i) => (
            <figure key={i} className="text-center">
              <img
                src={p.preview}
                alt={i === 0 ? 'Map preview' : 'Close-up preview'}
                className="mx-auto max-h-[60vh] w-auto rounded shadow-lg ring-1 ring-slate-300"
              />
              <figcaption className="mt-1.5 text-xs font-medium text-slate-600">{p.title}</figcaption>
            </figure>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 px-5 py-3">
          <span className="mr-auto text-xs text-slate-500">PDF print ke liye behtar · PNG WhatsApp / share ke liye</span>
          {pages.map((p, i) => (
            <button
              key={i}
              onClick={() => run(i)}
              disabled={busy !== null}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
            >
              {busy === i ? <Loader2 size={16} className="animate-spin" /> : <FileImage size={16} />}
              PNG {pages.length > 1 ? (i === 0 ? '· Page 1' : '· Close-up') : 'download'}
            </button>
          ))}
          <button
            onClick={() => run('pdf')}
            disabled={busy !== null}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {busy === 'pdf' ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />} PDF download{pages.length > 1 ? ` (${pages.length} pages)` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
