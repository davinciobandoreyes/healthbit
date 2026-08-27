// High-fidelity SVG Data URLs with realistic embedded photography for specimen ID documents

export const SAMPLE_FRONT_ID_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 856 540" width="856" height="540">
  <defs>
    <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fcfdfd" />
      <stop offset="60%" stop-color="#f1f5f9" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
    <linearGradient id="topBand" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0f2b5c" />
      <stop offset="50%" stop-color="#1d4ed8" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>
    <linearGradient id="goldChip" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="40%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <pattern id="microprint" width="60" height="24" patternUnits="userSpaceOnUse">
      <text x="0" y="10" font-family="sans-serif" font-size="5" fill="#94a3b8" opacity="0.35" letter-spacing="1">RETHUS • MINSALUD • COLOMBIA •</text>
      <text x="10" y="20" font-family="sans-serif" font-size="5" fill="#94a3b8" opacity="0.35" letter-spacing="1">COLMEDICOS • REGISTRO MEDICO •</text>
    </pattern>
    <clipPath id="photoRounded">
      <rect x="46" y="176" width="216" height="276" rx="14" />
    </clipPath>
  </defs>

  <!-- Base Card -->
  <rect width="856" height="540" rx="24" fill="url(#cardBg)" stroke="#cbd5e1" stroke-width="2.5"/>
  <rect width="856" height="540" rx="24" fill="url(#microprint)"/>

  <!-- Top Header Band -->
  <path d="M 0 24 A 24 24 0 0 1 24 0 L 832 0 A 24 24 0 0 1 856 24 L 856 86 L 0 86 Z" fill="url(#topBand)"/>
  
  <text x="44" y="38" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="18" fill="#ffffff" letter-spacing="2">REPÚBLICA DE COLOMBIA</text>
  <text x="44" y="66" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="13" fill="#93c5fd" letter-spacing="2.5">TARJETA DE IDENTIFICACIÓN MÉDICA NACIONAL</text>

  <!-- Security Hologram Badge -->
  <circle cx="794" cy="43" r="22" fill="#38bdf8" opacity="0.25"/>
  <circle cx="794" cy="43" r="16" fill="none" stroke="#ffffff" stroke-width="1.8"/>
  <text x="794" y="47" font-family="sans-serif" font-weight="800" font-size="9" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">RETHUS</text>

  <!-- Smart Security Chip -->
  <rect x="46" y="106" width="68" height="52" rx="8" fill="url(#goldChip)" stroke="#92400e" stroke-width="1.5"/>
  <path d="M 46 132 H 114 M 80 106 V 158 M 62 106 V 158 M 98 106 V 158" stroke="#78350f" stroke-width="1" opacity="0.7"/>

  <!-- Real Doctor Photography (Cliped & Framed) -->
  <rect x="43" y="173" width="222" height="282" rx="16" fill="#cbd5e1" stroke="#3b82f6" stroke-width="3"/>
  <image href="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&amp;fit=crop&amp;q=80&amp;w=500" x="46" y="176" width="216" height="276" preserveAspectRatio="xMidYMid slice" clip-path="url(#photoRounded)"/>
  
  <!-- Security Holographic Seal on photo -->
  <circle cx="230" cy="420" r="22" fill="#0284c7" opacity="0.45"/>
  <circle cx="230" cy="420" r="18" fill="none" stroke="#e0f2fe" stroke-width="1.5" stroke-dasharray="4 2"/>
  <text x="230" y="424" font-family="sans-serif" font-weight="900" font-size="8" fill="#ffffff" text-anchor="middle">VERIFICADO</text>

  <!-- Doctor Identification Details -->
  <g transform="translate(296, 0)">
    <!-- ID Number -->
    <text x="0" y="126" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="#64748b" letter-spacing="1.5">NÚMERO DE CÉDULA / DNI</text>
    <text x="0" y="158" font-family="ui-monospace, monospace" font-weight="900" font-size="28" fill="#0f172a" letter-spacing="1">1.020.485.912</text>

    <!-- Full Name -->
    <text x="0" y="200" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="#64748b" letter-spacing="1.5">APELLIDOS Y NOMBRES</text>
    <text x="0" y="226" font-family="system-ui, sans-serif" font-weight="900" font-size="20" fill="#0f172a">RESTREPO GÓMEZ</text>
    <text x="0" y="250" font-family="system-ui, sans-serif" font-weight="800" font-size="18" fill="#1e293b">MARÍA CAMILA</text>

    <!-- Specialty -->
    <text x="0" y="294" font-family="system-ui, sans-serif" font-weight="800" font-size="11" fill="#64748b" letter-spacing="1.5">PROFESIÓN &amp; ESPECIALIDAD</text>
    <text x="0" y="318" font-family="system-ui, sans-serif" font-weight="800" font-size="16" fill="#1d4ed8">MÉDICA CIRUJANA PLÁSTICA Y RECONSTRUCTIVA</text>

    <!-- Additional Metadata Grid -->
    <g transform="translate(0, 360)">
      <text x="0" y="0" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#64748b" letter-spacing="1">REGISTRO RETHUS</text>
      <text x="0" y="20" font-family="ui-monospace, monospace" font-weight="700" font-size="14" fill="#0f172a">RTH-2021-89412</text>

      <text x="170" y="0" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#64748b" letter-spacing="1">FECHA NACIMIENTO</text>
      <text x="170" y="20" font-family="system-ui, sans-serif" font-weight="700" font-size="14" fill="#0f172a">14 MAY 1990</text>

      <text x="340" y="0" font-family="system-ui, sans-serif" font-weight="800" font-size="10" fill="#64748b" letter-spacing="1">SEXO / RH</text>
      <text x="340" y="20" font-family="system-ui, sans-serif" font-weight="700" font-size="14" fill="#0f172a">F / O+</text>
    </g>

    <!-- Security Thumbprint Graphic -->
    <g transform="translate(440, 370)" opacity="0.3">
      <path d="M 25 0 A 25 25 0 0 1 50 25 A 25 25 0 0 1 25 50 A 25 25 0 0 1 0 25 A 25 25 0 0 1 25 0 Z M 25 8 A 17 17 0 0 1 42 25 M 25 15 A 10 10 0 0 1 35 25 M 25 20 A 5 5 0 0 1 30 25" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
    </g>
  </g>

  <!-- Bottom Accent Stripe -->
  <rect x="0" y="524" width="856" height="16" fill="#1d4ed8"/>
</svg>
`)}`;

export const SAMPLE_BACK_ID_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 856 540" width="856" height="540">
  <defs>
    <linearGradient id="cardBgBack" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
  </defs>

  <!-- Base Card -->
  <rect width="856" height="540" rx="24" fill="url(#cardBgBack)" stroke="#cbd5e1" stroke-width="2.5"/>

  <!-- Magnetic Security Stripe -->
  <rect x="0" y="36" width="856" height="76" fill="#0f172a"/>

  <!-- Metadata Information -->
  <g transform="translate(48, 150)">
    <text x="0" y="0" font-family="sans-serif" font-weight="700" font-size="11" fill="#64748b">FECHA DE EXPEDICIÓN</text>
    <text x="0" y="22" font-family="sans-serif" font-weight="800" font-size="15" fill="#0f172a">18 MAY 2012</text>

    <text x="210" y="0" font-family="sans-serif" font-weight="700" font-size="11" fill="#64748b">LUGAR DE EXPEDICIÓN</text>
    <text x="210" y="22" font-family="sans-serif" font-weight="800" font-size="15" fill="#0f172a">BOGOTÁ D.C. - COLOMBIA</text>

    <text x="500" y="0" font-family="sans-serif" font-weight="700" font-size="11" fill="#64748b">ESTATURA / GRUPO SANGUÍNEO</text>
    <text x="500" y="22" font-family="sans-serif" font-weight="800" font-size="15" fill="#0f172a">1.68 M / O POSITIVO</text>
  </g>

  <!-- Doctor Signature Box -->
  <rect x="48" y="206" width="350" height="72" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="58" y="224" font-family="sans-serif" font-size="9" fill="#94a3b8" font-weight="700">FIRMA DEL TITULAR MÉDICO</text>
  <!-- Real Cursive Signature Path -->
  <path d="M 75 258 C 100 230, 130 270, 160 240 C 190 220, 210 265, 240 245 C 270 230, 310 260, 345 240" fill="none" stroke="#1e3a8a" stroke-width="2.5" stroke-linecap="round"/>

  <!-- Official Authority Stamp Box -->
  <rect x="428" y="206" width="380" height="72" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="438" y="224" font-family="sans-serif" font-size="9" fill="#94a3b8" font-weight="700">AUTORIZACIÓN COLEGIO MÉDICO / MINSALUD</text>
  <text x="438" y="252" font-family="sans-serif" font-weight="700" font-size="13" fill="#1e293b">REGISTRO RETHUS ACTIVO - COD. RTH-2021</text>

  <!-- PDF417 2D Barcode Block -->
  <rect x="48" y="306" width="760" height="154" rx="10" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
  <g fill="#0f172a">
    <rect x="68" y="322" width="12" height="122"/>
    <rect x="84" y="322" width="6" height="122"/>
    <rect x="94" y="322" width="18" height="122"/>
    <rect x="118" y="322" width="8" height="122"/>
    <rect x="132" y="322" width="22" height="122"/>
    <rect x="160" y="322" width="10" height="122"/>
    <rect x="176" y="322" width="14" height="122"/>
    <rect x="196" y="322" width="8" height="122"/>
    <rect x="208" y="322" width="26" height="122"/>
    <rect x="240" y="322" width="12" height="122"/>
    <rect x="258" y="322" width="16" height="122"/>
    <rect x="280" y="322" width="8" height="122"/>
    <rect x="294" y="322" width="20" height="122"/>
    <rect x="320" y="322" width="14" height="122"/>
    <rect x="340" y="322" width="10" height="122"/>
    <rect x="356" y="322" width="24" height="122"/>
    <rect x="386" y="322" width="8" height="122"/>
    <rect x="400" y="322" width="18" height="122"/>
    <rect x="424" y="322" width="12" height="122"/>
    <rect x="442" y="322" width="28" height="122"/>
    <rect x="476" y="322" width="10" height="122"/>
    <rect x="492" y="322" width="16" height="122"/>
    <rect x="514" y="322" width="8" height="122"/>
    <rect x="528" y="322" width="22" height="122"/>
    <rect x="556" y="322" width="14" height="122"/>
    <rect x="576" y="322" width="10" height="122"/>
    <rect x="592" y="322" width="26" height="122"/>
    <rect x="624" y="322" width="8" height="122"/>
    <rect x="638" y="322" width="18" height="122"/>
    <rect x="662" y="322" width="12" height="122"/>
    <rect x="680" y="322" width="24" height="122"/>
    <rect x="710" y="322" width="10" height="122"/>
    <rect x="726" y="322" width="16" height="122"/>
    <rect x="748" y="322" width="8" height="122"/>
    <rect x="762" y="322" width="26" height="122"/>
  </g>

  <!-- Bottom Accent Stripe -->
  <rect x="0" y="524" width="856" height="16" fill="#1d4ed8"/>
</svg>
`)}`;
