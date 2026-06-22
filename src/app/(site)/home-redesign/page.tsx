import type { Metadata } from 'next'
import { HomeRedesign } from '@/widgets/HomeRedesign'

// Закрыто от индексации: это страница-песочница нового дизайна.
export const metadata: Metadata = {
  title: 'Home Redesign',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function HomeRedesignPage() {
  return (
    <main>
      <HomeRedesign />
    </main>
  )
}
