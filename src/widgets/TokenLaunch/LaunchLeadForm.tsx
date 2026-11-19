'use client'

import { useState, type FormEvent } from 'react'
import { FormBlock, FormRow, SelectField, TextField, Textarea } from '@/shared/ds'
import { apiPath } from '@/shared/lib/apiPath'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import type { LaunchFormCopy } from './types'

type Status = 'idle' | 'loading' | 'success' | 'error'

interface LaunchLeadFormProps {
  copy: LaunchFormCopy
  idPrefix: string
  submitLabel: string
  /** Extra lines for the lead message (selected modules, estimate). */
  extraMessage?: () => string
}

/** Token launch request form; posts to /api/contact. */
export function LaunchLeadForm({ copy, idPrefix, submitLabel, extraMessage }: LaunchLeadFormProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const formData = new FormData(e.currentTarget)
    const value = (key: string) => ((formData.get(key) as string) || '').trim()
    const name = value('name')
    const company = value('company')
    const email = value('email')
    const telegram = value('telegram')
    const stage = value('stage')
    const task = value('task')

    if (!name || !company || !email) {
      setStatus('error')
      setErrorMsg(copy.requiredError)
      return
    }

    const lines: string[] = []
    if (task) lines.push(task, '')
    lines.push(`${copy.companyLine}: ${company}`)
    if (telegram) lines.push(`${copy.telegramLine}: ${telegram}`)
    if (stage) lines.push(`${copy.stageLine}: ${stage}`)
    const extra = extraMessage?.()
    if (extra) lines.push(extra)
    lines.push(copy.sourceLine)

    try {
      const res = await fetch(apiPath('/api/contact'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message: lines.join('\n') }),
      })
      let data: { success?: boolean; error?: string } = {}
      try {
        data = JSON.parse(await res.text()) as { success?: boolean; error?: string }
      } catch {
        throw new Error(copy.errorFallback)
      }
      if (!res.ok || !data.success) throw new Error(data.error || copy.errorFallback)

      setStatus('success')
      trackPlatformEvent('form_submit', { form_id: 'token_launch', status: 'success', stage })
    } catch (err) {
      setStatus('error')
      trackPlatformEvent('form_submit', { form_id: 'token_launch', status: 'error' })
      setErrorMsg(err instanceof Error ? err.message : copy.errorFallback)
    }
  }

  if (status === 'success') {
    return (
      <p role="status">
        {copy.successTitle} {copy.successBody}
      </p>
    )
  }

  return (
    <FormBlock
      onSubmit={handleSubmit}
      noValidate
      submitLabel={status === 'loading' ? copy.sendingLabel : submitLabel}
      pending={status === 'loading'}
      status={status === 'error' ? errorMsg : undefined}
    >
      <FormRow>
        <TextField id={`${idPrefix}-name`} name="name" label={copy.nameLabel} placeholder={copy.namePlaceholder} required autoComplete="name" />
        <TextField
          id={`${idPrefix}-company`}
          name="company"
          label={copy.companyLabel}
          placeholder={copy.companyPlaceholder}
          required
          autoComplete="organization"
        />
      </FormRow>
      <FormRow>
        <TextField
          id={`${idPrefix}-email`}
          name="email"
          type="email"
          label={copy.emailLabel}
          placeholder={copy.emailPlaceholder}
          required
          autoComplete="email"
        />
        <TextField
          id={`${idPrefix}-telegram`}
          name="telegram"
          label={`${copy.telegramLabel} (${copy.telegramOptional})`}
          placeholder={copy.telegramPlaceholder}
        />
      </FormRow>
      <SelectField
        id={`${idPrefix}-stage`}
        name="stage"
        label={copy.stageLabel}
        placeholder={copy.stagePlaceholder}
        options={copy.stageOptions}
      />
      <Textarea id={`${idPrefix}-task`} name="task" label={copy.taskLabel} placeholder={copy.taskPlaceholder} rows={3} />
    </FormBlock>
  )
}
