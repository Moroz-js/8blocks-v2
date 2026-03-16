export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  message: string
  source?: string
  status: 'new' | 'in_progress' | 'closed'
  note?: string
  createdAt: string
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
  source?: string
}
