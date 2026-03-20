// Custom stroke-based SVG icons for the ProblemBlock bento grid.
// All icons share viewBox="0 0 96 96", fill="none", stroke="currentColor".
// Sized by the parent .cardIcon container (80×80px desktop, 64×64px mobile).

// ─── Consulting page icons ────────────────────────────────────────────────────

/** Route diverging into multiple paths — "No token strategy" */
export const IconRouteFork = () => (
  <svg width="100%" height="100%" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="48" y1="82" x2="48" y2="57" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="48" cy="52" r="4.5" stroke="currentColor" strokeWidth="1.5" />
    <line x1="45" y1="49" x2="18" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="48" y1="47" x2="48" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="51" y1="49" x2="78" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="48" cy="82" r="2.5" fill="currentColor" />
    <circle cx="48" cy="18" r="2.5" fill="currentColor" />
    <circle cx="18" cy="22" r="2.5" fill="currentColor" />
    <circle cx="78" cy="22" r="2.5" fill="currentColor" />
  </svg>
)

/** Speech bubble with a signal wave that breaks — "Weak investor communication" */
export const IconBrokenSignal = () => (
  <svg width="100%" height="100%" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14 16 C14 13 17 11 20 11 L76 11 C79 11 82 13 82 16 L82 55 C82 58 79 60 76 60 L56 60 L46 76 L46 60 L20 60 C17 60 14 58 14 55 Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M22 36 L28 24 L34 46 L38 36 L42 36"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M48 36 L54 26 L60 48 L66 30 L72 36"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="3 4"
      opacity="0.45"
    />
  </svg>
)

/** Network of nodes with broken connections — "No partner ecosystem" */
export const IconDisconnectedNodes = () => (
  <svg width="100%" height="100%" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="48" cy="48" r="5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="22" r="4" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="78" cy="22" r="4" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="74" r="4" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="78" cy="74" r="4" stroke="currentColor" strokeWidth="1.5" opacity="0.38" />
    <line x1="22" y1="25" x2="44" y2="44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="74" y1="25" x2="52" y2="44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="22" y1="71" x2="44" y2="51" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line
      x1="74"
      y1="71"
      x2="52"
      y2="51"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="3 4"
      opacity="0.32"
    />
    <line
      x1="18"
      y1="26"
      x2="18"
      y2="70"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="3 4"
      opacity="0.25"
    />
  </svg>
)

/** Checklist with a detached, misaligned last item — "Unsystematic TGE prep" */
export const IconFragmentedChecklist = () => (
  <svg width="100%" height="100%" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="18" y="14" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M20 20.5 L23.5 25 L29 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="37" y1="20.5" x2="75" y2="20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="18" y="35" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M20 41.5 L23.5 46 L29 37" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="37" y1="41.5" x2="70" y2="41.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="18" y="56" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <line x1="37" y1="62.5" x2="60" y2="62.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <rect
      x="28"
      y="77"
      width="13"
      height="13"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="2.5 2.5"
      opacity="0.45"
    />
    <line
      x1="47"
      y1="83.5"
      x2="76"
      y2="83.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="3 3"
      opacity="0.3"
    />
  </svg>
)

// ─── Audit page icons ─────────────────────────────────────────────────────────

/** Balance scale visibly tilted — "Errors already in the balance" */
export const IconTiltedScale = () => (
  <svg width="100%" height="100%" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="48" y1="22" x2="48" y2="78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="36" y1="78" x2="60" y2="78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="48" cy="36" r="3" fill="currentColor" />
    <line x1="12" y1="30" x2="84" y2="45" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="12" y1="30" x2="12" y2="50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 50 Q12 57 20 50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="84" y1="45" x2="84" y2="54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M76 54 Q84 61 92 54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

/** Growth curve that rises then sharply collapses — "Tokenomics can't scale" */
export const IconBrokenGrowth = () => (
  <svg width="100%" height="100%" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="14" y1="78" x2="84" y2="78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    <line x1="14" y1="78" x2="14" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    <path d="M14 74 C22 66 30 54 46 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="46" cy="38" r="4" fill="currentColor" />
    <path
      d="M46 38 L56 52 L66 62 L78 74"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="3 4"
      opacity="0.5"
    />
  </svg>
)

/** Shield with progressively obscured content lines — "Hard to defend to investors" */
export const IconObscuredShield = () => (
  <svg width="100%" height="100%" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M48 13 L76 24 L76 50 C76 64 63 74 48 80 C33 74 20 64 20 50 L20 24 Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <line x1="33" y1="38" x2="63" y2="38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
    <line x1="33" y1="49" x2="57" y2="49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.48" />
    <line
      x1="33"
      y1="60"
      x2="46"
      y2="60"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="2 2.5"
      opacity="0.26"
    />
    <path d="M58 53 C58 48 66 48 66 53 C66 56 62 57.5 62 62" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.62" />
    <circle cx="62" cy="65.5" r="1.8" fill="currentColor" opacity="0.62" />
  </svg>
)

/** Radar rings with a blip appearing on the outermost ring — "Weak spots noticed too late" */
export const IconRadarPing = () => (
  <svg width="100%" height="100%" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="46" cy="54" r="3" fill="currentColor" />
    <circle cx="46" cy="54" r="11" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
    <circle cx="46" cy="54" r="22" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    <circle cx="46" cy="54" r="33" stroke="currentColor" strokeWidth="1.5" opacity="0.26" />
    <circle cx="46" cy="54" r="44" stroke="currentColor" strokeWidth="1.5" opacity="0.13" />
    <line x1="46" y1="54" x2="78" y2="22" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.22" />
    <circle cx="80" cy="28" r="5" fill="currentColor" opacity="0.88" />
    <circle cx="80" cy="28" r="8" stroke="currentColor" strokeWidth="1" opacity="0.28" />
  </svg>
)

// ─── Tokenomics page icons ────────────────────────────────────────────────────

/**
 * Wide-format icon: hex token (left) — broken link (center) — product block (right).
 * Uses a landscape viewBox (240×80) designed for horizontal cards.
 * "Token not linked to product"
 */
export const IconDisconnectedTokenProduct = () => (
  <svg width="100%" height="100%" viewBox="0 0 240 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Token — hexagon */}
    <path d="M36 8 L64 24 L64 56 L36 72 L8 56 L8 24 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="36" cy="40" r="4" fill="currentColor" opacity="0.45" />

    {/* Left connection stub */}
    <line x1="64" y1="40" x2="104" y2="40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

    {/* Gap markers */}
    <line x1="107" y1="33" x2="107" y2="47" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    <line x1="133" y1="33" x2="133" y2="47" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    {/* Dashed line across the gap */}
    <line x1="107" y1="40" x2="133" y2="40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 4" opacity="0.28" />

    {/* Right connection stub */}
    <line x1="133" y1="40" x2="176" y2="40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

    {/* Product — rectangle */}
    <rect x="176" y="14" width="56" height="52" rx="4" stroke="currentColor" strokeWidth="1.5" />
    <line x1="184" y1="28" x2="224" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <line x1="184" y1="38" x2="220" y2="38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.32" />
    <line x1="184" y1="48" x2="214" y2="48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.18" />
  </svg>
)

/** ECG pulse line that fades to a flatline — "Demand not backed by mechanics" */
export const IconFadingPulse = () => (
  <svg width="100%" height="100%" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="10" y1="56" x2="86" y2="56" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.22" />
    <path
      d="M10 56 L18 56 L23 28 L31 76 L37 56 L44 56"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M44 56 L50 56 L54 40 L59 68 L63 56 L68 56"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.48"
    />
    <path
      d="M68 56 L86 56"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="2.5 3"
      opacity="0.22"
    />
  </svg>
)

/** Container with open lock and tokens escaping — "Fast distribution kills the token" */
export const IconOpenVault = () => (
  <svg width="100%" height="100%" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="44" width="46" height="38" rx="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M20 44 L20 82 Q10 82 10 74 L10 52 Q10 44 20 44" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path
      d="M34 44 L34 34 Q34 24 43 24 Q52 24 52 34 L52 44"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.65"
    />
    <path d="M52 32 C58 27 66 28 68 34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    <circle cx="60" cy="60" r="3.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="72" cy="50" r="3" stroke="currentColor" strokeWidth="1.5" opacity="0.62" />
    <circle cx="82" cy="40" r="2.5" stroke="currentColor" strokeWidth="1.5" opacity="0.38" />
  </svg>
)

/** Hexagon ring with an empty, hollow center — "Distributing token is not enough" */
export const IconHollowToken = () => (
  <svg width="100%" height="100%" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 13 L74 28 L74 58 L48 73 L22 58 L22 28 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path
      d="M48 27 L60 34 L60 50 L48 57 L36 50 L36 34 Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      opacity="0.2"
    />
    <circle cx="48" cy="43" r="8" stroke="currentColor" strokeWidth="1" opacity="0.14" />
    <circle cx="48" cy="43" r="2.5" stroke="currentColor" strokeWidth="1" opacity="0.22" />
    <line x1="48" y1="13" x2="48" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.48" />
    <line x1="74" y1="28" x2="71" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.48" />
    <line x1="74" y1="58" x2="71" y2="56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.48" />
    <line x1="48" y1="73" x2="48" y2="68" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.48" />
    <line x1="22" y1="58" x2="25" y2="56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.48" />
    <line x1="22" y1="28" x2="25" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.48" />
  </svg>
)
