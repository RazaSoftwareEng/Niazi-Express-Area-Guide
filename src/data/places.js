// ─────────────────────────────────────────────────────────────
//  Map ka saara data yahan hai. Naya place add karna ho to
//  bas is list mein ek object daal dein.
//
//  tier 1 = bari landmark (label hamesha nazar aata hai)
//  tier 2 = local / chhoti jagah (label sirf zoom-in par)
//  tier 3 = bohat chhota icon (plazas) — noLabel: true ho to label nahi
//  approx: true = coordinates andaze se hain, picker se check karein
// ─────────────────────────────────────────────────────────────

/** Office / "I'm Here" point – map ka center */
export const OFFICE = {
  id: 'office',
  name: "I'm Here – Niazi Express",
  ur: 'ہم یہاں ہیں',
  lat: 31.5351,
  lng: 74.2904,
}

export const CATEGORIES = {
  transport: { label: 'Travel / Bus', color: '#1e1b8f', icon: 'Bus' },
  govt:      { label: 'Government',   color: '#0f766e', icon: 'Landmark' },
  health:    { label: 'Hospitals',    color: '#dc2626', icon: 'Hospital' },
  education: { label: 'Education',    color: '#7c3aed', icon: 'GraduationCap' },
  legal:     { label: 'Courts / Jail', color: '#475569', icon: 'Scale' },
  landmark:  { label: 'Landmarks',    color: '#c2410c', icon: 'MapPin' },
  emergency: { label: 'Emergency',    color: '#e11d48', icon: 'Siren' },
  metro:     { label: 'Orange Line',  color: '#f58220', icon: 'TrainFront' },
  plaza:     { label: 'Plazas / Markets', color: '#1d4ed8', icon: 'Building2' },
}

const MAIN_PLACES = [
  // ── Local area: Yateem Khana / Bund Road (tier 2) ──
  { id: 'niazi-express', name: 'Niazi Express', cat: 'transport', tier: 2, lat: 31.5384, lng: 74.2713, highlight: true },
  { id: 'skyways',       name: 'Skyways',       cat: 'transport', tier: 2, lat: 31.5377, lng: 74.2735 },
  { id: 'abdullah',      name: 'Abdullah Travel', cat: 'transport', tier: 2, lat: 31.5371, lng: 74.2672 },
  { id: 'bilal-1',       name: 'Bilal Travel',  cat: 'transport', tier: 2, lat: 31.5337, lng: 74.2789 },
  { id: 'darul-aman',    name: 'Dar-ul-Aman', ur: 'دارالامان', cat: 'govt', icon: 'House', tier: 2, lat: 31.5351, lng: 74.2761 },
  { id: 'city-bus',      name: 'City District Bus Stand', cat: 'transport', tier: 2, lat: 31.5355, lng: 74.2817 },
  { id: 'niazi-adda',    name: 'Niazi Adda',    ur: 'نیازی اڈہ', cat: 'transport', tier: 1, lat: 31.5365, lng: 74.2745, highlight: true },
  { id: 'police-yk',     name: 'Police Station', cat: 'emergency', icon: 'ShieldCheck', tier: 2, lat: 31.5354, lng: 74.2837 },
  { id: 'fire-brigade',  name: 'Fire Brigade (Rescue)', cat: 'emergency', icon: 'Flame', tier: 2, lat: 31.5343, lng: 74.286 },
  { id: 'yk-bazar',      name: 'Yateem Khana Bazar', ur: 'یتیم خانہ بازار', cat: 'landmark', icon: 'Store', tier: 2, lat: 31.5322, lng: 74.2841 },
  { id: 'yateem-chowk',  name: 'Yateem Khana Chowk', ur: 'یتیم خانہ چوک', cat: 'landmark', tier: 1, lat: 31.5319, lng: 74.2873 },
  { id: 'babu-sabu',     name: 'Babu Sabu',     ur: 'بابو صابو', cat: 'landmark', tier: 1, lat: 31.5401, lng: 74.2679 },

  // ── Yateem Khana Bazar ke plazas / buildings (sample image ki tarteeb, sarak ke center se ~40 m — kinare par)
  // Naam pata ho to 'Plaza N' ki jagah asli naam likh dein (hover par yahi naam dikhta hai) ──
  // noLabel: chhota icon, naam ka label nahi (sirf click par popup)
  { id: 'plaza-1', name: 'Plaza 1', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53416, lng: 74.28234 },
  { id: 'plaza-2', name: 'Plaza 2', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53392, lng: 74.28303 },
  { id: 'plaza-3', name: 'Plaza 3', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53368, lng: 74.28375 },
  { id: 'plaza-4', name: 'Plaza 4', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53345, lng: 74.28441 },
  { id: 'plaza-5', name: 'Plaza 5', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53320, lng: 74.28515 },
  { id: 'plaza-6', name: 'Plaza 6', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53297, lng: 74.28581 },
  { id: 'plaza-7', name: 'Plaza 7', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53274, lng: 74.28649 },
  { id: 'plaza-8', name: 'Plaza 8', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53292, lng: 74.28750 },
  { id: 'plaza-9', name: 'Plaza 9', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53348, lng: 74.28789 },
  { id: 'plaza-10', name: 'Plaza 10', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53413, lng: 74.28836 },
  { id: 'plaza-11', name: 'Plaza 11', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53374, lng: 74.28907 },
  { id: 'plaza-12', name: 'Plaza 12', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53326, lng: 74.28873 },
  { id: 'plaza-13', name: 'Plaza 13', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53275, lng: 74.28837 },
  { id: 'plaza-14', name: 'Plaza 14', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53230, lng: 74.28804 },
  { id: 'plaza-15', name: 'Plaza 15', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53349, lng: 74.28201 },
  { id: 'plaza-16', name: 'Plaza 16', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53327, lng: 74.28267 },
  { id: 'plaza-17', name: 'Plaza 17', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53305, lng: 74.28329 },
  { id: 'plaza-18', name: 'Plaza 18', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53282, lng: 74.28397 },
  { id: 'plaza-19', name: 'Plaza 19', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53260, lng: 74.28463 },
  { id: 'plaza-20', name: 'Plaza 20', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53235, lng: 74.28534 },
  { id: 'plaza-21', name: 'Plaza 21', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53212, lng: 74.28601 },
  { id: 'school-yk', name: 'School', cat: 'education', icon: 'School', tier: 2, lat: 31.53504, lng: 74.28832, approx: true },

  // ── Education ──
  { id: 'gc-samanabad',  name: 'Govt. College Samanabad', cat: 'education', icon: 'School', tier: 1, lat: 31.5385, lng: 74.3010, approx: true },
  { id: 'pu-new',        name: 'Punjab University (New Campus)', ur: 'جامعہ پنجاب', cat: 'education', tier: 1, lat: 31.4933, lng: 74.2950 },
  { id: 'pu-old',        name: 'Punjab University (Old Campus)', cat: 'education', tier: 1, lat: 31.5695, lng: 74.3078, approx: true },
  { id: 'gcu',           name: 'GC University', cat: 'education', tier: 1, lat: 31.5732, lng: 74.3084 },
  { id: 'lcwu',          name: 'LCWU (Jail Road)', cat: 'education', tier: 1, lat: 31.5447, lng: 74.3264 },
  { id: 'kinnaird',      name: 'Kinnaird College', cat: 'education', tier: 1, lat: 31.5378, lng: 74.3405 },
  { id: 'fccu',          name: 'Forman Christian College', cat: 'education', tier: 1, lat: 31.5215, lng: 74.3339 },
  { id: 'aitchison',     name: 'Aitchison College', cat: 'education', tier: 1, lat: 31.5504, lng: 74.3467 },

  // ── Health ──
  { id: 'services',      name: 'Services Hospital', cat: 'health', tier: 1, lat: 31.5408, lng: 74.3380, approx: true },
  { id: 'shaikh-zayed',  name: 'Shaikh Zayed Hospital', cat: 'health', tier: 1, lat: 31.5094, lng: 74.3093 },
  { id: 'ganga-ram',     name: 'Ganga Ram Hospital', cat: 'health', tier: 1, lat: 31.5547, lng: 74.3212, approx: true },

  // ── Government ──
  { id: 'assembly',      name: 'Punjab Assembly', ur: 'پنجاب اسمبلی', cat: 'govt', tier: 1, lat: 31.5622, lng: 74.3259 },
  { id: 'cm-house',      name: 'CM House (7-Club Road)', cat: 'govt', icon: 'Castle', tier: 1, lat: 31.5490, lng: 74.3398, approx: true },
  { id: 'governor',      name: 'Governor House', cat: 'govt', icon: 'Castle', tier: 1, lat: 31.5569, lng: 74.3355 },
  { id: 'gor-1',         name: 'G.O.R.-I', cat: 'govt', icon: 'House', tier: 1, lat: 31.5525, lng: 74.3405, approx: true },
  { id: 'town-hall',     name: 'Town Hall', cat: 'govt', icon: 'Building2', tier: 1, lat: 31.5685, lng: 74.3056 },
  { id: 'dc-office',     name: 'DC Office', cat: 'govt', icon: 'Building2', tier: 1, lat: 31.5725, lng: 74.3030, approx: true },

  // ── Courts / Jail ──
  { id: 'district-court', name: 'District Courts', cat: 'legal', tier: 1, lat: 31.5742, lng: 74.3054 },
  { id: 'camp-jail',     name: 'Camp Jail', cat: 'legal', icon: 'Lock', tier: 1, lat: 31.5417, lng: 74.3184 },

  // ── Landmarks ──
  { id: 'avari',         name: 'Avari Hotel', cat: 'landmark', icon: 'Hotel', tier: 1, lat: 31.5591, lng: 74.3272 },
  { id: 'zoo',           name: 'Chirya Ghar (Zoo)', ur: 'چڑیا گھر', cat: 'landmark', icon: 'PawPrint', tier: 1, lat: 31.5567, lng: 74.3255 },
  { id: 'mazang',        name: 'Mazang Chungi', ur: 'مزنگ چونگی', cat: 'landmark', tier: 1, lat: 31.5472, lng: 74.3158 },
  { id: 'chauburji',     name: 'Chauburji', ur: 'چوبرجی', cat: 'landmark', icon: 'Landmark', tier: 1, lat: 31.5539, lng: 74.3046 },
]

/** Orange Line ke stations (south → north) */
export const ORANGE_LINE = [
  { name: 'Salahuddin Road', lat: 31.5255, lng: 74.2832, approx: true },
  { name: 'Bund Road',       lat: 31.5322, lng: 74.2876 },
  { name: 'Samanabad',       lat: 31.5398, lng: 74.2928 },
  { name: 'Gulshan-e-Ravi',  lat: 31.5449, lng: 74.2953 },
  { name: 'Chauburji',       lat: 31.5523, lng: 74.3027 },
  { name: 'Lake Road',       lat: 31.5590, lng: 74.3062, approx: true },
]

// Distance rings ab radius ke hisaab se khud bante hain: src/lib/radius.js

/** Orange Line stations bhi map par label ke saath (category: metro) */
const STATION_PLACES = ORANGE_LINE.map((st) => ({
  id: `ol-${st.name.toLowerCase().replace(/[^a-z]+/g, '-')}`,
  name: `${st.name} Station`,
  cat: 'metro',
  tier: 2,
  lat: st.lat,
  lng: st.lng,
  approx: st.approx,
}))

export const PLACES = [...MAIN_PLACES, ...STATION_PLACES]
