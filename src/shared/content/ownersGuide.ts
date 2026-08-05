import { lang } from '@/shared/i18n'

const en = {
  meta: {
    title: "The owner's guide: 7 questions before tokenizing an asset | 8Blocks",
    description: 'The seven questions we ask before recommending any digital-asset structure. One page, no email required.',
  },
  label: "The owner's guide",
  title: 'Seven questions to ask before tokenizing an asset.',
  intro: 'The same questions we ask on the first call. If you can answer all seven, you already know whether to proceed.',
  questions: [
    ['What exactly do I own — and is the paper clean?', 'Title, ownership structure, existing encumbrances. Every structure inherits the paperwork underneath it. Unclear title is the most common reason a project should not start.'],
    ['Who would buy the fractions?', 'Name them as channels: your own customers and partners, private investors you can reach, or licensed platforms. An instrument does not create demand — it packages it. If no channel comes to mind, that is the finding.'],
    ['Do the four numbers clear?', 'Fraction price, minimum ticket, likely buyers, cost of structure. If the raise you want cannot absorb the cost of building and running the structure, no technology fixes that arithmetic.'],
    ['What rights would holders actually get?', 'A defined share of income or proceeds — or something more? Operating control, management, and the decision to sell should stay with you unless you deliberately grant more. The split lives in the legal structure, not in a promise.'],
    ['How does my bank fit into this?', 'Existing mortgages and covenants are part of the design brief, not an afterthought. A structure your bank first hears about after issuance is a structure designed wrong.'],
    ['Which jurisdiction governs — and what does it require?', 'The same asset supports different structures in the EU, the US, or MENA. The design is jurisdiction-specific from day one, and your counsel makes the final call.'],
    ['What happens if I do nothing?', 'Sometimes the honest answer is: nothing bad. If the asset finances itself and the owners are patient, waiting is a position too. The instrument is worth building when it solves a problem you actually have this year.'],
  ],
  cta: 'Want these seven answered for your specific asset? The 45-minute call is free.',
  ctaLabel: 'Book a call',
  disclaimer: 'This guide is provided for informational and educational purposes only. It does not constitute investment, financial, legal, or tax advice. The legal classification of any instrument depends on its specific structure and the applicable jurisdiction.',
}

const ru = {
  meta: {
    title: 'Гид владельца: 7 вопросов до токенизации актива | А8А9',
    description: 'Семь вопросов, которые мы задаём до рекомендации любой структуры цифрового актива. Одна страница, без формы и email.',
  },
  label: 'Гид владельца',
  title: 'Семь вопросов до токенизации актива.',
  intro: 'Те же вопросы мы задаём на первом созвоне. Если вы можете ответить на все семь, вы уже понимаете, стоит ли двигаться дальше.',
  questions: [
    ['Чем именно я владею и в порядке ли документы?', 'Право собственности, структура владения, существующие обременения. Любая структура наследует документы, которые лежат под ней. Неясный титул — самая частая причина не начинать проект.'],
    ['Кто купит доли?', 'Назовите каналы: ваши клиенты и партнёры, частные инвесторы, до которых вы можете дотянуться, или лицензированные платформы. Инструмент не создаёт спрос — он его упаковывает. Если ни один канал не приходит в голову, это и есть вывод.'],
    ['Сходятся ли четыре числа?', 'Цена доли, минимальный чек, вероятные покупатели и стоимость структуры. Если нужный объём привлечения не покрывает затраты на создание и работу структуры, технология не исправит эту математику.'],
    ['Какие права реально получат держатели?', 'Определённую долю дохода или выручки от продажи — или что-то большее? Операционный контроль, управление и решение о продаже должны оставаться за вами, если вы сознательно не предоставляете больше. Это разделение живёт в юридической структуре, а не в обещании.'],
    ['Как в эту схему вписывается мой банк?', 'Существующие ипотеки и ковенанты — часть проектного брифа, а не мысль напоследок. Структура, о которой банк узнаёт после выпуска, изначально спроектирована неправильно.'],
    ['Какая юрисдикция применяется и что она требует?', 'Один и тот же актив поддерживает разные структуры в ЕС, США или MENA. Дизайн с первого дня делается под конкретную юрисдикцию, а последнее слово остаётся за вашими юристами.'],
    ['Что будет, если ничего не делать?', 'Иногда честный ответ: ничего плохого. Если актив финансирует себя, а владельцы готовы ждать, ожидание тоже позиция. Инструмент стоит строить, когда он решает проблему, которая действительно есть у вас в этом году.'],
  ],
  cta: 'Хотите разобрать эти семь вопросов применительно к своему активу? 45-минутный созвон бесплатный.',
  ctaLabel: 'Записаться на созвон',
  disclaimer: 'Этот гид носит исключительно информационный и образовательный характер. Он не является инвестиционной, финансовой, юридической или налоговой консультацией. Правовая классификация инструмента зависит от его конкретной структуры и применимой юрисдикции.',
}

export const ownersGuideContent = lang === 'ru' ? ru : en
export const ownersGuideMeta = ownersGuideContent.meta
