import { toCanvas } from 'html-to-image'

/**
 * Print layout (header + map + legend) ki high-resolution tasveer banata hai.
 * Zoom buttons waghera capture mein shamil nahi hote.
 */
export async function captureFrame(node, frame) {
  return toCanvas(node, {
    width: frame.width,
    height: frame.height,
    pixelRatio: frame.pixelRatio,
    backgroundColor: '#ffffff',
    cacheBust: false,
    filter: (el) => !el.classList?.contains('leaflet-control-zoom'),
  })
}

const save = (blob, name) => {
  const url = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement('a'), { href: url, download: name })
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

/** Paper size ki PDF (har canvas ek page, poora page map, koi margin nahi) */
export async function downloadPdf(canvases, frame, name) {
  const { jsPDF } = await import('jspdf') // sirf zaroorat par load
  const [w, h] = frame.mm
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [w, h], compress: true })
  canvases.forEach((canvas, i) => {
    if (i > 0) pdf.addPage([w, h], 'landscape')
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, w, h, undefined, 'FAST')
  })
  pdf.setProperties({ title: 'Niazi Express – Area Guide' })
  save(pdf.output('blob'), `${name}.pdf`)
}

export function downloadPng(canvas, name) {
  return new Promise((resolve) =>
    canvas.toBlob((blob) => {
      save(blob, `${name}.png`)
      resolve()
    }, 'image/png'),
  )
}
