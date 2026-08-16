/* eslint-disable @next/next/no-img-element -- скриншоты произвольных размеров, оптимизация не нужна */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import styles from './AuditsGuide.module.scss'

const IS_STAGING = process.env.NEXT_PUBLIC_STAGING === 'true'
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''
const IMG = `${BASE_PATH}/staging-docs/audits-guide`

export const metadata: Metadata = {
  title: 'Публичные аудиты: что где заполняется',
  robots: { index: false, follow: false, nocache: true },
}

interface Section {
  title: string
  site?: { src: string; alt: string }[]
  text: string
  admin?: { src: string; alt: string }
}

const SECTIONS: Section[] = [
  {
    title: 'Карточка в каталоге /audits',
    site: [{ src: 'site-card.png', alt: 'Карточка аудита в каталоге' }],
    text: 'Обложка, дата публикации, заголовок и краткое описание. Описание обрезается — главное ставьте в первое предложение. Без обложки подставляется абстрактная заглушка.',
    admin: { src: 'admin-basics.png', alt: 'Основные поля аудита в админке' },
  },
  {
    title: 'Шапка страницы',
    site: [{ src: 'site-hero.png', alt: 'Шапка аудита на сайте' }],
    text: 'Тикер (биржевое обозначение токена, например $HYPE), ссылка на сайт проекта, описание, буквенный рейтинг и балл. Дата над заголовком берётся из поля «Дата публикации», кнопка PDF появляется сама. Поля «Компания» и «Стандарт» на странице не выводятся.',
    admin: { src: 'admin-hero.png', alt: 'Группа «Шапка (Hero)» в админке' },
  },
  {
    title: 'Метрики под шапкой',
    site: [{ src: 'site-hero-metrics.png', alt: 'Лента метрик на сайте' }],
    text: 'Значения выводятся как есть — вводите их уже отформатированными ($39.6b, 1.4m). Оптимально 4–6 штук.',
    admin: { src: 'admin-hero-metrics.png', alt: 'Массив «Метрики (Hero)» в админке' },
  },
  {
    title: 'Вердикт, сильная и слабая стороны',
    site: [{ src: 'site-takeaways.png', alt: 'Вердикт и стороны на сайте' }],
    text: 'Три поля из группы «Шапка (Hero)»: «Короткий вердикт», «Сильная сторона (+)», «Слабая сторона (−)». Читаются подряд, поэтому каждое — законченная мысль в 1–2 предложения.',
    admin: { src: 'admin-hero.png', alt: 'Поля вердикта в группе «Шапка (Hero)»' },
  },
  {
    title: 'Оглавление',
    site: [{ src: 'site-toc.png', alt: 'Оглавление на сайте' }],
    text: 'Собирается автоматически из заголовков H2 и H3 в поле «Содержание». Появляется, если заголовков два и больше.',
  },
  {
    title: 'Графики',
    site: [{ src: 'site-chart-row.png', alt: 'Графики на сайте' }],
    text: 'Блок «Ряд графиков» — до трёх графиков в строке. Для кольца и столбцов заполняется «Значение (столбцы / кольцо)» и цвет сегмента; для линии и области сначала добавьте «Серии», затем в каждой точке — по значению на серию. Подпись графика выводится под ним — указывайте в ней источник данных.',
    admin: { src: 'admin-chart-row.png', alt: 'Блок «Ряд графиков» в админке' },
  },
  {
    title: 'Таблица',
    site: [{ src: 'site-table.png', alt: 'Таблица на сайте' }],
    text: 'Блок «Таблица»: строка заголовков и строки ячеек. Держите 3–5 колонок — на мобильных таблица прокручивается горизонтально.',
    admin: { src: 'admin-table.png', alt: 'Блок «Таблица» в админке' },
  },
  {
    title: 'Полоса метрик',
    site: [{ src: 'site-metric-strip.png', alt: 'Полоса метрик на сайте' }],
    text: 'Блок «Полоса метрик» — короткие показатели в одну строку внутри текста.',
    admin: { src: 'admin-metric-strip.png', alt: 'Блок «Полоса метрик» в админке' },
  },
  {
    title: 'Чек-лист',
    site: [{ src: 'site-checklist.png', alt: 'Чек-лист на сайте' }],
    text: 'Блок «Чек-лист» — заголовок и список пунктов. Для выводов и рекомендаций.',
    admin: { src: 'admin-checklist.png', alt: 'Блок «Чек-лист» в админке' },
  },
  {
    title: 'Статистические колонки',
    site: [{ src: 'site-stat-columns.png', alt: 'Статистические колонки на сайте' }],
    text: 'Блок «Статистические колонки» — пары «показатель → значение», сгруппированные в колонки.',
    admin: { src: 'admin-stat-columns.png', alt: 'Блок «Статистические колонки» в админке' },
  },
  {
    title: 'Инфо-колонки',
    site: [{ src: 'site-info-columns.png', alt: 'Инфо-колонки на сайте' }],
    text: 'Блок «Инфо-колонки» — заголовок и пояснение. Для определений и формул.',
    admin: { src: 'admin-info-columns.png', alt: 'Блок «Инфо-колонки» в админке' },
  },
  {
    title: 'Нумерованные примечания',
    site: [{ src: 'site-numbered-notes.png', alt: 'Нумерованные примечания на сайте' }],
    text: 'Блок «Нумерованные примечания» — пронумерованный список рисков и оговорок.',
    admin: { src: 'admin-numbered-notes.png', alt: 'Блок «Нумерованные примечания» в админке' },
  },
  {
    title: 'Рейтинг: радар и таблица',
    site: [
      { src: 'site-rating-radar.png', alt: 'Радар рейтинга на сайте' },
      { src: 'site-rating-table.png', alt: 'Таблица рейтинга на сайте' },
    ],
    text: 'Строятся из одного массива: название блока, вес в процентах, оценка 0–5. Сумма весов — ровно 100%. Если «Балл (0–100)» в шапке заполнен, показывается он, но таблица считает итог из строк — расхождение будет видно читателю. Текст «Заключения» под таблицей берётся из краткого описания аудита.',
    admin: { src: 'admin-rating-blocks.png', alt: 'Массив «Рейтинг по методологии 8Blocks» в админке' },
  },
  {
    title: 'Эксперт',
    site: [{ src: 'site-expert.png', alt: 'Карточка эксперта на сайте' }],
    text: 'Имя, должность, фото и ссылка подтягиваются из карточки автора. Выводится внутри блока рейтинга — без заполненного рейтинга её не будет.',
    admin: { src: 'admin-expert.png', alt: 'Группа «Эксперт» в админке' },
  },
  {
    title: 'SEO',
    text: 'Видимой части на странице нет: заголовок и описание уходят в поисковую выдачу и превью ссылки. Пустые поля заменяются заголовком и кратким описанием аудита, пустое OG-изображение — обложкой.',
    admin: { src: 'admin-seo.png', alt: 'Группа «SEO» в админке' },
  },
  {
    title: 'Публикация',
    text: 'Аудит появляется в каталоге, когда флаг «Скрыто» выключен. Включённый флаг убирает его из каталога, sitemap и публичной ссылки. Флаг «Закрепить в начале» поднимает запись наверх каталога, остальные идут от новой даты к старой.',
  },
]

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

          {section.site?.map((image) => (
            <figure key={image.src} className={styles.figure}>
              <img className={styles.image} src={`${IMG}/${image.src}`} alt={image.alt} loading="lazy" />
              <figcaption className={styles.caption}>На сайте</figcaption>
            </figure>
          ))}

          <p className={styles.text}>{section.text}</p>

          {section.admin && (
            <figure className={styles.figure}>
              <img
                className={styles.image}
                src={`${IMG}/${section.admin.src}`}
                alt={section.admin.alt}
                loading="lazy"
              />
              <figcaption className={styles.caption}>В админке</figcaption>
            </figure>
          )}
        </section>
      ))}
    </article>
  )
}
