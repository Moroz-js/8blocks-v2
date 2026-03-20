import type { Metadata } from 'next'
import { ServicesSection } from '@/widgets/ServicesSection'

export const metadata: Metadata = {
  title: 'Услуги',
  description:
    'Стратегический консалтинг, проектирование и аудит токеномики. Помогаем Web3-проектам создавать и восстанавливать работающие токен-экономики.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'Услуги | 8Blocks',
    description: 'Стратегический консалтинг, проектирование и аудит токеномики.',
    url: '/services',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Услуги | 8Blocks',
    description: 'Стратегический консалтинг, проектирование и аудит токеномики.',
  },
}

export default function ServicesPage() {
  return (
    <main>
      <ServicesSection />
    </main>
  )
}
