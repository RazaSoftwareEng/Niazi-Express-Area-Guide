# Niazi Express – Area Map

Interactive map: Bund Road / Yateem Khana (Lahore) ke 6 km radius ki famous jagahen.

## Chalane ka tareeqa
```
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
```

## Jagah add / theek karna
- Saara data: `src/data/places.js`
- Header mein **Coordinates** button dabayein, map par click karein → `lat, lng` copy ho jayega → `places.js` mein paste karein.
- `approx: true` wali jagahon ke coordinates andaze se hain (popup mein ⚠ dikhta hai) — inhein verify karna hai.
- Naya icon chahiye to `src/lib/iconMap.js` mein lucide icon add karein.

## Download (PDF / PNG)
Header mein **Download / Print** → "KM radius" ya "Screen wala zoom" chunein → size chunein
(A4, A3, A2, **A1 · Chart**, **A0 · Large**) → **Map banayein** → preview → **PDF** ya **PNG** download.

- File ~130–200 DPI ki hoti hai, zoom karke bhi saaf parhi jati hai (print shop ko de sakte hain).
- File mein radius ka circle / grey area / close-up box nahi aata; navy header, legend, scale bar, north arrow aata hai.
- Layout bina file banaye dekhna: `?printpreview=A3&r=3`
