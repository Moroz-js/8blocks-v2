const c = {
  purple: '#a78bfa',
  green: '#4ade80',
  red: '#f87171',
  blue: '#60a5fa',
  orange: '#fb923c',
  w: 'rgba(255,255,255,0.9)',
  w6: 'rgba(255,255,255,0.6)',
  w3: 'rgba(255,255,255,0.3)',
  w15: 'rgba(255,255,255,0.15)',
  w08: 'rgba(255,255,255,0.08)',
  w04: 'rgba(255,255,255,0.04)',
}

// ─── Tokenomics ───────────────────────────────────────────────────────────────

export const IconDisconnectedTokenProduct = () => (
  <svg viewBox="0 0 400 180" fill="none">
    {/* Product card */}
    <g>
      <rect x="40" y="16" width="120" height="110" rx="14" fill={c.w04} stroke={c.w3} strokeWidth="1.3" />
      <rect x="58" y="36" width="68" height="7" rx="3.5" fill={c.w6} />
      <rect x="58" y="50" width="52" height="5" rx="2.5" fill={c.w3} />
      <rect x="58" y="62" width="58" height="5" rx="2.5" fill="rgba(255,255,255,0.2)" />
      <rect x="58" y="84" width="52" height="24" rx="7" fill={c.purple} />
      <text x="84" y="100" textAnchor="middle" fill="white" fontSize="12" fontFamily="system-ui" fontWeight="600">Buy</text>
      <text x="100" y="150" textAnchor="middle" fill={c.w3} fontSize="13" fontFamily="system-ui" fontWeight="500">Product</text>
    </g>

    {/* Dashed line + X */}
    <line x1="170" y1="71" x2="192" y2="71" stroke={c.w3} strokeWidth="1.5" strokeDasharray="5 4" />
    <g transform="translate(200, 71)">
      <line x1="-6" y1="-6" x2="6" y2="6" stroke={c.red} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="6" y1="-6" x2="-6" y2="6" stroke={c.red} strokeWidth="2.5" strokeLinecap="round" />
    </g>
    <line x1="208" y1="71" x2="230" y2="71" stroke={c.w3} strokeWidth="1.5" strokeDasharray="5 4" />

    {/* Bitcoin-style token coin */}
    <g transform="translate(300, 68)">
      <circle cx="0" cy="0" r="46" fill="rgba(251,146,60,0.08)" stroke={c.orange} strokeWidth="1.8" strokeOpacity="0.5" />
      <circle cx="0" cy="0" r="36" fill="rgba(251,146,60,0.12)" stroke={c.orange} strokeWidth="1.2" strokeOpacity="0.35" />
      <text x="0" y="1" textAnchor="middle" dominantBaseline="central" fill={c.orange} fontSize="42" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700">&#x20BF;</text>
    </g>
    <text x="300" y="150" textAnchor="middle" fill={c.w3} fontSize="13" fontFamily="system-ui" fontWeight="500">Token</text>
  </svg>
)

export const IconFadingPulse = () => (
  <svg viewBox="0 0 220 200" fill="none">
    <line x1="20" y1="155" x2="200" y2="155" stroke={c.w15} strokeWidth="0.8" />
    <line x1="20" y1="120" x2="200" y2="120" stroke={c.w08} strokeWidth="0.6" strokeDasharray="3 4" />
    <line x1="20" y1="85" x2="200" y2="85" stroke={c.w08} strokeWidth="0.6" strokeDasharray="3 4" />
    <line x1="20" y1="50" x2="200" y2="50" stroke={c.w08} strokeWidth="0.6" strokeDasharray="3 4" />

    <path d="M 24 130 C 55 125, 80 110, 105 95 C 130 80, 155 65, 180 48 L 198 38" stroke={c.green} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <circle cx="198" cy="38" r="5" fill={c.green} />

    <path d="M 24 75 C 55 82, 80 100, 105 115 C 130 128, 155 140, 180 147 L 198 150" stroke={c.red} strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <circle cx="198" cy="150" r="5" fill={c.red} />

    <circle cx="148" cy="172" r="3.5" fill={c.green} />
    <text x="156" y="176" fill={c.w} fontSize="10" fontFamily="system-ui" fontWeight="500">Revenue</text>
    <circle cx="148" cy="186" r="3.5" fill={c.red} />
    <text x="156" y="190" fill={c.w} fontSize="10" fontFamily="system-ui" fontWeight="500">Token price</text>
  </svg>
)

export const IconOpenVault = () => (
  <svg viewBox="0 0 220 180" fill="none">
    <line x1="16" y1="155" x2="204" y2="155" stroke={c.w15} strokeWidth="0.8" />

    <line x1="72" y1="22" x2="72" y2="155" stroke={c.w15} strokeWidth="0.8" strokeDasharray="4 3" />
    <line x1="108" y1="22" x2="108" y2="155" stroke={c.w15} strokeWidth="0.8" strokeDasharray="4 3" />
    <text x="68" y="16" textAnchor="middle" fill={c.w3} fontSize="10" fontFamily="system-ui" fontWeight="500">TGE</text>
    <text x="114" y="16" textAnchor="middle" fill={c.w3} fontSize="10" fontFamily="system-ui" fontWeight="500">Unlock</text>

    <defs>
      <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={c.red} stopOpacity="0.3" />
        <stop offset="100%" stopColor={c.red} stopOpacity="0.02" />
      </linearGradient>
    </defs>
    <path
      d="M 24 142 C 38 138, 54 132, 64 124 C 70 118, 74 104, 78 82 C 82 60, 90 38, 100 34 C 110 30, 116 50, 122 80 C 130 116, 145 140, 162 146 C 175 150, 188 152, 200 154 L 200 155 L 24 155 Z"
      fill="url(#cg)"
    />
    <path
      d="M 24 142 C 38 138, 54 132, 64 124 C 70 118, 74 104, 78 82 C 82 60, 90 38, 100 34 C 110 30, 116 50, 122 80 C 130 116, 145 140, 162 146 C 175 150, 188 152, 200 154"
      stroke={c.red} strokeWidth="2.2" strokeLinecap="round" fill="none"
    />

    <text data-anim="pulse-text" x="172" y="112" textAnchor="middle" fill={c.red} fontSize="22" fontFamily="system-ui" fontWeight="700">-82%</text>
  </svg>
)

export const IconHollowToken = () => (
  <svg viewBox="0 0 440 160" fill="none">
    <rect x="24" y="24" width="10" height="10" rx="2.5" fill={c.purple} />
    <text x="40" y="33" fill={c.w} fontSize="12" fontFamily="system-ui" fontWeight="400">Team 20%</text>
    <rect x="24" y="44" width="10" height="10" rx="2.5" fill={c.green} />
    <text x="40" y="53" fill={c.w} fontSize="12" fontFamily="system-ui" fontWeight="400">Investors 25%</text>
    <rect x="24" y="64" width="10" height="10" rx="2.5" fill={c.blue} />
    <text x="40" y="73" fill={c.w} fontSize="12" fontFamily="system-ui" fontWeight="400">Community 40%</text>
    <rect x="24" y="84" width="10" height="10" rx="2.5" fill={c.orange} />
    <text x="40" y="93" fill={c.w} fontSize="12" fontFamily="system-ui" fontWeight="400">Treasury 15%</text>

    <g transform="translate(320, 80)">
      <path d="M 0 0 L 60 0 A 60 60 0 0 1 -18.5 57.1 Z" fill={c.blue} fillOpacity="0.8" />
      <path d="M 0 0 L -18.5 57.1 A 60 60 0 0 1 -60 0 Z" fill={c.green} fillOpacity="0.8" />
      <path d="M 0 0 L -60 0 A 60 60 0 0 1 -18.5 -57.1 Z" fill={c.purple} fillOpacity="0.8" />
      <path d="M 0 0 L -18.5 -57.1 A 60 60 0 0 1 60 0 Z" fill={c.orange} fillOpacity="0.8" />
    </g>

    <g transform="translate(320, 80)">
      <line x1="-28" y1="-28" x2="28" y2="28" stroke={c.red} strokeWidth="3.5" strokeLinecap="round" opacity="0.65" />
      <line x1="28" y1="-28" x2="-28" y2="28" stroke={c.red} strokeWidth="3.5" strokeLinecap="round" opacity="0.65" />
    </g>
  </svg>
)

// ─── Consulting ───────────────────────────────────────────────────────────────

export const IconRouteFork = () => (
  <svg viewBox="0 0 96 96" fill="none">
    <circle cx="48" cy="50" r="9" fill={c.w04} stroke={c.purple} strokeWidth="1.5" />
    <circle cx="48" cy="50" r="3.5" fill={c.purple} fillOpacity="0.7" />

    <path d="M 40 45 C 28 34, 18 26, 14 18" stroke={c.w6} strokeWidth="1.4" strokeLinecap="round" fill="none" />
    <path d="M 48 41 C 48 30, 48 22, 48 14" stroke={c.w6} strokeWidth="1.4" strokeLinecap="round" fill="none" />
    <path d="M 56 45 C 68 34, 78 26, 82 18" stroke={c.w6} strokeWidth="1.4" strokeLinecap="round" fill="none" />

    <g>
      <circle cx="14" cy="16" r="5" fill={c.w04} stroke={c.w3} strokeWidth="1.3" />
      <text x="14" y="19.5" textAnchor="middle" fill={c.w3} fontSize="8" fontFamily="system-ui" fontWeight="600">?</text>
    </g>
    <g>
      <circle cx="48" cy="12" r="5" fill={c.w04} stroke={c.w3} strokeWidth="1.3" />
      <text x="48" y="15.5" textAnchor="middle" fill={c.w3} fontSize="8" fontFamily="system-ui" fontWeight="600">?</text>
    </g>
    <g>
      <circle cx="82" cy="16" r="5" fill={c.w04} stroke={c.w3} strokeWidth="1.3" />
      <text x="82" y="19.5" textAnchor="middle" fill={c.w3} fontSize="8" fontFamily="system-ui" fontWeight="600">?</text>
    </g>

    <line x1="48" y1="59" x2="48" y2="82" stroke={c.w6} strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="48" cy="84" r="3" fill={c.purple} fillOpacity="0.4" />
  </svg>
)

export const IconBrokenSignal = () => (
  <svg viewBox="0 0 96 96" fill="none">
    <rect x="10" y="62" width="12" height="22" rx="2.5" fill={c.purple} fillOpacity="0.85" />
    <rect x="26" y="48" width="12" height="36" rx="2.5" fill={c.purple} fillOpacity="0.65" />
    <rect x="42" y="34" width="12" height="50" rx="2.5" fill={c.purple} fillOpacity="0.4" />
    <rect x="58" y="20" width="12" height="64" rx="2.5" fill={c.w04} stroke={c.w3} strokeWidth="1" strokeDasharray="4 3" />
    <rect x="74" y="8" width="12" height="76" rx="2.5" fill={c.w04} stroke={c.w15} strokeWidth="1" strokeDasharray="4 3" />

    <g transform="translate(84, 14)">
      <line x1="-4" y1="-4" x2="4" y2="4" stroke={c.red} strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="-4" x2="-4" y2="4" stroke={c.red} strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
)

export const IconDisconnectedNodes = () => (
  <svg viewBox="0 0 96 96" fill="none">
    <circle cx="48" cy="48" r="11" fill={c.w04} stroke={c.purple} strokeWidth="1.5" />
    <circle cx="48" cy="48" r="4" fill={c.purple} fillOpacity="0.6" />

    <circle cx="16" cy="20" r="7" fill={c.w04} stroke={c.w6} strokeWidth="1.3" />
    <circle cx="80" cy="20" r="7" fill={c.w04} stroke={c.w6} strokeWidth="1.3" />
    <circle cx="16" cy="76" r="7" fill={c.w04} stroke={c.w6} strokeWidth="1.3" />
    <g>
      <circle cx="80" cy="76" r="7" fill={c.w04} stroke={c.red} strokeWidth="1.3" strokeOpacity="0.5" strokeDasharray="4 3" />
    </g>

    <line x1="22" y1="25" x2="40" y2="41" stroke={c.w3} strokeWidth="1.3" />
    <line x1="74" y1="25" x2="56" y2="41" stroke={c.w3} strokeWidth="1.3" />
    <line x1="22" y1="71" x2="40" y2="55" stroke={c.w3} strokeWidth="1.3" />
    <line x1="74" y1="71" x2="56" y2="55" stroke={c.red} strokeWidth="1.3" strokeOpacity="0.3" strokeDasharray="4 3" />
  </svg>
)

export const IconFragmentedChecklist = () => (
  <svg viewBox="0 0 96 96" fill="none">
    <rect x="12" y="10" width="16" height="16" rx="4" fill={c.w04} stroke={c.green} strokeWidth="1.3" strokeOpacity="0.7" />
    <path d="M16 18 L20 22 L26 14" stroke={c.green} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="34" y="16" width="48" height="4" rx="2" fill={c.w3} />

    <rect x="12" y="34" width="16" height="16" rx="4" fill={c.w04} stroke={c.green} strokeWidth="1.3" strokeOpacity="0.7" />
    <path d="M16 42 L20 46 L26 38" stroke={c.green} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="34" y="40" width="38" height="4" rx="2" fill="rgba(255,255,255,0.22)" />

    <rect x="12" y="58" width="16" height="16" rx="4" fill={c.w04} stroke={c.w3} strokeWidth="1.3" />
    <rect x="34" y="64" width="30" height="4" rx="2" fill={c.w15} />

    <g>
      <rect x="20" y="82" width="16" height="14" rx="4" fill="rgba(255,255,255,0.02)" stroke={c.red} strokeWidth="1.3" strokeOpacity="0.4" strokeDasharray="3 3" />
      <rect x="42" y="87" width="34" height="4" rx="2" fill={c.w08} />
    </g>
  </svg>
)

// ─── Audit ────────────────────────────────────────────────────────────────────

export const IconTiltedScale = () => (
  <svg viewBox="0 0 96 96" fill="none">
    <line x1="48" y1="22" x2="48" y2="78" stroke={c.w6} strokeWidth="1.5" strokeLinecap="round" />
    <rect x="35" y="76" width="26" height="4" rx="2" fill={c.w15} />
    <path d="M 42 30 L 48 22 L 54 30" stroke={c.w6} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

    <g>
      <line x1="12" y1="36" x2="84" y2="52" stroke={c.w6} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="36" x2="12" y2="48" stroke={c.w3} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M 2 48 Q 12 56 22 48" stroke={c.green} strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.6" />
      <line x1="84" y1="52" x2="84" y2="64" stroke={c.w3} strokeWidth="1.3" strokeLinecap="round" />
      <path d="M 74 64 Q 84 72 94 64" stroke={c.red} strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.7" />
      <rect x="78" y="55" width="12" height="7" rx="2" fill={c.red} fillOpacity="0.2" stroke={c.red} strokeWidth="0.8" strokeOpacity="0.4" />
    </g>
  </svg>
)

export const IconBrokenGrowth = () => (
  <svg viewBox="0 0 96 96" fill="none">
    <line x1="12" y1="82" x2="86" y2="82" stroke={c.w15} strokeWidth="1" />
    <line x1="12" y1="82" x2="12" y2="12" stroke={c.w15} strokeWidth="1" />
    <line x1="12" y1="62" x2="86" y2="62" stroke={c.w08} strokeWidth="0.6" strokeDasharray="3 4" />
    <line x1="12" y1="42" x2="86" y2="42" stroke={c.w08} strokeWidth="0.6" strokeDasharray="3 4" />

    <path d="M 16 76 C 28 68, 38 55, 46 42 C 50 34, 52 26, 54 20" stroke={c.green} strokeWidth="2" strokeLinecap="round" fill="none" />
    <circle cx="54" cy="20" r="4" fill={c.green} fillOpacity="0.8" />

    <path d="M 54 20 C 58 32, 62 50, 68 60 C 74 70, 78 76, 84 78" stroke={c.red} strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3" fill="none" />
    <g>
      <path d="M 72 58 L 76 68 L 66 66 Z" fill={c.red} fillOpacity="0.5" />
    </g>
  </svg>
)

export const IconObscuredShield = () => (
  <svg viewBox="0 0 96 96" fill="none">
    <path
      d="M 48 8 L 80 22 L 80 50 C 80 66 66 78 48 84 C 30 78 16 66 16 50 L 16 22 Z"
      fill={c.w04} stroke={c.w6} strokeWidth="1.5" strokeOpacity="0.5" strokeLinejoin="round"
    />
    <rect x="30" y="34" width="36" height="4" rx="2" fill={c.w3} />
    <rect x="30" y="44" width="28" height="4" rx="2" fill="rgba(255,255,255,0.18)" />
    <rect x="30" y="54" width="22" height="4" rx="2" fill={c.w08} />

    <g transform="translate(62, 62)">
      <path d="M 0 -10 L 10 7 L -10 7 Z" fill={c.orange} fillOpacity="0.2" stroke={c.orange} strokeWidth="1.3" strokeLinejoin="round" />
      <text x="0" y="4" textAnchor="middle" fill={c.orange} fontSize="11" fontFamily="system-ui" fontWeight="700">!</text>
    </g>
  </svg>
)

export const IconRadarPing = () => (
  <svg viewBox="0 0 96 96" fill="none">
    <circle cx="42" cy="52" r="38" stroke={c.w6} strokeWidth="0.7" strokeOpacity="0.1" />
    <circle cx="42" cy="52" r="28" stroke={c.w6} strokeWidth="0.8" strokeOpacity="0.15" />
    <circle cx="42" cy="52" r="18" stroke={c.w6} strokeWidth="1" strokeOpacity="0.25" />
    <circle cx="42" cy="52" r="8" stroke={c.w6} strokeWidth="1" strokeOpacity="0.4" />
    <circle cx="42" cy="52" r="3" fill={c.purple} fillOpacity="0.8" />

    <line x1="42" y1="12" x2="42" y2="92" stroke={c.w6} strokeWidth="0.5" strokeOpacity="0.08" />
    <line x1="2" y1="52" x2="82" y2="52" stroke={c.w6} strokeWidth="0.5" strokeOpacity="0.08" />

    <g>
      <line x1="42" y1="52" x2="74" y2="24" stroke={c.purple} strokeWidth="1.3" strokeOpacity="0.3" strokeLinecap="round" />
    </g>

    <g>
      <circle cx="78" cy="20" r="6" fill={c.red} fillOpacity="0.8" />
      <circle cx="78" cy="20" r="10" stroke={c.red} strokeWidth="1" strokeOpacity="0.3" fill="none" />
      <circle cx="78" cy="20" r="15" stroke={c.red} strokeWidth="0.8" strokeOpacity="0.15" fill="none" />
    </g>
  </svg>
)
