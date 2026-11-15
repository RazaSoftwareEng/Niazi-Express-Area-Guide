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

## PDF
**Print / PDF** button → "Save as PDF" (A3 landscape set hai).
