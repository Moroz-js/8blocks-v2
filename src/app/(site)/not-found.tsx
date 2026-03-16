import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/shared/ui'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <Container>
      <div style={{ paddingBlock: '120px 160px', textAlign: 'center' }}>
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-tertiary)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          [ 404 ]
        </p>
        <h1
          style={{
            fontSize: 'clamp(40px, 6vw, 64px)',
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: '16px',
            lineHeight: 1.15,
          }}
        >
          Page not found
        </h1>
        <p
          style={{
            color: 'var(--text-secondary)',
            marginBottom: '40px',
            maxWidth: '400px',
            margin: '0 auto 40px',
          }}
        >
          The page you&apos;re looking for has been removed or never existed.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 28px',
            background: '#ffffff',
            color: '#0a0a0a',
            borderRadius: '6px',
            fontWeight: 500,
            textDecoration: 'none',
            fontSize: '14px',
            transition: 'opacity 0.15s',
          }}
        >
          Back to home
        </Link>
      </div>
    </Container>
  )
}
