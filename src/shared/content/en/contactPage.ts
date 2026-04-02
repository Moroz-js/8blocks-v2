// Contact page — single source of truth

export const contactMeta = {
  title: 'Contact',
  description:
    "Get in touch with 8Blocks: let's discuss token economics, consulting, or an audit. We'll respond within one business day.",
  ogTitle: 'Contact | 8Blocks',
  ogDescription: "Get in touch — let's discuss your project.",
} as const

export const contactPageContent = {
  hero: {
    ariaLabel: 'Contact',
    label: 'Contact',
    headline: "Let's discuss your project",
    description:
      'Reach out about strategic consulting, tokenomics, and audit. If convenient, book a call slot right away.',
    person: {
      name: 'Oksana',
      role: 'COO',
      tgHref: 'https://t.me/Eight_Blocks',
      tgLabel: 'Telegram →',
    },
    preferEmailLabel: 'Prefer email?',
  },
  contacts: {
    ariaLabel: 'Contact details',
    socialsLabel: 'Socials',
    addressLabel: 'Address',
    phoneLabel: 'Phone',
  },
  calendly: {
    ariaLabel: 'Book a call',
    headline: 'Book a call',
    description:
      'Choose a convenient time and we will discuss your task, project context, and possible engagement format.',
    services: [
      'Strategic consulting',
      'Tokenomics design',
      'Current model audit',
    ],
  },
  section: {
    label: 'Contact',
    headline: "Let's discuss",
    headlineAccent: 'your project',
    description:
      "Tell us about your challenge — we'll respond within one business day and suggest a collaboration format.",
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    officeLabel: 'Office',
    directionsLabel: 'Get Directions',
  },
} as const

export const contactFormContent = {
  nameLabel: 'Name',
  namePlaceholder: 'John Doe',
  messageLabel: 'Message',
  messagePlaceholder: 'Tell us about your project and what you are looking for',
  submitLabel: 'Submit request',
  sendingLabel: 'Sending…',
  failedError: 'Failed to send',
  successTitle: 'Message sent',
  successBody: "We'll respond within one business day.",
} as const
