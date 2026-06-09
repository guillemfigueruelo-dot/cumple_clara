// ============================================================
// ⚙️  ARCHIVO DE CONFIGURACIÓN — RELLENA TODOS LOS VALORES
// ============================================================
const CONFIG = {
  // --- TELEGRAM ---
  TELEGRAM_BOT_TOKEN: "8616310072:AAGiSA9U6jmafK7zCxO9YZrozkqLl_qsDuQ", // ← tu token
  TELEGRAM_CHAT_ID:   "1859072962",   // ← tu chat ID personal

  // --- PINs DIARIOS (Fase 2) ---
  PINS: {
    trap:  "0406",   // PIN trampa del botón "Acceso anticipado"
    day1:  "0406",   // 28 de junio... o lo que quieras
    day2:  "1109",
    day3:  "2026",
    day4:  "5465",
    day5:  "2992",
  },

  // --- PREMIOS DE LA RULETA ---
  PRIZES: [
    "🍣 Sushii",
    "🎬 Harry Potteer",
    "💆 Massatget professional",
    "🏖️ Ruta",
    "🍔 Chef personal",
    "✔️ Dia de Sí a tot",
    "🎁 Comodín",
  ],

  // --- FOTOS TIMELINE (Fase 1) ---
  TIMELINE: [
    { date: "30 de Septembre de 2025",    caption: "La nostra primera foto junts",  img: "assets/photos/1_30-09-2025_primera_foto.jpeg" },
    { date: "6 de Novembre de 2025",   caption: "Comença automàticament la nostra addició al sushi", img: "assets/photos/2_06-11-2025_sushi.jpeg" },
    { date: "28 de Novembre de 2025",caption: "El nostre primer viatge, a Londres",              img: "assets/photos/3_28-11-2025_londres.jpeg" },
    { date: "29 de Gener de 2026",caption: "Sempre igual d'autistes...",    img: "assets/photos/4_29-01-2026_autisme.jpeg" },
    { date: "28 d'Abril de 2026",caption: "I amb molts fotones...",             img: "assets/photos/5_28-04-2026_foton.jpeg" },
    { date: "2 de Maig de 2026",caption: "El nostre segon viatge, a Lloret",             img: "assets/photos/6_02-05-2026_lloret.jpeg" },
    { date: "21 d'Abril de 2026",caption: "Aquests súper dibuixos pre san valentín",             img: "assets/photos/7_21-04-2026_sanvalentin.jpeg" },
  ],

  // --- TRIVIA (Día 5) ---
  TRIVIA: [
  {
    q: "Quina peli vam veure la primera vegada que ens vam veure?",
    options: ["Los Goonies", "Expediente Warren", "IT 2"],
    a: 1  // índice de la opción correcta (0 = "La Pepita")
  },
  {
    q: "Quin és el meu menjar preferit?",
    options: ["Lasaña", "Arròs amb tomàquet", "Espaguetis a la Carbonara"],
    a: 2
  },
  {
    q: "Quan vam quedar per primer cop?",
    options: ["21 Sept", "28 Sept", "20 Sept"],
    a: 0  // "Barcelona"
  },
  {
    q: "A quina disco ens vam conéixer?",
    options: ["Wolf", "Legendfest", "Carlos Kirk Music"],
    a: 0  // "Pasta carbonara"
  },
  {
    q: "Quina és la meva sèrie preferida?",
    options: ["Vis a Vis", "The Boys", "Prison Break", "La Casa de Papel"],
    a: 2  // "30"
  },
],
};

// ⚠️ SOLO PARA PRUEBAS — pon null antes de dárselo a Clara
CONFIG.DEBUG_PHASE = null; // 1 = Fase 1, 2 = Fase 2, null = comportamiento real