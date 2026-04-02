// Audit service page — single source of truth

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
    headlineLine1: 'Перед запуском лучше услышать неудобные выводы от экспертов.',
    headlineLine2: 'Чем потом от инвесторов и рынка.',
    ctaLabel: 'Записаться на консультацию',
    ctaHref: '/contact',
  },
} as const

const enObject = {
  hero: {
    label: 'Tokenomics audit',
    headline: 'Tokenomics audit',
    description:
      'We run a deep review of the current token model, identify weak spots, and provide practical recommendations on how to improve it',
    ctaLabel: 'Book a consultation',
    ctaHref: '/contact',
  },
  problem: {
    headline: 'A finished token model can still fall apart',
    description:
      "A polished document doesn't guarantee a model that can hold up, earn trust, or support the project as it grows",
    items: [
      {
        title: 'The model already\nhas structural cracks',
        description:
          'They may not be obvious at first, but sooner or later they start pulling the project in the wrong direction',
      },
      {
        title: 'Growth exposes\nthe weak points',
        description:
          'What looks fine in a static model often stops working once the product and ecosystem begin to scale',
      },
      {
        title: "The logic doesn't hold up in investor conversations",
        description: 'If the model is hard to explain, confidence drops fast',
      },
      {
        title: 'The problems surface\ntoo late',
        description: "Usually at the point when they're already slowing the project down",
      },
    ],
  },
  solution: {
    headline: 'When an audit stops being optional',
    description:
      'Most teams come in for an audit when the model is already built, but no one feels fully comfortable relying on it before a TGE, investor conversations, or the market itself',
    variant: 'audit' as const,
    items: [
      { id: 'sig-1', label: "If the tokenomics is already built, but confidence still isn't there" },
      { id: 'sig-2', label: "If the model exists, but you still wouldn't want to stand behind it in front of investors" },
      { id: 'sig-3', label: "If the product has changed, but the tokenomics is still stuck in an older version of the project" },
      { id: 'sig-4', label: "If the team feels something is off in the model, but can't clearly point to where" },
      { id: 'sig-5', label: "If you'd rather fix weak spots before the token sale than discover them after launch" },
      { id: 'sig-6', label: "If you want to know in advance what's most likely to break first" },
      { id: 'sig-7', label: "If the tokenomics looks perfect on paper, but you still want an outside expert view before moving forward" },
    ],
  },
  whenNeeded: {
    headline: 'When an audit stops being optional',
    description:
      'Most teams come in for an audit when the model is already built, but no one feels fully comfortable relying on it before a TGE, investor conversations, or the market itself',
    items: [
      "If the tokenomics is already built, but confidence still isn't there",
      "If the model exists, but you still wouldn't want to stand behind it in front of investors",
      "If the product has changed, but the tokenomics is still stuck in an older version of the project",
      "If the team feels something is off in the model, but can't clearly point to where",
      "If you'd rather fix weak spots before the token sale than discover them after launch",
      "If you want to know in advance what's most likely to break first",
      'If the tokenomics looks perfect on paper, but you still want an outside expert view before moving forward',
    ],
  },
  whatWeAnalyze: {
    label: 'What we review in the model',
    headline: 'What we review in the model',
    description:
      "We don't just look at the tokenomics itself. We look at the context it has to work in: the product, the business processes, the market, and the project's internal logic",
    items: [
      {
        title: 'The current token structure',
        description:
          'We review supply, utility, vesting, pool allocation, and the economic relationships built into the model',
      },
      {
        title: 'Calculations, forecasts, and scenarios',
        description:
          'We revisit the formulas, assumptions, and key scenarios to spot mistakes and weak points',
      },
      {
        title: "How the model fits the project's goals",
        description:
          'We look at how well the tokenomics supports the product logic, the core metrics, and the business priorities right now',
      },
      {
        title: 'The market and competing models',
        description:
          'We compare the model against strong market benchmarks to see where it gives the project an edge and where it falls short',
      },
      {
        title: 'Critical business processes',
        description:
          "We work through the details with the CEO, CTO, CFO, and other process owners to uncover risks that don't show up in the documents alone",
      },
    ],
  },
  whatYouGet: {
    headline: 'What becomes clear after the audit',
    description:
      'You see where the current tokenomics is losing strength, clarity, and investor trust, and what needs to be corrected for the model to support growth instead of constant manual intervention',
    ctaLabel: 'Book a consultation',
    ctaHref: '/contact',
    items: [] as const,
  },
  falseAssumptions: {
    headline: 'An audit often reveals a different problem than the one everyone was looking for',
    items: [
      {
        seems: 'It looks like the model is already finished',
        reality:
          'In practice, the audit shows which parts of the tokenomics no longer match the project in its current form',
      },
      {
        seems: 'It looks like the issue is just in the numbers',
        reality:
          'In reality, the weak spot is often in the token logic, its utility, or the way it connects to the product',
      },
      {
        seems: "It looks like investors simply didn't understand the model",
        reality: 'After the audit, it becomes clear where the tokenomics lost clarity and trust',
      },
      {
        seems: 'It looks like the allocation is fine',
        reality: 'The review shows where it starts creating unnecessary pressure on the token',
      },
      {
        seems: 'It looks like the product just needs better marketing',
        reality: 'In reality, the issue is often not external demand, but weak economics inside the model',
      },
      {
        seems: 'It looks like the utility works',
        reality:
          'But once we test it, it turns out some of the mechanics create no real value and only make the structure more complicated',
      },
    ],
  },
  faq: {
    headline: 'FAQ',
    items: [
      {
        question: 'We already have tokenomics. Why do we need an audit?',
        answer:
          "Because a finished tokenomics model can still fail in real conditions. An audit helps you verify whether the logic is strong enough before the token sale, investor conversations, and market pressure expose weak spots.",
      },
      {
        question: 'Can you audit a model that was not built by your team?',
        answer:
          "Yes. We often audit models built by in-house teams or other advisors. The goal isn't to rewrite everything by default, but to identify what works, what doesn't, and what should be fixed first.",
      },
      {
        question: 'Can we run the audit right before TGE or token sale?',
        answer:
          'Yes. That is one of the most common moments to do it. The audit helps reduce avoidable mistakes before launch, when the cost of being wrong is already high.',
      },
      {
        question: 'Do you assess whether the model is clear to investors?',
        answer:
          'Absolutely. If the logic is hard to explain, trust drops quickly. We check not only the internal math, but also how clearly the model can be defended externally.',
      },
      {
        question: 'Will the audit show if tokenomics no longer matches the product?',
        answer:
          'Yes. This is a frequent case. We identify where the current model is out of sync with product changes and where that mismatch creates risk.',
      },
      {
        question: 'What do you need from us at the start?',
        answer:
          'Any existing materials: white paper, product deck, current token model, spreadsheets, issuance and allocation schemes, plus context on product and business logic.',
      },
      {
        question: 'What do we receive at the end?',
        answer:
          'You receive a structured audit outcome with clear findings, priority weak spots, and practical recommendations on what to improve and in what order.',
      },
      {
        question: 'How long does the audit usually take?',
        answer:
          'Typically 1 to 2 weeks, depending on model complexity, amount of source material, and response speed from the team.',
      },
      {
        question: 'Can the process be accelerated if timing is critical?',
        answer:
          'Yes, in many cases. Fast material sharing and quick alignment sessions usually shorten the timeline.',
      },
      {
        question: "What isn't included in the audit scope?",
        answer:
          'The audit does not include legal services, full tokenomics redevelopment from scratch, smart contract implementation, marketing production, or standalone modeling.',
      },
      {
        question: 'If the audit shows a major rebuild is needed, is that normal?',
        answer:
          'Yes. That is often the most valuable outcome. It is better to discover structural issues before launch than after the market does it for you.',
      },
    ],
  },
  cta: {
    headlineLine1: "Before launch, it's better to hear the hard truth from experts",
    headlineLine2: 'Than to hear it later from investors and the market',
    ctaLabel: 'Book a consultation',
    ctaHref: '/contact',
  },
} as const

export const auditMeta = {
  title: 'Tokenomics Audit',
  description:
    'Full assessment of an existing token economy: structural risks, broken incentive loops, and scaling bottlenecks.',
  ogTitle: 'Tokenomics Audit | 8Blocks',
  ogDescription: 'Comprehensive token economy assessment with structural risks and growth bottlenecks.',
  twitterTitle: 'Tokenomics Audit | 8Blocks',
  twitterDescription: 'Comprehensive review of your existing token economy.',
} as const

export const auditContent = enObject

export const auditZonesContent = {
  ariaLabel: 'What we check',
  zones: [
    {
      title: 'The current token structure',
      description: 'We review supply, utility, vesting, pool allocation, and the economic relationships built into the model.',
    },
    {
      title: 'Calculations, forecasts, and scenarios',
      description: 'We revisit the formulas, assumptions, and key scenarios to spot mistakes and weak points.',
    },
    {
      title: "How the model fits the project's goals",
      description: 'We look at how well the tokenomics supports the product logic, the core metrics, and the business priorities right now.',
    },
    {
      title: 'The market and competing models',
      description: 'We compare the model against strong market benchmarks to see where it gives the project an edge and where it falls short.',
    },
    {
      title: 'Critical business processes',
      description: "We work through the details with the CEO, CTO, CFO, and other process owners to uncover risks that don't show up in the documents alone.",
    },
  ],
} as const
