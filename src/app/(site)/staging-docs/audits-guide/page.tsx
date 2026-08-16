import type { Metadata } from 'next'
import Image, { type StaticImageData } from 'next/image'
import { notFound } from 'next/navigation'
import adminBasics from './images/admin-basics.png'
import adminChartRow from './images/admin-chart-row.png'
import adminChecklist from './images/admin-checklist.png'
import adminExpert from './images/admin-expert.png'
import adminHero from './images/admin-hero.png'
import adminHeroMetrics from './images/admin-hero-metrics.png'
import adminInfoColumns from './images/admin-info-columns.png'
import adminMetricStrip from './images/admin-metric-strip.png'
import adminNumberedNotes from './images/admin-numbered-notes.png'
import adminRatingBlocks from './images/admin-rating-blocks.png'
import adminSeo from './images/admin-seo.png'
import adminStatColumns from './images/admin-stat-columns.png'
import adminTable from './images/admin-table.png'
import siteCard from './images/site-card.png'
import siteChartRow from './images/site-chart-row.png'
import siteChecklist from './images/site-checklist.png'
import siteExpert from './images/site-expert.png'
import siteHero from './images/site-hero.png'
import siteHeroMetrics from './images/site-hero-metrics.png'
import siteInfoColumns from './images/site-info-columns.png'
import siteMetricStrip from './images/site-metric-strip.png'
import siteNumberedNotes from './images/site-numbered-notes.png'
import siteRatingRadar from './images/site-rating-radar.png'
import siteRatingTable from './images/site-rating-table.png'
import siteStatColumns from './images/site-stat-columns.png'
import siteTable from './images/site-table.png'
import siteTakeaways from './images/site-takeaways.png'
import siteToc from './images/site-toc.png'
import styles from './AuditsGuide.module.scss'

const IS_STAGING = process.env.NEXT_PUBLIC_STAGING === 'true'

export const metadata: Metadata = {
  title: 'Публичные аудиты: что где заполняется',
  robots: { index: false, follow: false, nocache: true },
}

interface Shot {
  src: StaticImageData
  alt: string
}

interface Section {
  title: string
  site?: Shot[]
  text: string
  admin?: Shot
}

const SECTIONS: Section[] = [
  {
    title: 'Карточка в каталоге /audits',
    site: [{ src: siteCard, alt: 'Карточка аудита в каталоге' }],
    text: 'Обложка, дата публикации, заголовок и краткое описание. Описание обрезается — главное ставьте в первое предложение. Без обложки подставляется абстрактная заглушка.',
    admin: { src: adminBasics, alt: 'Основные поля аудита в админке' },
  },
  {
    title: 'Шапка страницы',
    site: [{ src: siteHero, alt: 'Шапка аудита на сайте' }],
    text: 'Тикер (биржевое обозначение токена, например $HYPE), ссылка на сайт проекта, описание, буквенный рейтинг и балл. Дата над заголовком берётся из поля «Дата публикации», кнопка PDF появляется сама. Поля «Компания» и «Стандарт» на странице не выводятся.',
    admin: { src: adminHero, alt: 'Группа «Шапка (Hero)» в админке' },
  },
  {
    title: 'Метрики под шапкой',
    site: [{ src: siteHeroMetrics, alt: 'Лента метрик на сайте' }],
    text: 'Значения выводятся как есть — вводите их уже отформатированными ($39.6b, 1.4m). Оптимально 4–6 штук.',
    admin: { src: adminHeroMetrics, alt: 'Массив «Метрики (Hero)» в админке' },
  },
  {
    title: 'Вердикт, сильная и слабая стороны',
    site: [{ src: siteTakeaways, alt: 'Вердикт и стороны на сайте' }],
    text: 'Три поля из группы «Шапка (Hero)»: «Короткий вердикт», «Сильная сторона (+)», «Слабая сторона (−)». Читаются подряд, поэтому каждое — законченная мысль в 1–2 предложения.',
    admin: { src: adminHero, alt: 'Поля вердикта в группе «Шапка (Hero)»' },
  },
  {
    title: 'Оглавление',
    site: [{ src: siteToc, alt: 'Оглавление на сайте' }],
    text: 'Собирается автоматически из заголовков H2 и H3 в поле «Содержание». Появляется, если заголовков два и больше.',
  },
  {
    title: 'Графики',
    site: [{ src: siteChartRow, alt: 'Графики на сайте' }],
    text: 'Блок «Ряд графиков» — до трёх графиков в строке. Для кольца и столбцов заполняется «Значение (столбцы / кольцо)» и цвет сегмента; для линии и области сначала добавьте «Серии», затем в каждой точке — по значению на серию. Подпись графика выводится под ним — указывайте в ней источник данных.',
    admin: { src: adminChartRow, alt: 'Блок «Ряд графиков» в админке' },
  },
  {
    title: 'Таблица',
    site: [{ src: siteTable, alt: 'Таблица на сайте' }],
    text: 'Блок «Таблица»: строка заголовков и строки ячеек. Держите 3–5 колонок — на мобильных таблица прокручивается горизонтально.',
    admin: { src: adminTable, alt: 'Блок «Таблица» в админке' },
  },
  {
    title: 'Полоса метрик',
    site: [{ src: siteMetricStrip, alt: 'Полоса метрик на сайте' }],
    text: 'Блок «Полоса метрик» — короткие показатели в одну строку внутри текста.',
    admin: { src: adminMetricStrip, alt: 'Блок «Полоса метрик» в админке' },
  },
  {
    title: 'Чек-лист',
    site: [{ src: siteChecklist, alt: 'Чек-лист на сайте' }],
    text: 'Блок «Чек-лист» — заголовок и список пунктов. Для выводов и рекомендаций.',
    admin: { src: adminChecklist, alt: 'Блок «Чек-лист» в админке' },
  },
  {
    title: 'Статистические колонки',
    site: [{ src: siteStatColumns, alt: 'Статистические колонки на сайте' }],
    text: 'Блок «Статистические колонки» — пары «показатель → значение», сгруппированные в колонки.',
    admin: { src: adminStatColumns, alt: 'Блок «Статистические колонки» в админке' },
  },
  {
    title: 'Инфо-колонки',
    site: [{ src: siteInfoColumns, alt: 'Инфо-колонки на сайте' }],
    text: 'Блок «Инфо-колонки» — заголовок и пояснение. Для определений и формул.',
    admin: { src: adminInfoColumns, alt: 'Блок «Инфо-колонки» в админке' },
  },
  {
    title: 'Нумерованные примечания',
    site: [{ src: siteNumberedNotes, alt: 'Нумерованные примечания на сайте' }],
    text: 'Блок «Нумерованные примечания» — пронумерованный список рисков и оговорок.',
    admin: { src: adminNumberedNotes, alt: 'Блок «Нумерованные примечания» в админке' },
  },
  {
    title: 'Рейтинг: радар и таблица',
    site: [
      { src: siteRatingRadar, alt: 'Радар рейтинга на сайте' },
      { src: siteRatingTable, alt: 'Таблица рейтинга на сайте' },
    ],
    text: 'Строятся из одного массива: название блока, вес в процентах, оценка 0–5. Сумма весов — ровно 100%. Если «Балл (0–100)» в шапке заполнен, показывается он, но таблица считает итог из строк — расхождение будет видно читателю. Текст «Заключения» под таблицей берётся из краткого описания аудита.',
    admin: { src: adminRatingBlocks, alt: 'Массив «Рейтинг по методологии 8Blocks» в админке' },
  },
  {
    title: 'Эксперт',
    site: [{ src: siteExpert, alt: 'Карточка эксперта на сайте' }],
    text: 'Имя, должность, фото и ссылка подтягиваются из карточки автора. Выводится внутри блока рейтинга — без заполненного рейтинга её не будет.',
    admin: { src: adminExpert, alt: 'Группа «Эксперт» в админке' },
  },
  {
    title: 'SEO',
    text: 'Видимой части на странице нет: заголовок и описание уходят в поисковую выдачу и превью ссылки. Пустые поля заменяются заголовком и кратким описанием аудита, пустое OG-изображение — обложкой.',
    admin: { src: adminSeo, alt: 'Группа «SEO» в админке' },
  },
  {
    title: 'Публикация',
    text: 'Аудит появляется в каталоге, когда флаг «Скрыто» выключен. Включённый флаг убирает его из каталога, sitemap и публичной ссылки. Флаг «Закрепить в начале» поднимает запись наверх каталога, остальные идут от новой даты к старой.',
  },
]

function Figure({ shot, caption }: { shot: Shot; caption: string }) {
  return (
    <figure className={styles.figure}>
      <Image className={styles.image} src={shot.src} alt={shot.alt} unoptimized />
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  )
}

export default function AuditsGuidePage() {
  if (!IS_STAGING) notFound()

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <p className={styles.label}>Инструкция редактора</p>
        <h1 className={styles.title}>Публичные аудиты: что где заполняется</h1>
        <p className={styles.intro}>
          Порядок — сверху вниз по странице аудита. Сначала как выглядит на сайте, затем где это
          заполняется в админке. Примеры сняты с аудита «Аудит токеномики Hyperliquid ($HYPE)».
        </p>
      </header>

      {SECTIONS.map((section) => (
        <section key={section.title} className={styles.section}>
          <h2 className={styles.sectionTitle}>{section.title}</h2>

          {section.site?.map((shot) => (
            <Figure key={shot.alt} shot={shot} caption="На сайте" />
          ))}

          <p className={styles.text}>{section.text}</p>

          {section.admin && <Figure shot={section.admin} caption="В админке" />}
        </section>
      ))}
    </article>
  )
}
