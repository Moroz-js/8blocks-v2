import { t } from '@/shared/i18n'
import type {
  ArchetypeId,
  DimensionResult,
} from '@/shared/lib/platform/tokenlab/scoringV3'
import type { StandardBucketKey } from '@/shared/lib/platform/tokenlab/types'

export const copy = t({
  ru: {
    steps: {
      basics: 'Основы',
      allocation: 'Распределение',
      vesting: 'Вестинг',
      results: 'Результаты',
    },
    basics: {
      template: 'Начните с шаблона',
      templateHint:
        'Шаблоны заполняют распределение и вестинг проверенными значениями. Все параметры можно изменить.',
      tokenName: 'Название токена',
      tokenPlaceholder: 'Например, Demo Protocol',
      ticker: 'Тикер',
      tickerPlaceholder: 'Например, DEMO',
      totalSupply: 'Общая эмиссия',
      customSupply: 'Своя эмиссия',
      tokens: 'токенов',
    },
    allocation: {
      total: 'Распределено',
      remove: 'Уберите {value}%, чтобы сбалансировать модель.',
      remaining: 'Распределите оставшиеся {value}%, чтобы продолжить.',
      auto: 'Сбалансировать до 100%',
      toggle: 'Переключить бакет',
    },
    vesting: {
      tge: 'Unlock на TGE',
      cliff: 'Клифф',
      duration: 'Вестинг',
      month: 'мес.',
      hint: 'Токены TGE разблокируются при запуске. Остаток распределяется линейно после клиффа.',
    },
    navigation: {
      allocateFirst: 'Сначала распределите 100%',
      continueAllocation: 'К распределению',
      backBasics: 'Основы',
      continueVesting: 'К вестингу',
      backAllocation: 'Распределение',
      run: 'Запустить структурный анализ',
      adjust: 'Изменить модель',
      startFresh: 'Начать заново',
    },
    banners: {
      invalid:
        'Ссылка содержит неполную или повреждённую модель. Открыта новая безопасная модель.',
      fork:
        'Распределение и вестинг восстановлены по опубликованным условиям проекта. Это структурная оценка на референсной эмиссии 1 млрд токенов — параметры можно изменить.',
      restored: 'Черновик восстановлен с прошлого визита',
      dismiss: 'Закрыть',
    },
    preview: {
      allocation: 'распределение',
      liveScore: 'Текущий score',
      supply: 'Эмиссия',
      insider: 'Доля инсайдеров',
      tgeFloat: 'Float на TGE',
      unlockPreview: 'Предпросмотр unlock',
      pressure: 'Давление за 12 мес.',
      peak: 'Пиковый unlock',
      spikes: 'Пиковые месяцы',
    },
    results: {
      structureScore: 'Structure Score',
      scoredAs: 'Тип модели',
      archetypeNote:
        'Нормы зависят от типа запуска: одинаковая доля сообщества и инсайдеров оценивается по-разному.',
      pressure: 'Давление unlock за 12 мес.',
      supply: 'Эмиссия',
      download: 'Скачать PDF-отчёт',
      preparing: 'Готовим…',
      copyLink: 'Скопировать ссылку',
      copied: 'Ссылка скопирована ✓',
      emailPlaceholder: 'Email для отчёта (необязательно)',
      emailAria: 'Email для отчёта',
      send: 'Отправить',
      sending: 'Отправляем…',
      reportDone:
        'Отчёт скачан ✓ — отправим экспертные комментарии на указанный email.',
      dimensions: 'Пять измерений',
      fixes: 'Главные улучшения',
      points: 'баллов',
      market: 'Ваша модель и рыночные нормы',
      benchmarks: 'Все бенчмарки и ведущие проекты →',
      norm: 'норма',
      within: 'в норме',
      unlockSchedule: 'График разблокировок',
      disclaimer:
        'Структурный анализ оценивает график предложения, но не спрос, продукт или цену. Не является инвестиционной рекомендацией.',
    },
    cta: {
      label: 'Следующий шаг',
      auditPrice: 'ОТ $5 000',
      auditTitle: 'Аудит токеномики',
      auditText:
        'Полная оценка экономики токена: структурные риски, стимулы, спрос и сравнение с рынком.',
      auditAction: 'Запросить аудит',
      workshopPrice: '$2 500',
      workshopTitle: 'Воркшоп по токеномике',
      workshopText:
        'Рабочая сессия с консультантами 8Blocks: проверим модель под нагрузкой и составим план улучшений.',
      workshopAction: 'Забронировать воркшоп',
      sprintPrice: '$299 НА СТАРТЕ · WAITLIST',
      sprintTitle: 'AI Token Model Sprint',
      sprintText:
        'Пересоберём модель по методологии 8Blocks и подготовим письменный отчёт за 48 часов.',
      waitlist: 'В лист ожидания',
      done: 'Вы в списке. Напишем, когда появится место. Сейчас ничего оплачивать не нужно.',
      email: 'you@project.com',
      project: 'Название проекта (необязательно)',
      error: 'Не удалось отправить. Попробуйте ещё раз.',
      privacy: 'Только заявка на ранний доступ — без оплаты.',
      stage: 'Стадия',
      timeline: 'Сроки',
      heard: 'Как вы узнали о нас',
      stageOptions: ['До TGE', 'После TGE', 'Изучаем'],
      timelineOptions: ['В этом месяце', 'В этом квартале', 'Через 6+ месяцев'],
      heardOptions: [
        'Google',
        'AI-ассистенты',
        'X / Twitter',
        'Telegram',
        'Рекомендация',
        'Другое',
      ],
    },
  },
  en: {
    steps: {
      basics: 'Basics',
      allocation: 'Allocation',
      vesting: 'Vesting',
      results: 'Results',
    },
    basics: {
      template: 'Start from a template',
      templateHint:
        'Templates prefill allocations and vesting with defensible defaults. Everything stays editable.',
      tokenName: 'Token name',
      tokenPlaceholder: 'e.g. Demo Protocol',
      ticker: 'Ticker',
      tickerPlaceholder: 'e.g. DEMO',
      totalSupply: 'Total supply',
      customSupply: 'Custom total supply',
      tokens: 'tokens',
    },
    allocation: {
      total: 'Total allocated',
      remove: 'Remove {value}% to balance the model.',
      remaining: 'Distribute the remaining {value}% to continue.',
      auto: 'Auto-balance to 100%',
      toggle: 'Toggle bucket',
    },
    vesting: {
      tge: 'TGE unlock',
      cliff: 'Cliff',
      duration: 'Vesting',
      month: 'mo',
      hint: 'TGE tokens unlock at launch. The remainder vests linearly after the cliff.',
    },
    navigation: {
      allocateFirst: 'Allocate 100% first',
      continueAllocation: 'Continue to allocation',
      backBasics: 'Basics',
      continueVesting: 'Continue to vesting',
      backAllocation: 'Allocation',
      run: 'Run structural analysis',
      adjust: 'Adjust the model',
      startFresh: 'Start fresh',
    },
    banners: {
      invalid:
        'The link contains an incomplete or corrupted model. A clean safe model was opened.',
      fork:
        'Allocation and vesting were reconstructed from the project’s published terms. This is a structural approximation on a 1B reference supply and remains editable.',
      restored: 'Draft restored from your last visit',
      dismiss: 'Dismiss',
    },
    preview: {
      allocation: 'allocation',
      liveScore: 'Live score',
      supply: 'Supply',
      insider: 'Insider share',
      tgeFloat: 'TGE float',
      unlockPreview: 'Unlock preview',
      pressure: '12m pressure',
      peak: 'Peak unlock',
      spikes: 'Spike months',
    },
    results: {
      structureScore: 'Structure score',
      scoredAs: 'Scored as',
      archetypeNote:
        'Norms differ per launch type: the same community and insider float scores differently.',
      pressure: '12m unlock pressure',
      supply: 'Supply',
      download: 'Download PDF report',
      preparing: 'Preparing…',
      copyLink: 'Copy share link',
      copied: 'Link copied ✓',
      emailPlaceholder: 'Optional: email me this report',
      emailAria: 'Email for the report',
      send: 'Send',
      sending: 'Sending…',
      reportDone:
        'Report downloaded ✓ — we’ll follow up by email with expert notes.',
      dimensions: 'Five dimensions',
      fixes: 'Top fixes',
      points: 'pts',
      market: 'Your model vs market norms',
      benchmarks: 'Full benchmarks and top projects →',
      norm: 'norm',
      within: 'within',
      unlockSchedule: 'Unlock schedule',
      disclaimer:
        'Structure-only analysis measures the supply schedule, not demand, product or price. Not investment advice.',
    },
    cta: {
      label: 'Where to go from here',
      auditPrice: 'FROM $5,000',
      auditTitle: 'Tokenomics Audit',
      auditText:
        'Full assessment of your token economy: structural risks, incentive loops, demand modeling and benchmarking.',
      auditAction: 'Request audit',
      workshopPrice: '$2,500',
      workshopTitle: 'Tokenomics Workshop',
      workshopText:
        'A working session with 8Blocks consultants to pressure-test your economy and roadmap the fixes.',
      workshopAction: 'Book the workshop',
      sprintPrice: '$299 AT LAUNCH · WAITLIST',
      sprintTitle: 'AI Token Model Sprint',
      sprintText:
        'Your model rebuilt with the 8Blocks methodology and a written report in 48 hours.',
      waitlist: 'Join the waitlist',
      done: 'You’re on the list. We’ll reach out when a spot opens. Nothing is charged now.',
      email: 'you@project.com',
      project: 'Project name (optional)',
      error: 'Something went wrong. Try again.',
      privacy: 'Early access request only — no payment now.',
      stage: 'Stage',
      timeline: 'Timeline',
      heard: 'How did you hear about us',
      stageOptions: ['Pre-TGE', 'Post-TGE', 'Exploring'],
      timelineOptions: ['This month', 'This quarter', '6+ months'],
      heardOptions: [
        'Google search',
        'AI assistants',
        'X / Twitter',
        'Telegram',
        'Referral',
        'Other',
      ],
    },
  },
})

export const templateCopy = t<Record<string, readonly [string, string]>>({
  ru: {
    'vc-backed': ['С венчурным раундом', 'Инвесторы и длинные блокировки команды'],
    'community-led': ['Ориентация на сообщество', 'Большая доля сообщества и минимум инсайдеров'],
    'fair-launch': ['Fair launch', 'Без раунда инвесторов, широкое распределение с первого дня'],
    'utility-enterprise': ['Utility / Enterprise', 'Продуктовая модель с экосистемой и казначейством'],
  },
  en: {
    'vc-backed': ['VC-backed', 'Classic venture path with long team locks'],
    'community-led': ['Community-led', 'Majority to community, small insider share'],
    'fair-launch': ['Fair launch', 'No investor round, wide distribution from day one'],
    'utility-enterprise': ['Utility / Enterprise', 'Product-first token with ecosystem and treasury'],
  },
})

export const bucketCopy = t({
  ru: {
    team: ['Команда', 'Инсайдеры'],
    investors: ['Инвесторы', 'Инсайдеры'],
    community: ['Сообщество', 'Публичное'],
    ecosystem: ['Экосистема', 'Публичное'],
    treasury: ['Казначейство', 'Протокол'],
    liquidity: ['Ликвидность', 'Рынок'],
    foundation: ['Фонд', 'Протокол'],
    publicSale: ['Публичная продажа', 'Публичное'],
  },
  en: {
    team: ['Team', 'Insiders'],
    investors: ['Investors', 'Insiders'],
    community: ['Community', 'Public'],
    ecosystem: ['Ecosystem', 'Public'],
    treasury: ['Treasury', 'Protocol'],
    liquidity: ['Liquidity', 'Market'],
    foundation: ['Foundation', 'Protocol'],
    publicSale: ['Public sale', 'Public'],
  },
}) satisfies Record<StandardBucketKey, readonly [string, string]>

export const shapeCopy = t<Record<string, string>>({
  ru: {
    'no-lock': 'Без блокировки',
    'tge10-18m': '10% TGE + 18 мес.',
    'cliff6-2y': 'Клифф 6 мес. + 2 года',
    'cliff12-3y': 'Клифф 1 год + 3 года',
    'tge5-cliff6-2y': '5% TGE + клифф 6 мес. + 2 года',
    'longhaul-4y': 'Долгий график, 4 года',
  },
  en: {
    'no-lock': 'No lock',
    'tge10-18m': '10% TGE + 18m linear',
    'cliff6-2y': '6m cliff + 2y linear',
    'cliff12-3y': '1y cliff + 3y linear',
    'tge5-cliff6-2y': '5% TGE + 6m cliff + 2y',
    'longhaul-4y': 'Long-haul 4y',
  },
})

const scoreCopy = t({
  ru: {
    tiers: {
      'Rock Solid': ['Надёжная', 'График предложения поддерживает токен и не создаёт лишнего давления.'],
      Strong: ['Сильная', 'Фундаментально здоровая структура с несколькими понятными точками давления.'],
      'Watch List': ['Требует внимания', 'Рабочая структура, но перед TGE стоит исправить основные риски.'],
      Fragile: ['Хрупкая', 'Структура будет давить на токен из-за размывания и крупных разблокировок.'],
      'Red Flag': ['Красный флаг', 'Не запускайте эту структуру без существенной переработки.'],
    },
    dimensions: {
      community: ['Распределение сообществу', 'Какая доля достаётся пользователям, а не инсайдерам.'],
      float: ['Float первого дня', 'Сколько предложения реально доступно на старте.'],
      overhang: ['Навес предложения', 'Как быстро заблокированное предложение выходит на рынок.'],
      discipline: ['Дисциплина блокировок инсайдеров', 'Достаточны ли клифф и срок вестинга команды и инвесторов.'],
      shock: ['Шок разблокировок', 'Насколько плавно предложение выходит на рынок.'],
    },
    caps: {
      capA: 'Почти ничего не попадает в публичное обращение. Такие структуры исторически создавали критическое давление.',
      capB: 'Более 10% эмиссии команды и инвесторов ликвидны уже в первый день.',
    },
    archetypes: {
      full_float: ['Полный float', 'Почти всё предложение доступно в первый день: нет навеса, но мало долгосрочной мотивации.'],
      community_launch: ['Запуск сообществом', 'Нет значимой доли инвесторов, а предложение ориентировано на сообщество.'],
      vc_backed: ['Венчурный запуск', 'Есть существенная доля инвесторов, поэтому применяются нормы длинных блокировок.'],
      ecosystem_led: ['Экосистемная модель', 'Предложение сосредоточено в экосистемных программах, фонде и казначействе.'],
      balanced: ['Сбалансированная', 'Смешанная структура, оцененная по базовым профессиональным нормам.'],
    },
  },
  en: {
    tiers: {},
    dimensions: {},
    caps: {},
    archetypes: {},
  },
})

export function localizeTier(name: string, meaning: string) {
  const value = (scoreCopy.tiers as Record<string, readonly [string, string]>)[name]
  return value ? { name: value[0], meaning: value[1] } : { name, meaning }
}

export function localizeDimension(dimension: DimensionResult) {
  const value = (
    scoreCopy.dimensions as Partial<
      Record<DimensionResult['id'], readonly [string, string]>
    >
  )[dimension.id]
  return value
    ? { name: value[0], description: value[1] }
    : { name: dimension.name, description: dimension.oneLiner }
}

export function localizeArchetype(
  id: ArchetypeId,
  label: string,
  explanation: string,
) {
  const value = (
    scoreCopy.archetypes as Partial<
      Record<ArchetypeId, readonly [string, string]>
    >
  )[id]
  return value
    ? { label: value[0], explanation: value[1] }
    : { label, explanation }
}

export function localizeCap(id: 'capA' | 'capB', fallback: string) {
  return (scoreCopy.caps as Partial<Record<'capA' | 'capB', string>>)[id] ?? fallback
}

export function localizeFix(label: string) {
  if (t({ ru: true, en: false }) === false) return label
  return label
    .replace('Add a 12-month cliff to the team bucket', 'Добавить команде клифф 12 месяцев')
    .replace('Add a 12-month cliff to the investor bucket', 'Добавить инвесторам клифф 12 месяцев')
    .replace('Extend team vesting to 36 months total', 'Увеличить вестинг команды до 36 месяцев')
    .replace('Extend investor vesting to 36 months total', 'Увеличить вестинг инвесторов до 36 месяцев')
    .replace('Remove the team TGE unlock', 'Убрать разблокировку команды на TGE')
    .replace('Remove the investor TGE unlock', 'Убрать разблокировку инвесторов на TGE')
    .replace(
      'Raise the community TGE unlock so ~15% of supply is tradable at launch',
      'Увеличить unlock сообщества на TGE, чтобы около 15% эмиссии торговалось на старте',
    )
}
