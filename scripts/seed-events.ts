import { getPayload } from 'payload'
import type { SanitizedConfig } from 'payload'
import configFromFile from '@payload-config'

const richText = (text: string) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: null,
        children: [{ mode: 'normal', text, type: 'text', style: '', detail: 0, format: 0, version: 1 }],
      },
    ],
    direction: null,
  },
})

async function main() {
  const config = await Promise.resolve(configFromFile as SanitizedConfig | Promise<SanitizedConfig>)
  const payload = await getPayload({ config })
  let created = 0
  let skipped = 0

  async function upsert(
    collection: 'authors' | 'event-cities' | 'event-organizers',
    slug: string,
    data: Record<string, unknown>,
  ) {
    const existing = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0 })
    if (existing.docs[0]) return existing.docs[0]
    created += 1
    return payload.create({ collection, data: data as never })
  }

  const [paris, toronto, newYork] = await Promise.all([
    upsert('event-cities', 'paris', { name: 'Париж', slug: 'paris', country: 'Франция', countryCode: 'FR' }),
    upsert('event-cities', 'toronto', { name: 'Торонто', slug: 'toronto', country: 'Канада', countryCode: 'CA' }),
    upsert('event-cities', 'new-york', { name: 'Нью-Йорк', slug: 'new-york', country: 'США', countryCode: 'US' }),
  ])

  const [eightBlocks, token2049] = await Promise.all([
    upsert('event-organizers', '8blocks', { name: '8Blocks', slug: '8blocks', website: 'https://8blocks.io' }),
    upsert('event-organizers', 'token2049', { name: 'TOKEN2049', slug: 'token2049', website: 'https://www.token2049.com' }),
  ])

  const [anna, michael, dmitry] = await Promise.all([
    upsert('authors', 'anna-tokenomics', {
      name: 'Анна Токеномика',
      slug: 'anna-tokenomics',
      position: 'Tokenomics Lead',
      bio: 'Разрабатывает устойчивые токен-экономики и помогает командам готовиться к запуску.',
      showProfile: true,
      linkedIn: 'https://www.linkedin.com',
    }),
    upsert('authors', 'michael-strategy', {
      name: 'Михаил Стратег',
      slug: 'michael-strategy',
      position: 'Strategy Partner',
      bio: 'Работает на стыке стратегии, продукта и цифровых активов.',
      showProfile: true,
      linkedIn: 'https://www.linkedin.com',
    }),
    upsert('authors', 'dmitry-research', {
      name: 'Дмитрий Исследователь',
      slug: 'dmitry-research',
      position: 'Research Analyst',
      bio: 'Исследует рынки, модели стимулирования и поведение пользователей.',
      showProfile: true,
      linkedIn: 'https://www.linkedin.com',
    }),
  ])

  const media = await payload.find({ collection: 'media', limit: 100, depth: 0 })
  const imageIds = media.docs
    .filter((item) => typeof item.mimeType === 'string' && item.mimeType.startsWith('image/'))
    .slice(0, 4)
    .map((item) => item.id)
  const videoId = media.docs.find((item) => typeof item.mimeType === 'string' && item.mimeType.startsWith('video/'))?.id

  const eventDefinitions = [
    {
      slug: 'paris-tokenomics-meetup-2027',
      data: {
        title: 'Tokenomics Meetup: как строить устойчивую экономику',
        slug: 'paris-tokenomics-meetup-2027',
        format: 'offline',
        startsAt: '2027-05-15T16:00:00.000Z',
        endsAt: '2027-05-15T18:00:00.000Z',
        timezone: 'Europe/Paris',
        city: paris.id,
        venueName: 'Station F',
        address: '5 Parvis Alan Turing, Paris',
        mapsUrl: 'https://maps.google.com/?q=Station+F+Paris',
        mainOrganizer: eightBlocks.id,
        organizers: [eightBlocks.id],
        representatives: [{ person: anna.id, isSpeaker: true, hostRole: 'host' }],
        contentTitle: 'Практика вместо теории',
        content: richText('Разберём ключевые решения для токен-моделей: от распределения до долгосрочной полезности токена.'),
        status: 'published',
        publishedAt: '2026-09-09T00:00:00.000Z',
      },
    },
    {
      slug: 'token2049-roundtable-2027',
      data: {
        title: 'Круглый стол 8Blocks на TOKEN2049',
        slug: 'token2049-roundtable-2027',
        subtitle: 'Партнёры, продуктовые команды и инвесторы — в одном разговоре.',
        format: 'offline',
        featured: true,
        startsAt: '2027-06-10T13:00:00.000Z',
        endsAt: '2027-06-10T15:30:00.000Z',
        timezone: 'America/Toronto',
        city: toronto.id,
        venueName: 'MaRS Discovery District',
        mainOrganizer: token2049.id,
        organizers: [token2049.id, eightBlocks.id],
        representatives: [
          { person: michael.id, isSpeaker: true, hostRole: 'host' },
          { person: anna.id, isSpeaker: true, hostRole: 'cohost' },
        ],
        content: richText('Закрытая дискуссия о том, как Web3-командам связывать ценность продукта и ценность токена.'),
        status: 'published',
        publishedAt: '2026-09-09T00:00:00.000Z',
      },
    },
    {
      slug: 'new-york-web3-breakfast-2027',
      data: {
        title: 'Web3 founders breakfast',
        slug: 'new-york-web3-breakfast-2027',
        format: 'offline',
        startsAt: '2027-07-08T12:00:00.000Z',
        endsAt: '2027-07-08T13:30:00.000Z',
        timezone: 'America/New_York',
        city: newYork.id,
        venueName: 'SoHo House',
        mainOrganizer: eightBlocks.id,
        representatives: [{ person: dmitry.id, isSpeaker: false, hostRole: 'cohost' }],
        content: richText('Неформальная встреча основателей и продуктовых лидеров вокруг цифровых активов.'),
        status: 'published',
        publishedAt: '2026-09-09T00:00:00.000Z',
      },
    },
    {
      slug: 'paris-tokenomics-recap-2026',
      data: {
        title: 'Tokenomics Meetup: итоги и ключевые вопросы',
        slug: 'paris-tokenomics-recap-2026',
        format: 'offline',
        startsAt: '2026-03-18T16:00:00.000Z',
        endsAt: '2026-03-18T18:00:00.000Z',
        timezone: 'Europe/Paris',
        city: paris.id,
        venueName: 'Station F',
        mainOrganizer: eightBlocks.id,
        representatives: [{ person: anna.id, isSpeaker: true, hostRole: 'host' }],
        content: richText('Описание встречи для проверки fallback, если саммари отсутствует.'),
        summary: richText('Саммари: участники обсудили механики полезности токена, связанные с реальными сценариями продукта.'),
        ...(imageIds.length ? { gallery: imageIds } : {}),
        ...(videoId ? { recordingFile: videoId } : { recordingUrl: 'https://www.youtube.com' }),
        status: 'published',
        publishedAt: '2026-03-01T00:00:00.000Z',
      },
    },
    {
      slug: 'toronto-product-token-fit-2026',
      data: {
        title: 'Product-token fit: рабочая сессия',
        slug: 'toronto-product-token-fit-2026',
        format: 'offline',
        startsAt: '2026-02-05T15:00:00.000Z',
        endsAt: '2026-02-05T17:00:00.000Z',
        timezone: 'America/Toronto',
        city: toronto.id,
        venueName: 'MaRS Discovery District',
        mainOrganizer: eightBlocks.id,
        representatives: [{ person: michael.id, isSpeaker: true, hostRole: 'none' }],
        content: richText('Описание прошлой офлайн-встречи. Саммари намеренно не заполнено — на detail должно выводиться описание.'),
        status: 'published',
        publishedAt: '2026-02-01T00:00:00.000Z',
      },
    },
    {
      slug: 'live-token-model-review-2027',
      data: {
        title: 'Live review: токен-модель в прямом эфире',
        slug: 'live-token-model-review-2027',
        format: 'online',
        startsAt: '2027-04-20T15:00:00.000Z',
        endsAt: '2027-04-20T16:30:00.000Z',
        timezone: 'Europe/Moscow',
        platform: 'youtube',
        platformUrl: 'https://youtube.com',
        hostName: 'Анна Токеномика',
        mainOrganizer: eightBlocks.id,
        representatives: [{ person: anna.id, isSpeaker: true, hostRole: 'host' }],
        content: richText('Открытый разбор токен-модели с вопросами от зрителей.'),
        status: 'published',
        publishedAt: '2026-09-09T00:00:00.000Z',
      },
    },
    {
      slug: 'web3-market-outlook-2026',
      data: {
        title: 'Web3 market outlook: что изменилось за квартал',
        slug: 'web3-market-outlook-2026',
        format: 'online',
        startsAt: '2026-04-24T13:00:00.000Z',
        endsAt: '2026-04-24T14:00:00.000Z',
        timezone: 'Europe/Moscow',
        platform: 'zoom',
        platformUrl: 'https://zoom.us',
        hostName: 'Михаил Стратег',
        mainOrganizer: eightBlocks.id,
        representatives: [{ person: michael.id, isSpeaker: true, hostRole: 'host' }],
        content: richText('Описание онлайн-встречи о рынке и динамике цифровых активов.'),
        summary: richText('Саммари: выделили три сценария развития рынка и критерии, по которым их можно проверить.'),
        recordingUrl: 'https://www.youtube.com',
        presentationUrl: 'https://example.com/presentation.pdf',
        status: 'published',
        publishedAt: '2026-04-01T00:00:00.000Z',
      },
    },
    {
      slug: 'research-talk-without-recording-2026',
      data: {
        title: 'Research talk: стимулы и поведение пользователей',
        slug: 'research-talk-without-recording-2026',
        format: 'online',
        startsAt: '2026-01-12T15:00:00.000Z',
        endsAt: '2026-01-12T16:00:00.000Z',
        timezone: 'Europe/Moscow',
        platform: 'x',
        platformUrl: 'https://x.com',
        hostName: 'Дмитрий Исследователь',
        mainOrganizer: eightBlocks.id,
        representatives: [{ person: dmitry.id, isSpeaker: true, hostRole: 'host' }],
        content: richText('Прошедший эфир без записи и без саммари — отображается исходное описание.'),
        status: 'published',
        publishedAt: '2026-01-01T00:00:00.000Z',
      },
    },
    {
      slug: 'event-draft-hidden-from-site',
      data: {
        title: 'Черновик события для проверки доступа',
        slug: 'event-draft-hidden-from-site',
        format: 'online',
        startsAt: '2027-08-10T12:00:00.000Z',
        timezone: 'Europe/Moscow',
        platform: 'zoom',
        content: richText('Этот черновик не должен отображаться на сайте.'),
        status: 'draft',
      },
    },
  ]

  for (const definition of eventDefinitions) {
    const existing = await payload.find({
      collection: 'events',
      where: { slug: { equals: definition.slug } },
      limit: 1,
      depth: 0,
    })
    if (existing.docs[0]) {
      skipped += 1
      continue
    }
    await payload.create({ collection: 'events', data: definition.data as never })
    created += 1
  }

  console.log(`Events seed complete: ${created} created, ${skipped} events already existed.`)
  if (imageIds.length < 4) console.log('Gallery test uses no images: upload at least 4 images to Media and re-run after deleting paris-tokenomics-recap-2026.')
  if (!videoId) console.log('Recording-file test uses a link: upload a video to Media and assign it in the CMS if needed.')
}

main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error('Events seed failed:', error)
    process.exit(1)
  })
