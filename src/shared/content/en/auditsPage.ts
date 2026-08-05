export const auditsMeta = {
  title: 'Public Audits — 8Blocks',
  description: 'Public token audits by the 8Blocks team.',
  ogTitle: 'Public Audits — 8Blocks',
  ogDescription: 'Public token audits by the 8Blocks team.',
} as const

export const auditsArchiveContent = {
  labelSection: 'Audits',
  headline: 'Public Audits',
  emptyState: 'Audits will appear here.',
  emptyHint: 'Check back later.',
  paginationAriaLabel: 'Pagination',
  prevPage: 'Previous page',
  nextPage: 'Next page',
  readLink: 'View',
  blogArticleLink: 'Read blog article',
  downloadPdf: 'Download Audit PDF',
  expertLabel: 'Expert',
  auditLabel: 'Token audit',
  finalRating: 'Final rating',
  countSingular: 'audit',
  countFew: 'audits',
  countMany: 'audits',
} as const

export const methodologyContent = {
  ariaLabel: 'Rating methodology',
  label: 'Rating methodology',
  headline: 'How we assess the link between product and token',
  product: {
    label: 'PRODUCT',
    caption: 'Users · volume · revenue',
  },
  token: {
    label: 'TOKEN',
    caption: 'Price · holders · demand',
  },
  linkage: {
    label: 'TPL',
    caption: 'Token Product Linkage',
  },
  strong: 'Strong',
  noLinkage: 'No linkage',
  strongDescription:
    'Product growth creates demand and economic value for the token.',
  noLinkageDescription:
    'Without Token Product Linkage, product growth does not necessarily strengthen the token.',
  signals: [
    { id: 'value-capture', title: 'Value capture', line: 'Does product revenue reach the token?' },
    { id: 'token-necessity', title: 'Token necessity', line: 'Is it necessary in the core loop or optional?' },
    { id: 'demand-elasticity', title: 'Demand elasticity', line: 'Does activity growth increase token demand?' },
    { id: 'supply-sinks', title: 'Supply sinks', line: 'Do burns and locks grow with usage?' },
    { id: 'on-chain-proof', title: 'On-chain proof', line: 'Are the flows verifiable rather than assumed?' },
    { id: 'rule-durability', title: 'Rule durability', line: 'How difficult is it to turn the linkage off?' },
  ],
  ratingDescription:
    'Token Product Linkage is the core of the assessment. We also analyse tokenomics resilience, fundamentals, governance and control, security, and market structure; the result combines a score, colour rating, and key risks.',
  scoredNote: 'Every audit above is scored this way.',
  transparency:
    'We show what we measure and why; weights and formulas remain part of our internal methodology.',
  consultationLabel: 'Book a consultation',
} as const
