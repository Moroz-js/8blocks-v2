'use client'

const items = [
  { id: 'hero', label: 'ServiceHero' },
  { id: 'problem', label: 'ProblemBlock' },
  { id: 'solution', label: 'SolutionBlock' },
  { id: 'deliverables', label: 'DeliverablesBlock' },
  { id: 'when-needed', label: 'WhenNeeded' },
  { id: 'what-you-get', label: 'WhatYouGet' },
  { id: 'false-assumptions', label: 'FalseAssumptions' },
  { id: 'use-cases', label: 'UseCases' },
  { id: 'process', label: 'ProcessSteps' },
  { id: 'cta', label: 'ServiceCta' },
  { id: 'faq', label: 'FaqAccordion' },
]

export function BlocksNav() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10,10,12,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '12px 24px',
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          style={{
            padding: '6px 14px',
            fontSize: 13,
            fontFamily: 'JetBrains Mono, monospace',
            color: 'rgba(255,255,255,0.6)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            textDecoration: 'none',
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
            e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
          }}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}
