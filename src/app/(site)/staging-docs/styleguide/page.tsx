import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Button, ButtonLink, Container } from '@/shared/ui'
import { ThemeScopeMarker } from '@/shared/lib/ThemeScope'
import { CssVarValue } from './CssVarValue'
import styles from './Styleguide.module.scss'

const IS_STAGING = process.env.NEXT_PUBLIC_STAGING === 'true'

export const metadata: Metadata = {
  title: 'Стайлгайд — текущая дизайн-система',
  robots: { index: false, follow: false, nocache: true },
}

interface TokenGroup {
  title: string
  note?: string
  tokens: string[]
}

// Semantic colors: values come from globals.scss and switch with the theme.
const COLOR_GROUPS: TokenGroup[] = [
  {
    title: 'Фон',
    tokens: ['body-bg', 'bg-secondary', 'bg-tertiary', 'surface', 'section-inset-bg', 'card-panel-bg', 'card-panel-bg-hover'],
  },
  { title: 'Текст', tokens: ['text-primary', 'text-secondary', 'text-tertiary', 'muted-strong', 'text-on-media'] },
  { title: 'Границы', tokens: ['border-primary', 'border-secondary', 'border-subtle'] },
  { title: 'Акценты', tokens: ['accent', 'accent-green', 'accent-blue', 'selection-bg'] },
  {
    title: 'Кнопки и поля',
    tokens: [
      'button-primary-bg',
      'button-primary-fg',
      'button-primary-hover',
      'button-ghost-hover-bg',
      'input-bg',
      'input-bg-focus',
      'input-placeholder',
      'focus-accent',
    ],
  },
  {
    title: 'Статусы',
    tokens: ['error-fg', 'error-bg', 'error-border', 'success-fg', 'success-bg', 'success-border'],
  },
  { title: 'Хедер и оверлеи', tokens: ['header-bg', 'header-bg-solid', 'overlay-scrim', 'fab-bg', 'cover-scrim'] },
]

// Brand palette: SCSS constants, identical in both themes.
const BRAND = [
  { name: '$pal-magenta', value: '#C24E88', note: 'Основной акцент, CTA, focus ring' },
  { name: '$pal-rose', value: '#D9ADD0', note: 'Градиенты' },
  { name: '$pal-purple', value: '#8E4ABD', note: 'Градиенты, тени' },
  { name: '$pal-warm-white', value: '#E3D0D5', note: 'Блик' },
]

const GRADIENTS = [
  { name: '--gradient-accent', className: 'gradientAccent', note: 'Акцентный текст, 135°' },
  { name: '$gradient-accent-wide', className: 'gradientWide', note: 'Лого, баннеры, 90°' },
  { name: '$gradient-accent-h', className: 'gradientH', note: 'Декоративная линия, 90°' },
]

const TYPE_ROLES = [
  { mixin: 'heading-hero', className: 'typeHero', spec: '72 / 56 / 40 · 500 · 1.1' },
  { mixin: 'heading-section', className: 'typeSection', spec: '56 / 40 / 32 · 500 · 1.1' },
  { mixin: 'heading-card', className: 'typeCard', spec: '24 · 500 · 1.25' },
  { mixin: 'body-text', className: 'typeBody', spec: '16 · 400 · 1.6 · text-secondary' },
  { mixin: 'label-small', className: 'typeLabel', spec: '14 · 400 · 1.5 · uppercase · 0.06em' },
  { mixin: 'section-label', className: 'typeSectionLabel', spec: '14 · 400 · 1.5 · 0.08em' },
]

const TEXT_SCALE = [
  ['$text-xs', 12],
  ['$text-sm', 14],
  ['$text-base', 16],
  ['$text-md', 18],
  ['$text-lg', 20],
  ['$text-xl', 24],
  ['$text-2xl', 32],
  ['$text-3xl', 40],
  ['$text-4xl', 56],
  ['$text-5xl', 72],
] as const

const SPACING = [
  ['space-1', 4],
  ['space-2', 8],
  ['space-3', 12],
  ['space-4', 16],
  ['space-5', 24],
  ['space-6', 32],
  ['space-7', 48],
  ['space-8', 64],
  ['space-9', 80],
  ['space-10', 96],
  ['space-11', 128],
  ['space-12', 160],
] as const

const BREAKPOINTS = [
  ['mobile', '$bp-mobile', '≤ 640'],
  ['tablet', '$bp-tablet', '≤ 768'],
  ['desktop', '$bp-desktop', '≤ 1024'],
] as const

const MISC = [
  ['$transition-fast', '150ms ease'],
  ['$transition-base', '250ms ease'],
  ['$transition-slow', '400ms ease'],
  ['--card-radius', '0 — скруглений нет'],
  ['$container-max', '1280px'],
  ['$container-padding', '24px, mobile 16px'],
] as const

const SAMPLE = 'Токеномика, которая выдерживает рынок'

export default function StyleguidePage() {
  if (!IS_STAGING) notFound()

  return (
    <Container className={styles.page}>
      <ThemeScopeMarker />
      <header className={styles.intro}>
        <p className={styles.eyebrow}>staging-docs</p>
        <h1 className={styles.title}>Стайлгайд — текущая система</h1>
        <p className={styles.lead}>
          Живая витрина токенов и компонентов из <code>src/app/globals.scss</code>,{' '}
          <code>src/shared/styles</code> и <code>src/shared/ui</code>. Тема переключается в хедере (тумблер есть только на статьях, исследованиях, аудитах и здесь); значения
          цветов пересчитываются под активную тему.
        </p>
      </header>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Цвета — семантические токены</h2>
        {COLOR_GROUPS.map((group) => (
          <div key={group.title} className={styles.group}>
            <h3 className={styles.groupTitle}>{group.title}</h3>
            <div className={styles.swatches}>
              {group.tokens.map((token) => (
                <div key={token} className={styles.swatch}>
                  <span className={styles.swatchColor} style={{ background: `var(--${token})` }} />
                  <code className={styles.swatchName}>--{token}</code>
                  <span className={styles.swatchValue}>
                    <CssVarValue name={token} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Бренд и градиенты</h2>
        <p className={styles.note}>Не зависят от темы.</p>
        <div className={styles.swatches}>
          {BRAND.map((color) => (
            <div key={color.name} className={styles.swatch}>
              <span className={styles.swatchColor} style={{ background: color.value }} />
              <code className={styles.swatchName}>{color.name}</code>
              <span className={styles.swatchValue}>
                {color.value} · {color.note}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.gradients}>
          {GRADIENTS.map((gradient) => (
            <div key={gradient.name} className={styles.gradientItem}>
              <span className={`${styles.gradientBar} ${styles[gradient.className]}`} />
              <code className={styles.swatchName}>{gradient.name}</code>
              <span className={styles.swatchValue}>{gradient.note}</span>
            </div>
          ))}
        </div>
        <p className={`${styles.gradientText} ${styles.typeSection}`}>{SAMPLE}</p>
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Типографика</h2>
        <p className={styles.note}>Manrope 400 / 500. Роли — миксины из <code>_mixins.scss</code>.</p>
        <div className={styles.typeList}>
          {TYPE_ROLES.map((role) => (
            <div key={role.mixin} className={styles.typeRow}>
              <div className={styles.typeMeta}>
                <code>@include {role.mixin}</code>
                <span>{role.spec}</span>
              </div>
              <p className={styles[role.className]}>{SAMPLE}</p>
            </div>
          ))}
        </div>

        <h3 className={styles.groupTitle}>Шкала размеров</h3>
        <div className={styles.scale}>
          {TEXT_SCALE.map(([name, px]) => (
            <div key={name} className={styles.scaleRow}>
              <code>{name}</code>
              <span>{px}px</span>
              <span className={styles.scaleSample} style={{ fontSize: px }}>
                Aa Бб 123
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Отступы</h2>
        <p className={styles.note}>
          Шаг 4/8px. Вертикаль секций (<code>Section spacing=&quot;lg&quot;</code>): 128 → 64 → 48.
        </p>
        <div className={styles.spacing}>
          {SPACING.map(([name, px]) => (
            <div key={name} className={styles.spacingRow}>
              <code>--{name}</code>
              <span>{px}px</span>
              <span className={styles.spacingBar} style={{ width: px }} />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Брейкпоинты, радиусы, анимации</h2>
        <div className={styles.table}>
          {BREAKPOINTS.map(([mixin, variable, range]) => (
            <div key={mixin} className={styles.tableRow}>
              <code>@include {mixin}</code>
              <code>{variable}</code>
              <span>{range}px</span>
            </div>
          ))}
          {MISC.map(([name, value]) => (
            <div key={name} className={styles.tableRow}>
              <code>{name}</code>
              <span />
              <span>{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Кнопки</h2>
        <p className={styles.note}>
          <code>Button</code> / <code>ButtonLink</code> из <code>@/shared/ui</code>.
        </p>
        {(['primary', 'secondary', 'ghost'] as const).map((variant) => (
          <div key={variant} className={styles.buttonRow}>
            <code className={styles.buttonLabel}>{variant}</code>
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <Button key={size} variant={variant} size={size}>
                Обсудить проект · {size}
              </Button>
            ))}
            <Button variant={variant} icon={<ArrowRight size={16} />}>
              С иконкой
            </Button>
            <Button variant={variant} loading>
              Загрузка
            </Button>
            <Button variant={variant} disabled>
              Disabled
            </Button>
          </div>
        ))}
        <div className={styles.buttonRow}>
          <code className={styles.buttonLabel}>link</code>
          <ButtonLink href="/contact" icon={<ArrowUpRight size={16} />}>
            ButtonLink
          </ButtonLink>
        </div>
        <div className={styles.buttonRow}>
          <code className={styles.buttonLabel}>fullWidth</code>
          <Button fullWidth>Во всю ширину</Button>
        </div>
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Поверхности и карточки</h2>
        <div className={styles.cards}>
          <div className={`${styles.card} ${styles.cardSurface}`}>
            <code>@include card-surface</code>
            <p>bg-secondary · blur 12px · border-secondary</p>
          </div>
          <div className={`${styles.card} ${styles.cardElevated}`}>
            <code>@include card-surface-elevated</code>
            <p>bg-tertiary · border-primary</p>
          </div>
          <div className={`${styles.card} ${styles.cardCorner}`}>
            <code>@include card-corner-border</code>
            <p>Уголки 32px, на hover рамка раскрывается</p>
          </div>
          <div className={`${styles.card} ${styles.cardPanel}`}>
            <code>--card-panel-bg</code>
            <p>Панель с hover</p>
          </div>
        </div>
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Поля, фокус, статусы</h2>
        <div className={styles.forms}>
          <label className={styles.field}>
            <span className={styles.typeLabel}>Имя</span>
            <input className={styles.input} placeholder="Введите имя" />
          </label>
          <label className={styles.field}>
            <span className={styles.typeLabel}>Email</span>
            <input className={`${styles.input} ${styles.inputError}`} defaultValue="wrong@" />
            <span className={styles.errorText}>Неверная почта</span>
          </label>
          <a href="#focus" className={styles.focusDemo}>
            Tab сюда — @include focus-ring
          </a>
          <div className={styles.statuses}>
            <span className={styles.statusError}>error</span>
            <span className={styles.statusSuccess}>success</span>
          </div>
        </div>
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Хедер и футер</h2>
        <p className={styles.note}>Общие виджеты layout — смотреть вверху и внизу этой страницы, в обеих темах.</p>
      </section>
    </Container>
  )
}
