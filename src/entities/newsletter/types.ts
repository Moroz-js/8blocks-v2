export interface NewsletterSubscription {
  id: string
  email: string
  source?: string
  consent: boolean
  createdAt: string
}

export interface NewsletterFormData {
  email: string
  source?: string
}
