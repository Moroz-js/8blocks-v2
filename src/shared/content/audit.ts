// Audit service page — single source of truth
// Content from requirements.md §5.4
import { t } from '@/shared/i18n'

const localize = <TRu, TEn>(ru: TRu, en: TEn) =>
  t({ ru, en } as { ru: TRu | TEn; en: TRu | TEn }) as TRu | TEn

const ruObject = {
  hero: {
    label: 'Аудит токеномики',
    headline: 'Аудит токеномики',
    description:
      'Проводим глубокий анализ текущей экономической модели токена, выявляем слабые места и даем практические рекомендации по ее улучшению.',
    ctaLabel: 'Записаться на консультацию',
    ctaHref: '/contact',
  },
  problem: {
    headline: 'Почему даже готовая токеномика может быть слабой',
    description:
      'Наличие готового документа еще не гарантирует, что модель устойчива, прозрачна и работает на рост вашего проекта.',
    items: [
      {
        title: 'В модели уже есть ошибки в балансе',
        description: 'Они не всегда видны сразу, но начинают работать против проекта.',
      },
      {
        title: 'Токеномика не справляется с ростом',
        description: 'Модель существует, но не выдерживает масштабирования продукта и экосистемы.',
      },
      {
        title: 'Токеномику сложно защитить перед инвесторами',
        description: 'Если модель неясна, доверие к ней быстро падает.',
      },
      {
        title: 'Слабые места замечают слишком поздно',
        description: 'Обычно тогда, когда они уже мешают проекту двигаться дальше.',
      },
    ],
  },
  solution: {
    headline: 'Когда аудит нужен прямо сейчас',
    description:
      'Обычно к аудиту приходят тогда, когда модель уже готова, но перед TGE, инвесторами или рынком на нее страшно опираться.',
    variant: 'audit' as const,
    items: [
      { id: 'sig-1', label: 'Если токеномика уже собрана, а уверенности в ней так и не появилось' },
      { id: 'sig-2', label: 'Если модель есть, но перед инвесторами на нее все равно не хочется опираться' },
      { id: 'sig-3', label: 'Если продукт давно изменился, а токеномика осталась в прошлой версии проекта' },
      { id: 'sig-4', label: 'Если команда чувствует, что в модели что-то не так, но не может точно показать где' },
      { id: 'sig-5', label: 'Если перед токенсейлом хочется убрать слабые места, а не искать их уже после запуска' },
      { id: 'sig-6', label: 'Если хочется заранее понять, что именно в модели может сломать рынок' },
      { id: 'sig-7', label: 'Если токеномика выглядит убедительно, но хочется получить второе подтверждение от эксперта' },
    ],
  },
  whenNeeded: {
    headline: 'Когда аудит нужен прямо сейчас',
    description:
      'Обычно к аудиту приходят тогда, когда модель уже готова, но перед TGE, инвесторами или рынком на нее страшно опираться.',
    items: [
      'Если токеномика уже собрана, а уверенности в ней так и не появилось',
      'Если модель есть, но перед инвесторами на нее все равно не хочется опираться',
      'Если продукт давно изменился, а токеномика осталась в прошлой версии проекта',
      'Если команда чувствует, что в модели что-то не так, но не может точно показать где',
      'Если перед токенсейлом хочется убрать слабые места, а не искать их уже после запуска',
      'Если хочется заранее понять, что именно в модели может сломаться первым',
      'Если токеномика идеальна, но нужно перестраховаться и получить стороннее подтверждение от эксперта',
    ],
  },
  whatWeAnalyze: {
    label: 'Что мы проверяем в модели',
    headline: 'Что мы проверяем в модели',
    description:
      'Мы смотрим не только на саму токеномику, но и на контекст, в котором она должна работать: продукт, бизнес-процессы, рынок и внутреннюю логику проекта.',
    items: [
      {
        title: 'Текущую структуру токеномики',
        description:
          'Проверяем эмиссию, utility, вестинг, распределение пулов и экономические взаимосвязи внутри модели.',
      },
      {
        title: 'Расчеты, прогнозы и сценарии',
        description:
          'Пересматриваем формулы, допущения и ключевые сценарии, чтобы выявить ошибки и слабые места.',
      },
      {
        title: 'Связь модели с целями проекта',
        description:
          'Смотрим, насколько токеномика соответствует логике продукта, метрикам и текущим задачам бизнеса.',
      },
      {
        title: 'Рынок и конкурентов',
        description:
          'Сравниваем модель с лучшими практиками и смотрим, где она уступает рынку, а где дает проекту преимущество.',
      },
      {
        title: 'Критичные бизнес-процессы',
        description:
          'Разбираем детали вместе с CEO, CTO, CFO и другими владельцами процессов, чтобы увидеть риски, которые не видны только по документам.',
      },
    ],
  },
  whatYouGet: {
    headline: 'Что вы получаете на выходе',
    description:
      'Не просто отчет, а ясную картину того, где текущая токеномика теряет устойчивость, прозрачность и доверие инвесторов - и что именно нужно скорректировать, чтобы модель работала на рост проекта, а не требовала постоянной поддержки вручную.',
    ctaLabel: 'Записаться на консультацию',
    ctaHref: '/contact',
    items: [] as const,
  },
  falseAssumptions: {
    headline: 'Аудит часто показывает не ту проблему, которую все искали',
    items: [
      {
        seems: 'Кажется, что модель уже готова',
        reality:
          'На практике аудит показывает, какие части токеномики уже не соответствуют текущему состоянию проекта.',
      },
      {
        seems: 'Кажется, что инвесторы просто не поняли модель',
        reality: 'После аудита становится ясно, где именно токеномика потеряла ясность и доверие.',
      },
      {
        seems: 'Кажется, что продукту просто не хватает маркетинга',
        reality: 'На деле проблема часто не в спросе снаружи, а в слабой экономике внутри модели.',
      },
      {
        seems: 'Кажется, что проблема только в цифрах',
        reality:
          'На деле слабое место часто находится в логике токена, его utility или связи с продуктом.',
      },
      {
        seems: 'Кажется, что распределение собрано нормально',
        reality: 'Проверка показывает, где оно начинает создавать лишнее давление на токен.',
      },
      {
        seems: 'Кажется, что utility работает',
        reality:
          'Но при проверке оказывается, что часть механик не создает ценности, а только усложняет конструкцию.',
      },
    ],
  },
  faq: {
    headline: 'FAQ',
    items: [
      {
        question: 'У нас уже есть токеномика. Зачем нам аудит?',
        answer:
          'Потому что готовая токеномика еще не означает, что на нее можно спокойно опираться. Аудит нужен, когда модель уже собрана, но внутри команды остаются сомнения: выдержит ли она рынок, можно ли ее уверенно показывать инвесторам и не заложены ли в ней проблемы, которые всплывут слишком поздно.',
      },
      {
        question: 'Если модель делали не мы, вы возьметесь?',
        answer:
          'Да. Мы часто подключаемся к токеномикам, которые уже собирались внутри команды или другими подрядчиками. Наша задача не «переписать чужое», а понять, что в модели действительно работает, а что требует пересмотра.',
      },
      {
        question: 'Можно ли прийти на аудит прямо перед токенсейлом?',
        answer:
          'Да, конечно. Это один из самых частых запросов. Перед токенсейлом аудит помогает либо увидеть слабые места модели и понять, что еще требует доработки до выхода в рынок, либо убедиться, что токеномика уже достаточно сильна, чтобы уверенно показывать ее инвесторам, партнерам и другим участникам экосистемы. Это особенно важно в момент, когда цена ошибки уже высока, а времени на пересборку всей модели почти нет.',
      },
      {
        question: 'Вы проверяете, насколько модель вообще понятна инвесторам?',
        answer:
          'Обязательно. Часто вопрос не в самой модели, а в том, насколько ясно читается ее логика снаружи. Если токеномику сложно быстро объяснить и защитить, доверие к ней снижается даже при неплохой внутренней структуре.',
      },
      {
        question: 'Если проект уже изменился, а токеномика осталась старой, аудит это покажет?',
        answer:
          'Такое тоже случается довольно часто. Продукт может уже уйти вперед, а экономика по-прежнему держаться на старой логике. Аудит помогает увидеть этот разрыв и понять, где модель уже не соответствует реальному состоянию проекта.',
      },
      {
        question: 'Что вам нужно от нас на старте?',
        answer:
          'Все, что у вас уже есть по модели: white paper, product deck, текущая токеномика, Excel-файлы, схемы эмиссии и распределения, а также вводные по продукту и экономике токена. При необходимости мы отдельно созваниваемся с ключевыми людьми в команде, чтобы понять проект глубже, чем это видно по одним документам.',
      },
      {
        question: 'Что мы получим на выходе?',
        answer:
          'В результате аудита вы получаете подробный отчет с разбором текущей экономики токена и конкретными рекомендациями. Он помогает увидеть, где модель действительно сильная, где в ней заложены риски и что требует корректировки в первую очередь.',
      },
      {
        question: 'Сколько времени занимает аудит?',
        answer:
          'Обычно от 1 до 2 недель. Все зависит от глубины модели, объема материалов и того, насколько быстро команда подключается к обсуждению деталей.',
      },
      {
        question: 'Можно ли ускорить процесс, если у нас горят сроки?',
        answer:
          'Да. Если команда быстро дает материалы, оперативно отвечает на вопросы и не затягивает со звонками, аудит можно пройти быстрее.',
      },
      {
        question: 'Что не входит в аудит?',
        answer:
          'В аудит не входят юридические услуги, разработка новой токеномики с нуля, смарт-контракты, техническая реализация, маркетинговое продюсирование и отдельное моделирование. Но аудит помогает очень быстро понять, какие из этих направлений действительно нужны проекту дальше.',
      },
      {
        question: 'Если аудит покажет, что модель нужно переделывать почти полностью, это нормально?',
        answer:
          'Да, абсолютно. Это не плохой исход, а полезный. Иногда аудит как раз и нужен для того, чтобы честно понять: здесь достаточно точечных правок, а здесь уже нужна полноценная пересборка. Лучше увидеть это на этапе аудита, чем уже после выхода на рынок.',
      },
    ],
  },
  cta: {
    headline: 'Если у токена нет цели, у проекта нет будущего.',
    ctaLabel: 'Заказать аудит',
    ctaHref: '/contact',
  },
} as const

const enObject = {
  hero: {
    label: 'Tokenomics Audit',
    headline: 'Tokenomics Audit',
    description:
      'We conduct a deep review of your current token economic model, identify weak points, and provide practical improvement recommendations.',
    ctaLabel: 'Book a consultation',
    ctaHref: '/contact',
  },
  problem: {
    headline: 'Why even a completed tokenomics model can still be weak',
    description:
      'Having a finished document does not guarantee that the model is resilient, transparent, or growth-oriented.',
    items: [
      { title: 'Model balance already contains errors', description: 'They are not always obvious at first, but eventually work against the project.' },
      { title: 'Tokenomics does not scale with growth', description: 'The model exists, but cannot support ecosystem and product expansion.' },
      { title: 'Hard to defend in front of investors', description: 'If the model is unclear, confidence drops quickly.' },
      { title: 'Weak points are discovered too late', description: 'Usually when they already block further progress.' },
    ],
  },
  solution: {
    headline: 'When you need an audit right now',
    description:
      'Teams usually request an audit when the model exists, but they still do not trust relying on it before TGE, investor discussions, or market exposure.',
    variant: 'audit' as const,
    items: [
      { id: 'sig-1', label: 'You already built tokenomics, but confidence is still missing' },
      { id: 'sig-2', label: 'You have a model, but still hesitate to rely on it with investors' },
      { id: 'sig-3', label: 'The product evolved, but tokenomics stayed in an old version' },
      { id: 'sig-4', label: 'The team feels something is wrong but cannot pinpoint where' },
      { id: 'sig-5', label: 'Before token sale, you want to remove weak points proactively' },
      { id: 'sig-6', label: 'You need to understand what can break first under market pressure' },
      { id: 'sig-7', label: 'The model looks convincing, but you need expert-side validation' },
    ],
  },
  whenNeeded: {
    headline: 'When you need an audit right now',
    description:
      'Teams usually request an audit when the model exists, but they still do not trust relying on it before TGE, investor discussions, or market exposure.',
    items: [
      'You already built tokenomics, but confidence is still missing',
      'You have a model, but still hesitate to rely on it with investors',
      'The product evolved, but tokenomics stayed in an old version',
      'The team feels something is wrong but cannot pinpoint where',
      'Before token sale, you want to remove weak points proactively',
      'You want to know what can fail first under market pressure',
      'The model seems ideal, but you need an independent expert confirmation',
    ],
  },
  whatWeAnalyze: {
    label: 'What we review in your model',
    headline: 'What we review in your model',
    description:
      'We evaluate not only tokenomics itself, but also the context where it must perform: product, business processes, market realities, and internal project logic.',
    items: [
      {
        title: 'Current tokenomics structure',
        description:
          'We review issuance, utility, vesting, pool allocation, and economic relationships inside the model.',
      },
      {
        title: 'Calculations, forecasts, and scenarios',
        description:
          'We re-check formulas, assumptions, and key scenarios to expose hidden weaknesses.',
      },
      {
        title: 'Model alignment with project goals',
        description:
          'We assess how well tokenomics supports product logic, metrics, and current business priorities.',
      },
      {
        title: 'Market benchmarks and competitors',
        description:
          'We compare against best practices to identify where the model lags behind or creates strategic advantage.',
      },
      {
        title: 'Critical business processes',
        description:
          'We validate details with CEO, CTO, CFO, and process owners to surface risks invisible in documents alone.',
      },
    ],
  },
  whatYouGet: {
    headline: 'What you get in the end',
    description:
      'Not just a report, but a clear picture of where your tokenomics loses resilience, clarity, and investor trust - and what must be corrected first to support growth.',
    ctaLabel: 'Book a consultation',
    ctaHref: '/contact',
    items: [] as const,
  },
  falseAssumptions: {
    headline: 'An audit often reveals a different problem than expected',
    items: [
      {
        seems: 'It seems the model is already complete',
        reality:
          'In practice, the audit shows which parts of tokenomics no longer match the current project state.',
      },
      {
        seems: 'It seems investors just did not understand the model',
        reality: 'After audit, it becomes clear where tokenomics lost clarity and trust.',
      },
      {
        seems: 'It seems the product just needs more marketing',
        reality: 'In many cases, the issue is weak internal economics, not external demand.',
      },
      {
        seems: 'It seems the issue is only in numbers',
        reality: 'Often the weak point is token logic, utility design, or product alignment.',
      },
      {
        seems: 'It seems distribution is structured correctly',
        reality: 'Audit shows where it creates excess sell pressure on the token.',
      },
      {
        seems: 'It seems utility works',
        reality: 'Validation often shows mechanics that add complexity without creating value.',
      },
    ],
  },
  faq: {
    headline: 'FAQ',
    items: [
      {
        question: 'We already have tokenomics. Why do we need an audit?',
        answer:
          'Because a completed model does not always mean it is safe to rely on. Audit is needed when internal doubts remain about market resilience, investor readiness, or hidden structural risks.',
      },
      {
        question: 'Will you audit a model you did not build?',
        answer:
          'Yes. We often review tokenomics built by internal teams or other vendors. Our goal is not to rewrite for the sake of it, but to verify what works and what needs revision.',
      },
      {
        question: 'Can we run an audit right before token sale?',
        answer:
          'Yes, this is one of the most common cases. It helps identify weak points before launch or confirm that the model is strong enough for investors and partners.',
      },
      {
        question: 'Do you evaluate investor clarity of the model?',
        answer:
          'Absolutely. Even a structurally decent model can fail if its logic is hard to explain and defend externally.',
      },
      {
        question: 'If the project changed but tokenomics stayed old, will audit catch it?',
        answer:
          'Yes. This is common. Audit helps identify where economic logic no longer reflects the current product reality.',
      },
      {
        question: 'What do you need from us at kickoff?',
        answer:
          'Everything available: white paper, product deck, current tokenomics, spreadsheets, issuance/allocation schemes, plus product and economics context.',
      },
      {
        question: 'What will we receive as the output?',
        answer:
          'A detailed audit report with concrete recommendations that show strengths, risks, and priority corrections.',
      },
      {
        question: 'How long does the audit take?',
        answer:
          'Usually 1-2 weeks, depending on model depth, material volume, and team response speed.',
      },
      {
        question: 'Can the process be accelerated if deadlines are tight?',
        answer:
          'Yes. Fast access to materials, quick responses, and timely calls can significantly shorten the timeline.',
      },
      {
        question: 'What is not included in the audit scope?',
        answer:
          'Audit excludes legal work, full rebuild from scratch, smart contracts, contractor-side implementation, marketing production, and standalone modeling.',
      },
      {
        question: 'If audit shows the model needs major redesign, is that normal?',
        answer:
          'Yes. That is a useful outcome. It is better to identify major structural gaps during audit than after market launch.',
      },
    ],
  },
  cta: {
    headline: 'If a token has no purpose, the project has no future.',
    ctaLabel: 'Order an audit',
    ctaHref: '/contact',
  },
} as const

export const auditContent = localize(ruObject, enObject)
