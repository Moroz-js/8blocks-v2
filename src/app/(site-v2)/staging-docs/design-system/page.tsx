import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AccentSurface, Button, TextField, Textarea } from '@/shared/ds'
import { TabsDemo } from './TabsDemo'
import styles from './DesignSystem.module.scss'

const IS_STAGING = process.env.NEXT_PUBLIC_STAGING === 'true'

export const metadata: Metadata = {
  title: 'Дизайн-система v2',
  robots: { index: false, follow: false, nocache: true },
}

const PRIMITIVES = [
  ['Colors/Black', '--ds-bg', '#000000'],
  ['Colors/Dark', '--ds-surface', '#101113'],
  ['Colors/Charcoal', '--ds-surface-raised', '#1B1B1B'],
  ['Colors/Gray', '--ds-text-muted', '#707172'],
  ['Gray light (HTML)', '--ds-text-link', '#AAAAAC'],
  ['Colors/White', '--ds-text', '#FFFFFF'],
  ['Colors/Pink', '--ds-accent', '#CA005A'],
  ['Colors/Green', '--ds-success', '#34C759'],
  ['Colors/Orange', '--ds-warning', '#FF8D28'],
  ['Colors/Red', '--ds-danger', '#FF383C'],
] as const

const SEMANTIC = [
  ['--ds-bg', 'Фон страницы'],
  ['--ds-surface', 'Карточки, поля'],
  ['--ds-surface-raised', 'Secondary-кнопка, таб off, hover поля'],
  ['--ds-surface-glass', 'Tertiary-кнопка поверх фото и градиента'],
  ['--ds-text', 'Основной текст'],
  ['--ds-text-muted', 'Описания, лейблы, плейсхолдеры'],
  ['--ds-text-inverse', 'Текст на светлой заливке'],
  ['--ds-text-faint', 'Вторичный текст на градиенте и фото'],
  ['--ds-text-link', 'Ссылки и источники в тексте статьи'],
  ['--ds-border', 'Разделители, линии таблиц'],
  ['--ds-border-strong', 'Рамка поля на hover'],
  ['--ds-accent', 'Акцент'],
  ['--ds-danger', 'Ошибка'],
  ['--ds-success', 'Успех'],
  ['--ds-warning', 'Предупреждение'],
] as const

const TYPE = [
  ['ds-h1', 'Heading 1', '72 / 80 → mobile 56 / 64', 'h1'],
  ['ds-h2', 'Heading 2', '56 / 64 → mobile 40 / 48', 'h2'],
  ['ds-h3', 'Heading 3', '40 / 48 → mobile 32 / 40', 'h3'],
  ['ds-h4', 'Heading 4', '32 / 40 → mobile 24 / 30', 'h4'],
  ['ds-h5', 'Heading 5', '24 / 30', 'h5'],
  ['ds-text-lg', 'Text large', '18 / 25 · +1%', 'textLg'],
  ['ds-text-md', 'Text normal', '16 / 22 · +1%', 'textMd'],
  ['ds-text-sm', 'Text small', '14 / 20 · +1%', 'textSm'],
  ['ds-text-xs', 'Text extra small', '12 / 16 · +1%', 'textXs'],
] as const

const SHAPE = [
  ['$ds-radius-pill', '64px', 'Кнопки, табы, круглые контролы'],
  ['$ds-radius-field', '10px', 'Поля ввода'],
  ['$ds-radius-card', '10px', 'Карточки, панели'],
  ['$ds-radius-lg', '15px', 'FAQ, подсветка колонки таблицы, превью кейсов'],
  ['$ds-radius-badge', '12px', 'Плашка цены'],
  ['$ds-radius-md / sm / xs', '8 / 6 / 4px', 'Мелкие элементы: чипы, теги, бары графиков'],
  ['$ds-radius-step', '5px', 'Номер шага в Roadmap'],
  ['$ds-weight / regular / bold', '500 / 400 / 700', 'Начертания Manrope; по умолчанию 500'],
  ['$ds-content', '1200px', 'Колонка контента; 8 колонок × 141, gutter 10'],
  ['$ds-margin', '40 / 24 / 12px', 'Поля: desktop / tablet ≤ 1024 / mobile ≤ 640'],
  ['$ds-block-gap', '180 / 120 / 80px', 'Между блоками страницы'],
  ['$ds-inner-gap', '40 / 24px', 'Заголовок блока → контент'],
  ['$ds-shadow-xs', '0 1 2 · inset 0 −1 1', 'Figma shadows/xs'],
] as const

const SAMPLE = 'Making crypto great again'
const PARAGRAPH =
  'The most common team vesting structure is a four-year schedule with a one-year cliff, mirroring traditional tech equity; 25% typically vests at the cliff.'

export default function DesignSystemPage() {
  if (!IS_STAGING) notFound()

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>staging-docs · design system v2</p>
        <h1 className={styles.pageTitle}>Дизайн-система v2</h1>
        <p className={styles.lead}>
          Токены и элементы из Figma «Design system», страница Elements. Код: <code>src/shared/ds</code>,
          глобальные стили: <code>src/app/globals-v2.scss</code>, документация: <code>docs/design-system-v2.md</code>.
          Только тёмная тема.
        </p>
        <p className={styles.lead}>
          <Link href="/staging-docs/design-system/blocks" className={styles.link}>
            Блоки из Figma →
          </Link>
        </p>
      </header>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Цвета — примитивы</h2>
        <div className={styles.swatches}>
          {PRIMITIVES.map(([figma, token, hex]) => (
            <div key={figma} className={styles.swatch}>
              <span className={styles.swatchColor} style={{ background: hex }} />
              <span className={styles.swatchName}>{figma}</span>
              <code>{hex}</code>
              <code className={styles.muted}>{token}</code>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Цвета — семантика</h2>
        <p className={styles.note}>
          Компоненты используют только семантику (<code>$ds-*</code> → <code>var(--ds-*)</code>). Светлая тема позже
          переопределит те же переменные.
        </p>
        <div className={styles.swatches}>
          {SEMANTIC.map(([token, use]) => (
            <div key={token} className={styles.swatch}>
              <span className={styles.swatchColor} style={{ background: `var(${token})` }} />
              <code>{token}</code>
              <span className={styles.muted}>{use}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Типографика</h2>
        <p className={styles.note}>Manrope Medium 500. Заголовки на mobile (≤ 640) опускаются на один уровень.</p>
        <div className={styles.typeList}>
          {TYPE.map(([mixin, figma, spec, cls]) => (
            <div key={mixin} className={styles.typeRow}>
              <div className={styles.typeMeta}>
                <span>{figma}</span>
                <code>@include {mixin}</code>
                <span className={styles.muted}>{spec}</span>
              </div>
              <p className={styles[cls]}>{cls.startsWith('text') ? PARAGRAPH : SAMPLE}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Сетка, отступы, форма</h2>
        <div className={styles.gridDemo} aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
        <div className={styles.table}>
          {SHAPE.map(([name, value, use]) => (
            <div key={name} className={styles.tableRow}>
              <code>{name}</code>
              <span>{value}</span>
              <span className={styles.muted}>{use}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Button</h2>
        <p className={styles.note}>
          <code>{'<Button variant="primary | secondary | tertiary" href? fullWidth? icon? />'}</code> — 56px, pill.
        </p>
        <div className={styles.row}>
          <Button>Discuss your property</Button>
          <Button variant="secondary">Discuss your property</Button>
          <Button variant="tertiary">Discuss your property</Button>
          <Button href="/staging-docs/design-system">Link</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className={styles.onGradient}>
          <Button>Discuss your property</Button>
          <Button variant="tertiary">Discuss your property</Button>
        </div>
        <Button fullWidth>Full width</Button>
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>AccentSurface</h2>
        <p className={styles.note}>
          <code>{'<AccentSurface />'}</code> — акцентный фон: градиент <code>$ds-accent-stops</code> и медленно
          всплывающий шум. Первым ребёнком в блок с <code>position: relative; isolation: isolate; overflow: hidden</code>
          . Угол градиента зависит от пропорций блока. Карточки внутри <code>data-accent-group</code> делят один
          градиент на всю группу.
        </p>
        <div className={styles.accentWide}>
          <AccentSurface />
          <p className={styles.h4}>Pressure-test your tokenomics</p>
          <Button variant="tertiary">Book a call</Button>
        </div>
        <div className={styles.accentGroup} data-accent-group>
          {['Business model', 'Tokenomics', 'Investor narrative'].map((title) => (
            <div key={title} className={styles.accentCard}>
              <AccentSurface />
              <p className={styles.h5}>{title}</p>
              <p className={styles.accentText}>Один градиент на группу, шум — у каждой карточки.</p>
            </div>
          ))}
        </div>
        <p className={styles.note}>
          Ссылка в тексте статьи:{' '}
          <a href="https://app.rwa.xyz/" className={styles.textLink}>
            rwa.xyz
          </a>{' '}
          — <code>$ds-text-link</code>, подчёркнутая.
        </p>
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Tabs</h2>
        <p className={styles.note}>
          <code>{'<Tabs items value onChange label />'}</code> — 44px, pill; стрелки ← → переключают табы.
        </p>
        <TabsDemo />
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>TextField / Textarea</h2>
        <p className={styles.note}>
          Состояния из Figma: по умолчанию, наведение и фокус — через CSS, «заполнено» — поле со значением,
          «ошибка» — проп <code>error</code>.
        </p>
        <div className={styles.fields}>
          <TextField label="Имя *" placeholder="Введите имя" />
          <TextField label="Имя *" defaultValue="Введите имя" />
          <TextField label="Email *" defaultValue="wrong@" error="Неверная почта" />
          <TextField label="Компания" placeholder="Необязательно" hint="Поможет подготовиться к звонку" />
          <Textarea label="Сообщение *" placeholder="Расскажите о проекте" className={styles.wide} />
        </div>
      </section>
    </div>
  )
}
