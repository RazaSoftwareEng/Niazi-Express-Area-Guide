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
  // Multan Road (Orange Line) dono taraf: Yateem Khana se Samanabad Station tak
  { id: 'plaza-22', name: 'Plaza 22', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53519, lng: 74.28910 },
  { id: 'plaza-23', name: 'Plaza 23', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53481, lng: 74.28982 },
  { id: 'plaza-24', name: 'Plaza 24', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53569, lng: 74.28945 },
  { id: 'plaza-26', name: 'Plaza 26', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53620, lng: 74.28981 },
  { id: 'plaza-27', name: 'Plaza 27', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53581, lng: 74.29053 },
  { id: 'plaza-28', name: 'Plaza 28', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53670, lng: 74.29020 },
  { id: 'plaza-29', name: 'Plaza 29', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53629, lng: 74.29089 },
  { id: 'plaza-30', name: 'Plaza 30', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53719, lng: 74.29059 },
  { id: 'plaza-31', name: 'Plaza 31', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53678, lng: 74.29128 },
  { id: 'plaza-32', name: 'Plaza 32', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53767, lng: 74.29098 },
  { id: 'plaza-33', name: 'Plaza 33', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53726, lng: 74.29167 },
  { id: 'plaza-34', name: 'Plaza 34', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53815, lng: 74.29137 },
  { id: 'plaza-35', name: 'Plaza 35', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53774, lng: 74.29206 },
  { id: 'plaza-36', name: 'Plaza 36', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53861, lng: 74.29169 },
  { id: 'plaza-37', name: 'Plaza 37', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53829, lng: 74.29245 },
  { id: 'plaza-38', name: 'Plaza 38', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53912, lng: 74.29195 },
  { id: 'plaza-39', name: 'Plaza 39', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53885, lng: 74.29273 },
  // Samanabad Chowk (Morr): Multan Road aage/peeche + Samanabad Main Blvd (right) + Gulshan-e-Ravi Road (left)
  { id: 'plaza-40', name: 'Plaza 40', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54014, lng: 74.29237 },
  { id: 'plaza-41', name: 'Plaza 41', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53989, lng: 74.29316 },
  { id: 'plaza-42', name: 'Plaza 42', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54068, lng: 74.29261 },
  { id: 'plaza-43', name: 'Plaza 43', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54044, lng: 74.29340 },
  { id: 'plaza-44', name: 'Plaza 44', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54124, lng: 74.29283 },
  { id: 'plaza-45', name: 'Plaza 45', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54100, lng: 74.29363 },
  { id: 'plaza-46', name: 'Plaza 46', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54177, lng: 74.29304 },
  { id: 'plaza-47', name: 'Plaza 47', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54158, lng: 74.29386 },
  { id: 'plaza-48', name: 'Plaza 48', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54234, lng: 74.29322 },
  { id: 'plaza-49', name: 'Plaza 49', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54215, lng: 74.29404 },
  { id: 'plaza-50', name: 'Plaza 50', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54290, lng: 74.29339 },
  { id: 'plaza-51', name: 'Plaza 51', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54273, lng: 74.29420 },
  { id: 'plaza-52', name: 'Plaza 52', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54352, lng: 74.29365 },
  { id: 'plaza-53', name: 'Plaza 53', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54321, lng: 74.29441 },
  { id: 'plaza-54', name: 'Plaza 54', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54507, lng: 74.29470 },
  { id: 'plaza-55', name: 'Plaza 55', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54558, lng: 74.29506 },
  { id: 'plaza-56', name: 'Plaza 56', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54520, lng: 74.29578 },
  { id: 'plaza-57', name: 'Plaza 57', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54610, lng: 74.29543 },
  { id: 'plaza-58', name: 'Plaza 58', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54569, lng: 74.29612 },
  { id: 'plaza-59', name: 'Plaza 59', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54659, lng: 74.29582 },
  { id: 'plaza-60', name: 'Plaza 60', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54617, lng: 74.29650 },
  { id: 'plaza-61', name: 'Plaza 61', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54709, lng: 74.29624 },
  { id: 'plaza-62', name: 'Plaza 62', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54662, lng: 74.29688 },
  { id: 'plaza-63', name: 'Plaza 63', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54753, lng: 74.29667 },
  { id: 'plaza-64', name: 'Plaza 64', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54708, lng: 74.29733 },
  { id: 'plaza-65', name: 'Plaza 65', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54799, lng: 74.29710 },
  { id: 'plaza-66', name: 'Plaza 66', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54754, lng: 74.29776 },
  { id: 'plaza-67', name: 'Plaza 67', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54845, lng: 74.29752 },
  { id: 'plaza-68', name: 'Plaza 68', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54800, lng: 74.29818 },
  { id: 'plaza-69', name: 'Plaza 69', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54891, lng: 74.29792 },
  { id: 'plaza-70', name: 'Plaza 70', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54849, lng: 74.29860 },
  { id: 'plaza-71', name: 'Plaza 71', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54410, lng: 74.29558 },
  { id: 'plaza-72', name: 'Plaza 72', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54362, lng: 74.29540 },
  { id: 'plaza-73', name: 'Plaza 73', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54400, lng: 74.29614 },
  { id: 'plaza-74', name: 'Plaza 74', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54350, lng: 74.29607 },
  { id: 'plaza-75', name: 'Plaza 75', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54394, lng: 74.29677 },
  { id: 'plaza-76', name: 'Plaza 76', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54343, lng: 74.29670 },
  { id: 'plaza-77', name: 'Plaza 77', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54386, lng: 74.29744 },
  { id: 'plaza-78', name: 'Plaza 78', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54337, lng: 74.29728 },
  { id: 'plaza-79', name: 'Plaza 79', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54371, lng: 74.29805 },
  { id: 'plaza-80', name: 'Plaza 80', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54322, lng: 74.29788 },
  { id: 'plaza-81', name: 'Plaza 81', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54356, lng: 74.29866 },
  { id: 'plaza-82', name: 'Plaza 82', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54307, lng: 74.29849 },
  { id: 'plaza-83', name: 'Plaza 83', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54570, lng: 74.29264 },
  { id: 'plaza-84', name: 'Plaza 84', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54533, lng: 74.29223 },
  { id: 'plaza-85', name: 'Plaza 85', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54537, lng: 74.29309 },
  { id: 'plaza-86', name: 'Plaza 86', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54496, lng: 74.29274 },
  { id: 'plaza-87', name: 'Plaza 87', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54505, lng: 74.29360 },
  { id: 'plaza-88', name: 'Plaza 88', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54464, lng: 74.29326 },
  { id: 'plaza-89', name: 'Plaza 89', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54477, lng: 74.29412 },
  { id: 'plaza-90', name: 'Plaza 90', cat: 'plaza', tier: 3, noLabel: true, lat: 31.54434, lng: 74.29381 },
  // Yateem Khana Chowk ke neeche: Multan Road (Salahuddin Road Station tak) + Al-Mumtaz Road
  { id: 'plaza-91', name: 'Plaza 91', cat: 'plaza', tier: 3, noLabel: true, lat: 31.52638, lng: 74.28323 },
  { id: 'plaza-92', name: 'Plaza 92', cat: 'plaza', tier: 3, noLabel: true, lat: 31.52614, lng: 74.28402 },
  { id: 'plaza-93', name: 'Plaza 93', cat: 'plaza', tier: 3, noLabel: true, lat: 31.52694, lng: 74.28345 },
  { id: 'plaza-94', name: 'Plaza 94', cat: 'plaza', tier: 3, noLabel: true, lat: 31.52669, lng: 74.28424 },
  { id: 'plaza-95', name: 'Plaza 95', cat: 'plaza', tier: 3, noLabel: true, lat: 31.52753, lng: 74.28378 },
  { id: 'plaza-96', name: 'Plaza 96', cat: 'plaza', tier: 3, noLabel: true, lat: 31.52715, lng: 74.28450 },
  { id: 'plaza-97', name: 'Plaza 97', cat: 'plaza', tier: 3, noLabel: true, lat: 31.52804, lng: 74.28414 },
  { id: 'plaza-98', name: 'Plaza 98', cat: 'plaza', tier: 3, noLabel: true, lat: 31.52765, lng: 74.28486 },
  { id: 'plaza-99', name: 'Plaza 99', cat: 'plaza', tier: 3, noLabel: true, lat: 31.52853, lng: 74.28450 },
  { id: 'plaza-100', name: 'Plaza 100', cat: 'plaza', tier: 3, noLabel: true, lat: 31.52816, lng: 74.28523 },
  { id: 'plaza-101', name: 'Plaza 101', cat: 'plaza', tier: 3, noLabel: true, lat: 31.52903, lng: 74.28484 },
  { id: 'plaza-102', name: 'Plaza 102', cat: 'plaza', tier: 3, noLabel: true, lat: 31.52867, lng: 74.28557 },
  { id: 'plaza-103', name: 'Plaza 103', cat: 'plaza', tier: 3, noLabel: true, lat: 31.52954, lng: 74.28518 },
  { id: 'plaza-104', name: 'Plaza 104', cat: 'plaza', tier: 3, noLabel: true, lat: 31.52918, lng: 74.28591 },
  { id: 'plaza-105', name: 'Plaza 105', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53005, lng: 74.28553 },
  { id: 'plaza-106', name: 'Plaza 106', cat: 'plaza', tier: 3, noLabel: true, lat: 31.52969, lng: 74.28626 },
  { id: 'plaza-107', name: 'Plaza 107', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53056, lng: 74.28587 },
  { id: 'plaza-108', name: 'Plaza 108', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53020, lng: 74.28660 },
  { id: 'plaza-109', name: 'Plaza 109', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53107, lng: 74.28622 },
  { id: 'plaza-110', name: 'Plaza 110', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53071, lng: 74.28694 },
  { id: 'plaza-111', name: 'Plaza 111', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53120, lng: 74.28704 },
  { id: 'plaza-112', name: 'Plaza 112', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53150, lng: 74.28781 },
  { id: 'plaza-113', name: 'Plaza 113', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53100, lng: 74.28773 },
  { id: 'plaza-114', name: 'Plaza 114', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53141, lng: 74.28846 },
  { id: 'plaza-115', name: 'Plaza 115', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53092, lng: 74.28833 },
  { id: 'plaza-116', name: 'Plaza 116', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53125, lng: 74.28911 },
  { id: 'plaza-117', name: 'Plaza 117', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53077, lng: 74.28889 },
  { id: 'plaza-118', name: 'Plaza 118', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53106, lng: 74.28969 },
  { id: 'plaza-119', name: 'Plaza 119', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53058, lng: 74.28949 },
  { id: 'plaza-120', name: 'Plaza 120', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53089, lng: 74.29022 },
  { id: 'plaza-121', name: 'Plaza 121', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53039, lng: 74.29015 },
  { id: 'plaza-122', name: 'Plaza 122', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53083, lng: 74.29085 },
  { id: 'plaza-123', name: 'Plaza 123', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53033, lng: 74.29078 },
  { id: 'plaza-124', name: 'Plaza 124', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53080, lng: 74.29146 },
  { id: 'plaza-125', name: 'Plaza 125', cat: 'plaza', tier: 3, noLabel: true, lat: 31.53029, lng: 74.29143 },
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

  // ── Naye landmarks ──
  { id: 'samanabad-chowk', name: 'Samanabad Chowk', ur: 'سمن آباد موڑ', cat: 'landmark', tier: 1, lat: 31.5441, lng: 74.2947 },
  { id: 'pc-hotel',      name: 'PC Hotel (Pearl Continental)', cat: 'landmark', icon: 'Hotel', tier: 1, lat: 31.5524, lng: 74.3381 },
  { id: 'supreme-court', name: 'Supreme Court (Lahore Registry)', cat: 'legal', tier: 1, lat: 31.5648, lng: 74.3129 },
  { id: 'high-court',    name: 'Lahore High Court', cat: 'legal', tier: 1, lat: 31.5637, lng: 74.3148 },
  { id: 'gor-2',         name: 'G.O.R.-II', cat: 'govt', icon: 'House', tier: 1, lat: 31.5461, lng: 74.3129 },
  { id: 'gor-3',         name: 'G.O.R.-III', cat: 'govt', icon: 'House', tier: 1, lat: 31.5385, lng: 74.3255, approx: true },

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
