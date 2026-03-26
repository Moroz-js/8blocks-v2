const c = {
  purple: '#C53DFF',
  purpleDim: 'rgba(197,61,255,0.85)',
  purpleBg: '#1E1B24',
  purpleDark: '#49185E',
  green: '#34a853',
  greenMid: '#1f6a33',
  greenDark: '#13381d',
  greenDim: 'rgba(74,222,128,0.5)',
  greenBg: 'rgba(74,222,128,0.08)',
  red: '#FB3737',
  redDim: 'rgba(248,113,113,0.5)',
  redBg: 'rgba(248,113,113,0.08)',
  redBorder: '#662020',
  orange: '#fb923c',
  orangeDim: 'rgba(251,147,60,0.5)',
  orangeBg: 'rgba(251,147,60,0.08)',
  blue: '#60a5fa',
  w: 'rgba(255,255,255,0.85)',
  w5: 'rgba(255,255,255,0.5)',
  w3: 'rgba(255,255,255,0.3)',
  w15: 'rgba(255,255,255,0.15)',
  w08: 'rgba(255,255,255,0.08)',
  w04: 'rgba(255,255,255,0.04)',
  cardBg: '#1E1B24',
  cardStroke: '#383838',
  lineColor: '#262626',
  questionMark: '#656565',
}

// ─── Consulting ───────────────────────────────────────────────────────────────

export const IconRouteFork = () => (
  <svg viewBox="0 0 323 228" fill="none">
    {/* Branch lines */}
    <rect x="159" y="49" width="4" height="64" fill={c.lineColor} />
    <rect x="76.2" y="51.03" width="4" height="99.07" transform="rotate(-45 76.2 51.03)" fill={c.lineColor} />
    <rect x="243.12" y="49.14" width="4" height="97.75" transform="rotate(45 243.12 49.14)" fill={c.lineColor} />
    {/* Bottom stem */}
    <rect x="159" y="153" width="4" height="41" fill={c.purpleDark} />

    {/* Center hub */}
    <circle cx="161" cy="133" r="20" fill={c.purpleBg} />
    <circle cx="161" cy="133" r="19" stroke={c.purple} strokeOpacity="0.85" strokeWidth="2" fill="none" />
    <circle cx="161" cy="133" r="9" fill={c.purple} />

    {/* Bottom node */}
    <circle cx="161" cy="206" r="12" fill={c.purpleBg} />
    <circle cx="161" cy="206" r="11" stroke={c.purple} strokeOpacity="0.85" strokeWidth="2" fill="none" />

    {/* Question nodes */}
    <circle cx="63" cy="37" r="19" fill={c.cardBg} stroke={c.cardStroke} strokeWidth="2" />
    <text x="63" y="42" textAnchor="middle" fill={c.questionMark} fontSize="16" fontFamily="system-ui" fontWeight="500">?</text>
    <circle cx="161" cy="29" r="19" fill={c.cardBg} stroke={c.cardStroke} strokeWidth="2" />
    <text x="161" y="34" textAnchor="middle" fill={c.questionMark} fontSize="16" fontFamily="system-ui" fontWeight="500">?</text>
    <circle cx="259" cy="37" r="19" fill={c.cardBg} stroke={c.cardStroke} strokeWidth="2" />
    <text x="259" y="42" textAnchor="middle" fill={c.questionMark} fontSize="16" fontFamily="system-ui" fontWeight="500">?</text>
  </svg>
)

export const IconBrokenSignal = () => (
  <svg viewBox="0 0 323 228" fill="none">
    {/* Green solid bars — ascending */}
    <rect x="52" y="138" width="29" height="48" fill={c.green} />
    <rect x="89" y="110" width="29" height="72" fill={c.greenMid} />
    <rect x="126" y="74" width="29" height="106" fill={c.greenDark} />

    {/* Dashed red-border bars — ghost projections */}
    <rect x="163" y="52" width="29" height="129" fill="none" stroke={c.redBorder} strokeWidth="1.2" strokeDasharray="4.8 4.8" />
    <rect x="200" y="32" width="29" height="149" fill="none" stroke={c.redBorder} strokeWidth="1.2" strokeDasharray="4.8 4.8" />

    {/* Red X mark */}
    <circle cx="240" cy="22" r="12.5" fill={c.red} />
    <path d="M234 16 L246 28 M246 16 L234 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

export const IconDisconnectedNodes = () => (
  <svg viewBox="0 0 323 228" fill="none">
    {/* Diagonal lines connecting corners through center */}
    <rect x="31.95" y="34.78" width="4" height="66.87" transform="rotate(-45 31.95 34.78)" fill={c.lineColor} />
    <rect x="243.12" y="34.78" width="4" height="66.87" transform="rotate(45 243.12 34.78)" fill={c.lineColor} />
    <rect x="31.95" y="148.78" width="4" height="66.87" transform="rotate(-45 31.95 148.78)" fill={c.lineColor} />

    {/* Top-left node */}
    <circle cx="26" cy="28" r="19" fill={c.cardBg} stroke={c.cardStroke} strokeWidth="2" />
    {/* Top-right node */}
    <circle cx="296" cy="28" r="19" fill={c.cardBg} stroke={c.cardStroke} strokeWidth="2" />
    {/* Bottom-left node */}
    <circle cx="26" cy="200" r="19" fill={c.cardBg} stroke={c.cardStroke} strokeWidth="2" />

    {/* Center hub */}
    <circle cx="161" cy="114" r="20" fill={c.purpleBg} />
    <circle cx="161" cy="114" r="19" stroke={c.purple} strokeOpacity="0.85" strokeWidth="2" fill="none" />
    <circle cx="161" cy="114" r="9" fill={c.purple} />

    {/* Disconnected node — bottom right */}
    <line x1="175" y1="128" x2="244" y2="186" stroke={c.lineColor} strokeWidth="4" strokeOpacity="0.3" />
    <circle cx="260" cy="200" r="19" fill="none" stroke={c.redBorder} strokeWidth="2" strokeDasharray="6 4" />
    <circle cx="260" cy="200" r="12" fill="none" stroke={c.redBorder} strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="4 3" />
  </svg>
)

export const IconFragmentedChecklist = () => (
  <svg viewBox="0 0 323 228" fill="none">
    {/* Purple launch node */}
    <circle cx="80" cy="114" r="22" fill={c.purpleBg} />
    <circle cx="80" cy="114" r="21" stroke={c.purple} strokeOpacity="0.85" strokeWidth="2.2" fill="none" />
    <circle cx="80" cy="114" r="10" fill={c.purple} />

    {/* Dashed red trajectory line */}
    <line x1="104" y1="114" x2="185" y2="114" stroke={c.red} strokeWidth="4.5" strokeDasharray="4.5 4.5" />

    {/* Dark purple base block */}
    <rect x="166" y="98" width="29" height="48" fill={c.purpleDark} opacity="0.6" />

    {/* Shattered red fragments */}
    <path d="M195 94 L207 94 L207 94 L219 80 L207 80 L195 94Z" fill={c.red} />
    <path d="M207 78 L218 66 L230 66 L218 78 L207 78Z" fill={c.red} opacity="0.9" />
    <path d="M220 90 L232 78 L244 78 L232 90 L220 90Z" fill={c.red} opacity="0.85" />
    <path d="M210 104 L222 92 L234 92 L222 104 L210 104Z" fill={c.red} opacity="0.75" />
    <path d="M200 118 L212 106 L224 106 L212 118 L200 118Z" fill={c.red} opacity="0.7" />
    <path d="M228 64 L236 56 L244 56 L236 64 L228 64Z" fill={c.red} opacity="0.65" />
    <path d="M238 82 L248 72 L258 72 L248 82 L238 82Z" fill={c.red} opacity="0.6" />
    <path d="M230 100 L240 90 L250 90 L240 100 L230 100Z" fill={c.red} opacity="0.5" />
    <path d="M222 116 L232 106 L242 106 L232 116 L222 116Z" fill={c.red} opacity="0.45" />
    <path d="M214 126 L224 116 L234 116 L224 126 L214 126Z" fill={c.red} opacity="0.35" />
    <path d="M244 60 L250 54 L256 54 L250 60 L244 60Z" fill={c.red} opacity="0.4" />
    <path d="M252 74 L260 66 L268 66 L260 74 L252 74Z" fill={c.red} opacity="0.3" />
  </svg>
)

// ─── Audit ────────────────────────────────────────────────────────────────────

export const IconTiltedScale = () => (
  <svg viewBox="0 0 160 130" fill="none">
    {/* Pillar */}
    <line x1="80" y1="24" x2="80" y2="108" stroke={c.w3} strokeWidth="1.5" strokeLinecap="round" />
    <rect x="60" y="106" width="40" height="6" rx="3" fill={c.w08} />
    <path d="M72 30 L80 22 L88 30" stroke={c.w3} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

    {/* Tilted beam */}
    <line x1="20" y1="46" x2="140" y2="66" stroke={c.w3} strokeWidth="1.5" strokeLinecap="round" />

    {/* Left pan — lighter (up) */}
    <line x1="20" y1="46" x2="20" y2="62" stroke={c.w15} strokeWidth="1.2" strokeLinecap="round" />
    <path d="M8 62 Q20 72 32 62" stroke={c.green} strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.6" />

    {/* Right pan — heavier (down) */}
    <line x1="140" y1="66" x2="140" y2="82" stroke={c.w15} strokeWidth="1.2" strokeLinecap="round" />
    <path d="M128 82 Q140 92 152 82" stroke={c.red} strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.6" />
    <rect x="133" y="72" width="14" height="8" rx="2.5" fill={c.redBg} stroke={c.red} strokeWidth="0.8" strokeOpacity="0.35" />
  </svg>
)

export const IconBrokenGrowth = () => (
  <svg viewBox="0 0 160 130" fill="none">
    {/* Axes */}
    <line x1="20" y1="110" x2="144" y2="110" stroke={c.w08} strokeWidth="0.8" />
    <line x1="20" y1="110" x2="20" y2="16" stroke={c.w08} strokeWidth="0.8" />
    <line x1="20" y1="80" x2="144" y2="80" stroke={c.w04} strokeWidth="0.6" strokeDasharray="3 4" />
    <line x1="20" y1="50" x2="144" y2="50" stroke={c.w04} strokeWidth="0.6" strokeDasharray="3 4" />

    {/* Growth line */}
    <path d="M24 100 C40 92, 54 72, 68 52 C76 40, 82 30, 88 24" stroke={c.green} strokeWidth="2" strokeLinecap="round" fill="none" />
    <circle cx="88" cy="24" r="4" fill={c.green} fillOpacity="0.7" />

    {/* Crash line */}
    <path d="M88 24 C94 40, 102 68, 112 82 C120 92, 130 100, 140 104" stroke={c.red} strokeWidth="2" strokeLinecap="round" strokeDasharray="5 3" fill="none" />

    {/* Drop arrow */}
    <path d="M120 74 L124 84 L114 82 Z" fill={c.red} fillOpacity="0.5" />
  </svg>
)

export const IconObscuredShield = () => (
  <svg viewBox="0 0 160 130" fill="none">
    {/* Shield */}
    <path
      d="M80 12 L126 30 L126 66 C126 86 106 102 80 112 C54 102 34 86 34 66 L34 30 Z"
      fill={c.w04} stroke={c.w3} strokeWidth="1.3" strokeLinejoin="round"
    />
    {/* Shield content lines */}
    <rect x="54" y="46" width="52" height="5" rx="2.5" fill={c.w15} />
    <rect x="54" y="58" width="40" height="5" rx="2.5" fill={c.w08} />
    <rect x="54" y="70" width="32" height="5" rx="2.5" fill={c.w04} />

    {/* Warning triangle */}
    <g transform="translate(112, 90)">
      <path d="M0 -14 L12 8 L-12 8 Z" fill={c.orangeBg} stroke={c.orange} strokeWidth="1.3" strokeLinejoin="round" />
      <text x="0" y="4" textAnchor="middle" fill={c.orange} fontSize="13" fontFamily="system-ui" fontWeight="700">!</text>
    </g>
  </svg>
)

export const IconRadarPing = () => (
  <svg viewBox="0 0 160 130" fill="none">
    {/* Radar rings */}
    <circle cx="72" cy="68" r="50" stroke={c.w08} strokeWidth="0.7" />
    <circle cx="72" cy="68" r="36" stroke={c.w08} strokeWidth="0.8" />
    <circle cx="72" cy="68" r="22" stroke={c.w15} strokeWidth="0.9" />
    <circle cx="72" cy="68" r="8" stroke={c.w15} strokeWidth="1" />

    {/* Cross lines */}
    <line x1="72" y1="16" x2="72" y2="120" stroke={c.w04} strokeWidth="0.5" />
    <line x1="20" y1="68" x2="124" y2="68" stroke={c.w04} strokeWidth="0.5" />

    {/* Center dot */}
    <circle cx="72" cy="68" r="3" fill={c.purple} fillOpacity="0.7" />

    {/* Sweep line */}
    <line x1="72" y1="68" x2="116" y2="34" stroke={c.purple} strokeWidth="1.2" strokeOpacity="0.3" strokeLinecap="round" />

    {/* Alert ping */}
    <circle cx="120" cy="30" r="7" fill={c.red} fillOpacity="0.7" />
    <circle cx="120" cy="30" r="12" stroke={c.red} strokeWidth="1" strokeOpacity="0.3" fill="none" />
    <circle cx="120" cy="30" r="18" stroke={c.red} strokeWidth="0.7" strokeOpacity="0.12" fill="none" />
  </svg>
)

// ─── Tokenomics ───────────────────────────────────────────────────────────────

export const IconDisconnectedTokenProduct = () => (
  <svg viewBox="0 0 260 130" fill="none">
    {/* Product card */}
    <rect x="16" y="16" width="88" height="98" rx="10" fill={c.cardBg} stroke={c.cardStroke} strokeWidth="1" />
    <rect x="28" y="32" width="52" height="5" rx="2.5" fill={c.w3} />
    <rect x="28" y="44" width="40" height="4" rx="2" fill={c.w15} />
    <rect x="28" y="54" width="46" height="4" rx="2" fill={c.w08} />
    <rect x="28" y="72" width="40" height="20" rx="6" fill={c.purple} fillOpacity="0.6" />
    <text x="48" y="86" textAnchor="middle" fill="white" fontSize="10" fontFamily="system-ui" fontWeight="600">Buy</text>
    <text x="60" y="126" textAnchor="middle" fill={c.w3} fontSize="11" fontFamily="system-ui">Product</text>

    {/* Dashed line + X */}
    <line x1="112" y1="65" x2="128" y2="65" stroke={c.w15} strokeWidth="1.3" strokeDasharray="4 3" />
    <g transform="translate(136, 65)">
      <line x1="-5" y1="-5" x2="5" y2="5" stroke={c.red} strokeWidth="2" strokeLinecap="round" />
      <line x1="5" y1="-5" x2="-5" y2="5" stroke={c.red} strokeWidth="2" strokeLinecap="round" />
    </g>
    <line x1="144" y1="65" x2="160" y2="65" stroke={c.w15} strokeWidth="1.3" strokeDasharray="4 3" />

    {/* Token coin */}
    <circle cx="200" cy="62" r="36" fill={c.orangeBg} stroke={c.orange} strokeWidth="1.3" strokeOpacity="0.4" />
    <circle cx="200" cy="62" r="26" fill="rgba(251,147,60,0.06)" stroke={c.orange} strokeWidth="0.8" strokeOpacity="0.25" />
    <text x="200" y="64" textAnchor="middle" dominantBaseline="central" fill={c.orange} fontSize="30" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700">&#x20BF;</text>
    <text x="200" y="126" textAnchor="middle" fill={c.w3} fontSize="11" fontFamily="system-ui">Token</text>
  </svg>
)

export const IconFadingPulse = () => (
  <svg viewBox="0 0 160 130" fill="none">
    {/* Grid */}
    <line x1="20" y1="110" x2="144" y2="110" stroke={c.w08} strokeWidth="0.8" />
    <line x1="20" y1="80" x2="144" y2="80" stroke={c.w04} strokeWidth="0.6" strokeDasharray="3 4" />
    <line x1="20" y1="50" x2="144" y2="50" stroke={c.w04} strokeWidth="0.6" strokeDasharray="3 4" />
    <line x1="20" y1="20" x2="144" y2="20" stroke={c.w04} strokeWidth="0.6" strokeDasharray="3 4" />

    {/* Revenue line — going up */}
    <path d="M24 94 C44 88, 64 72, 84 54 C104 38, 124 26, 140 20" stroke={c.green} strokeWidth="2" strokeLinecap="round" fill="none" />
    <circle cx="140" cy="20" r="4" fill={c.green} fillOpacity="0.7" />

    {/* Token price line — going down */}
    <path d="M24 44 C44 52, 64 68, 84 80 C104 90, 124 98, 140 104" stroke={c.red} strokeWidth="2" strokeLinecap="round" fill="none" />
    <circle cx="140" cy="104" r="4" fill={c.red} fillOpacity="0.7" />

    {/* Legend */}
    <circle cx="90" cy="122" r="3" fill={c.green} />
    <text x="96" y="126" fill={c.w5} fontSize="9" fontFamily="system-ui">Revenue</text>
    <circle cx="130" cy="122" r="3" fill={c.red} />
    <text x="136" y="126" fill={c.w5} fontSize="9" fontFamily="system-ui">Price</text>
  </svg>
)

export const IconOpenVault = () => (
  <svg viewBox="0 0 160 130" fill="none">
    {/* Grid */}
    <line x1="20" y1="108" x2="144" y2="108" stroke={c.w08} strokeWidth="0.8" />

    {/* Vertical markers */}
    <line x1="60" y1="14" x2="60" y2="108" stroke={c.w08} strokeWidth="0.7" strokeDasharray="3 4" />
    <text x="60" y="10" textAnchor="middle" fill={c.w15} fontSize="9" fontFamily="system-ui">TGE</text>
    <line x1="90" y1="14" x2="90" y2="108" stroke={c.w08} strokeWidth="0.7" strokeDasharray="3 4" />
    <text x="90" y="10" textAnchor="middle" fill={c.w15} fontSize="9" fontFamily="system-ui">Unlock</text>

    {/* Area fill */}
    <defs>
      <linearGradient id="crash-fill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={c.red} stopOpacity="0.2" />
        <stop offset="100%" stopColor={c.red} stopOpacity="0.01" />
      </linearGradient>
    </defs>
    <path
      d="M24 96 C38 92, 50 86, 56 78 C60 72, 64 58, 68 42 C72 28, 78 20, 84 18 C90 16, 96 30, 102 52 C110 78, 122 94, 134 100 L144 104 L144 108 L24 108 Z"
      fill="url(#crash-fill)"
    />
    <path
      d="M24 96 C38 92, 50 86, 56 78 C60 72, 64 58, 68 42 C72 28, 78 20, 84 18 C90 16, 96 30, 102 52 C110 78, 122 94, 134 100 L144 104"
      stroke={c.red} strokeWidth="2" strokeLinecap="round" fill="none"
    />

    {/* Crash label */}
    <text data-anim="pulse-text" x="128" y="78" textAnchor="middle" fill={c.red} fontSize="18" fontFamily="system-ui" fontWeight="700">-82%</text>
  </svg>
)

export const IconHollowToken = () => (
  <svg viewBox="0 0 260 130" fill="none">
    {/* Legend */}
    <rect x="16" y="24" width="8" height="8" rx="2" fill={c.purple} />
    <text x="30" y="32" fill={c.w5} fontSize="10" fontFamily="system-ui">Team 20%</text>
    <rect x="16" y="42" width="8" height="8" rx="2" fill={c.green} />
    <text x="30" y="50" fill={c.w5} fontSize="10" fontFamily="system-ui">Investors 25%</text>
    <rect x="16" y="60" width="8" height="8" rx="2" fill={c.blue} />
    <text x="30" y="68" fill={c.w5} fontSize="10" fontFamily="system-ui">Community 40%</text>
    <rect x="16" y="78" width="8" height="8" rx="2" fill={c.orange} />
    <text x="30" y="86" fill={c.w5} fontSize="10" fontFamily="system-ui">Treasury 15%</text>

    {/* Donut chart */}
    <g transform="translate(190, 62)">
      <circle cx="0" cy="0" r="44" fill="none" stroke={c.w04} strokeWidth="16" />
      {/* Community 40% = 144deg */}
      <circle cx="0" cy="0" r="44" fill="none" stroke={c.blue} strokeWidth="16" strokeOpacity="0.7"
        strokeDasharray="110.5 166" strokeDashoffset="0" transform="rotate(-90)" />
      {/* Investors 25% = 90deg */}
      <circle cx="0" cy="0" r="44" fill="none" stroke={c.green} strokeWidth="16" strokeOpacity="0.7"
        strokeDasharray="69 207.5" strokeDashoffset="-110.5" transform="rotate(-90)" />
      {/* Team 20% = 72deg */}
      <circle cx="0" cy="0" r="44" fill="none" stroke={c.purple} strokeWidth="16" strokeOpacity="0.7"
        strokeDasharray="55.3 221.2" strokeDashoffset="-179.5" transform="rotate(-90)" />
      {/* Treasury 15% = 54deg */}
      <circle cx="0" cy="0" r="44" fill="none" stroke={c.orange} strokeWidth="16" strokeOpacity="0.7"
        strokeDasharray="41.5 235" strokeDashoffset="-234.8" transform="rotate(-90)" />
    </g>

    {/* X overlay */}
    <g transform="translate(190, 62)">
      <line x1="-22" y1="-22" x2="22" y2="22" stroke={c.red} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <line x1="22" y1="-22" x2="-22" y2="22" stroke={c.red} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
    </g>
  </svg>
)
