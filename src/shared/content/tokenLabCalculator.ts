import { t } from '@/shared/i18n'

export const tokenLabCalculator = t({
  ru: {
    meta: {
      title: 'Tokenomics Calculator и Structure Score | 8Blocks',
      description:
        'Смоделируйте распределение и вестинг токена, найдите давление продаж и получите Structure Score. Бесплатно, без регистрации, с PDF-экспортом.',
      ogTitle: 'Tokenomics Calculator — проверьте токеномику до запуска',
      ogDescription:
        '8 бакетов, график разблокировок, Structure Score и конкретные улучшения модели.',
    },
    hero: {
      eyebrow: 'Бесплатно · без регистрации · работает в браузере',
      title: 'Найдите красные флаги токеномики, пока их ещё дёшево исправить.',
      description:
        'Задайте распределение и вестинг. Structure Score покажет, где предложение создаёт давление продаж и какое исправление даст максимальный эффект.',
    },
    toolLabel: 'Tokenomics Calculator',
    toolNote: 'Бесплатно · без регистрации · данные остаются в браузере',
    how: {
      label: 'Как это работает',
      title: 'Три шага до структурированной модели токена.',
      items: [
        {
          title: 'Задайте токен и распределение',
          text: 'Введите название, тикер и эмиссию. Распределите 100% предложения между восемью стандартными бакетами.',
        },
        {
          title: 'Настройте графики вестинга',
          text: 'Задайте unlock на TGE, клифф и линейный вестинг для каждого бакета. Пики видны сразу на графике.',
        },
        {
          title: 'Получите Structure Score',
          text: 'Проверьте float первого дня, навес предложения, блокировки инсайдеров и шоки разблокировок. Скачайте PDF или передайте модель на аудит.',
        },
      ],
    },
    covers: {
      label: 'Что анализирует Token Lab',
      title: 'Всё необходимое для первичной проверки токен-дизайна.',
      items: [
        {
          title: '8 бакетов распределения',
          text: 'Команда, инвесторы, сообщество, экосистема, казначейство, ликвидность, фонд и публичная продажа.',
        },
        {
          title: 'Динамический график unlock',
          text: 'Полный горизонт разблокировок с предупреждениями о концентрации предложения по месяцам.',
        },
        {
          title: 'Structure Score 0–100',
          text: 'Пять измерений структурного давления с учётом типа запуска: от community launch до VC-backed.',
        },
        {
          title: 'Детекция рисков',
          text: 'Флаги, когда один месяц разблокирует более 3% эмиссии или 10% текущего обращения.',
        },
        {
          title: 'PDF и shared-модель',
          text: 'Брендированный отчёт и ссылка на модель, которую можно открыть, изменить и обсудить с командой.',
        },
        {
          title: 'Без регистрации и оплаты',
          text: 'Все расчёты выполняются в браузере. Черновик сохраняется локально на вашем устройстве.',
        },
      ],
    },
    layers: {
      label: 'От самостоятельной проверки к экспертизе',
      title: 'Token Lab — первый слой. Аудит идёт глубже.',
      description:
        'Калькулятор проверяет структуру предложения. Полный аудит добавляет моделирование спроса, продуктовую логику, стимулы и конкурентный контекст.',
      self: {
        tag: 'Самостоятельно',
        title: '8Blocks Token Lab',
        text: 'Распределение, вестинг, Structure Score, benchmark-сравнение и PDF. Бесплатно и мгновенно.',
      },
      expert: {
        tag: 'Экспертный слой',
        title: 'Аудит и стратегия токеномики',
        text: 'Модель спроса, продуктовый fit, система стимулов, сценарный анализ и рекомендации консультантов 8Blocks.',
      },
    },
    readiness: {
      label: 'Другой сценарий',
      title: 'Оцифровываете активы вне криптоиндустрии?',
      text: 'Пройдите трёхминутную оценку готовности к токенизации и получите честный вердикт — включая «пока рано».',
      action: 'Оценить готовность к токенизации →',
    },
    faq: {
      title: 'FAQ',
      items: [
        {
          question: 'Token Lab бесплатный?',
          answer:
            'Да. Калькулятор полностью бесплатный, работает в браузере и не требует регистрации или подключения кошелька.',
        },
        {
          question: 'Что такое Structure Score?',
          answer:
            'Это оценка структурного давления продаж от 0 до 100 по пяти измерениям: распределение сообществу, float первого дня, навес предложения, блокировки инсайдеров и шок разблокировок. Нормы зависят от типа запуска.',
        },
        {
          question: 'Что считается пиком разблокировки?',
          answer:
            'Пик фиксируется, когда unlock за месяц превышает 3% общей эмиссии или 10% предложения, находившегося в обращении до события.',
        },
        {
          question: 'Сколько бакетов можно настроить?',
          answer:
            'В модели восемь стандартных бакетов. Любой из них можно отключить, а для активных отдельно настроить распределение и вестинг.',
        },
        {
          question: 'Можно поделиться моделью и экспортировать её?',
          answer:
            'Да. Token Lab создаёт URL с компактным состоянием модели и брендированный PDF-отчёт со Structure Score, рисками, распределением и графиком разблокировок.',
        },
        {
          question: 'Заменяет ли калькулятор аудит токеномики?',
          answer:
            'Нет. Он оценивает структуру предложения, но не моделирует спрос, продуктовую ценность, поведение пользователей и правовые ограничения. Для этого нужен полный аудит.',
        },
      ],
    },
  },
  en: {
    meta: {
      title: 'Tokenomics Calculator & Structure Score | 8Blocks',
      description:
        'Model token allocations and vesting, find sell pressure and get a Structure Score. Free, no signup, with PDF export.',
      ogTitle: 'Tokenomics Calculator — catch risks before launch',
      ogDescription:
        'Eight buckets, unlock chart, Structure Score and impact-ranked fixes.',
    },
    hero: {
      eyebrow: 'Free · no signup · runs in your browser',
      title: 'Catch the red flags in your tokenomics while they are still cheap to fix.',
      description:
        'Map allocations and vesting. Structure Score shows where supply creates sell pressure and which fix matters most.',
    },
    toolLabel: 'Tokenomics Calculator',
    toolNote: 'Free · no signup · your data stays in the browser',
    how: {
      label: 'How it works',
      title: 'Three steps to a structured token model.',
      items: [
        {
          title: 'Set token basics and allocation',
          text: 'Enter the name, ticker and supply. Allocate 100% across eight standard buckets.',
        },
        {
          title: 'Configure vesting schedules',
          text: 'Set TGE unlock, cliff and linear vesting per bucket. See concentrated unlocks immediately.',
        },
        {
          title: 'Get your Structure Score',
          text: 'Check day-one float, supply overhang, insider locks and unlock shock. Export a PDF or send the model for audit.',
        },
      ],
    },
    covers: {
      label: 'What Token Lab covers',
      title: 'Everything needed for a first-pass token design review.',
      items: [
        {
          title: 'Eight allocation buckets',
          text: 'Team, investors, community, ecosystem, treasury, liquidity, foundation and public sale.',
        },
        {
          title: 'Dynamic unlock chart',
          text: 'Full unlock horizon with warnings for concentrated monthly supply events.',
        },
        {
          title: 'Structure Score 0–100',
          text: 'Five sell-pressure dimensions judged against your launch archetype, from community to VC-backed.',
        },
        {
          title: 'Risk signal detection',
          text: 'Flags when one month unlocks more than 3% of supply or 10% of prior circulating supply.',
        },
        {
          title: 'PDF and shared model',
          text: 'A branded report and a link your team can open, edit and discuss.',
        },
        {
          title: 'No signup, no cost',
          text: 'Calculations run in your browser and the draft is stored locally on your device.',
        },
      ],
    },
    layers: {
      label: 'Self-serve to expert',
      title: 'Token Lab is the first layer. The audit goes deeper.',
      description:
        'The calculator tests supply structure. A full audit adds demand modeling, product logic, incentives and competitive context.',
      self: {
        tag: 'Self-serve',
        title: '8Blocks Token Lab',
        text: 'Allocation, vesting, Structure Score, benchmarks and PDF. Free and instant.',
      },
      expert: {
        tag: 'Expert layer',
        title: 'Tokenomics Audit and Strategy',
        text: 'Demand model, product fit, incentives, scenario analysis and recommendations from 8Blocks consultants.',
      },
    },
    readiness: {
      label: 'Another use case',
      title: 'Digitizing assets outside crypto?',
      text: 'Take the three-minute tokenization readiness assessment for an honest verdict — including “not yet”.',
      action: 'Assess tokenization readiness →',
    },
    faq: {
      title: 'FAQ',
      items: [
        {
          question: 'Is Token Lab free?',
          answer:
            'Yes. The calculator is completely free, runs in the browser and requires no signup or wallet.',
        },
        {
          question: 'What is the Structure Score?',
          answer:
            'It is a 0–100 structural sell-pressure score across community allocation, day-one float, supply overhang, insider lock discipline and unlock shock. Norms adapt to the launch archetype.',
        },
        {
          question: 'What counts as an unlock spike?',
          answer:
            'A spike is flagged when one month unlocks more than 3% of total supply or 10% of the supply circulating before the event.',
        },
        {
          question: 'How many buckets can I configure?',
          answer:
            'The model has eight standard buckets. Any bucket can be disabled, and each active bucket has independent allocation and vesting settings.',
        },
        {
          question: 'Can I share and export the model?',
          answer:
            'Yes. Token Lab creates a compact shared URL and a branded PDF report with Structure Score, risks, allocation and the unlock schedule.',
        },
        {
          question: 'Does the calculator replace a tokenomics audit?',
          answer:
            'No. It evaluates supply structure but not demand, product value, user behavior or legal constraints. Those require a full audit.',
        },
      ],
    },
  },
})
