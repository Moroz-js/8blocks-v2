'use client'

import Image from 'next/image'
import { useRef, useState, type FormEvent } from 'react'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { BinaryUnicornCanvas } from './BinaryUnicornCanvas'
import { StickyStory } from './StickyStory'
import { lang } from '@/shared/i18n'
import { copy } from './copy'
import styles from './TokenomicsAi.module.scss'

function Badge() {
  return <span className={styles.badge}><i aria-hidden="true" />{copy('Limited slots available')}</span>
}

export function TokenomicsAiPage({ fontClass }: { fontClass: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const viewed = useRef(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const submitting = useRef(false)

  function requestAccess() {
    dialog.current?.showModal()
    trackPlatformEvent('cta_click', { tool: 'tokenomics_ai', target: 'early_access_modal' })
    if (!viewed.current) {
      viewed.current = true
      trackPlatformEvent('lead_form_view', { tool: 'tokenomics_ai', form: 'tokenomics_ai_early_access' })
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    setStatus('sending')
    const data = new FormData(event.currentTarget)
    const project = String(data.get('project') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const goal = String(data.get('goal') ?? '')
    const stage = String(data.get('stage') ?? '')
    const heard = String(data.get('heard') ?? '')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: project, email, message: ['Tokenomics AI early access', `Project: ${project}`, `Goal: ${goal}`, `Stage: ${stage || 'Not specified'}`, `Source: ${heard || 'Not specified'}`].join('\n') }),
      })
      if (!response.ok) throw new Error('Unable to send request')
      setStatus('done')
      trackPlatformEvent('lead_form_submit', { tool: 'tokenomics_ai', form: 'tokenomics_ai_early_access', goal, stage, heard })
    } catch { setStatus('error') }
    finally { submitting.current = false }
  }

  return (
    <div className={`${styles.page} ${fontClass}`} lang={lang}>
      <section className={styles.hero} aria-labelledby="tokenomics-ai-title">
        <div className={styles.heroInner}>
          <div className={styles.unicorn}><BinaryUnicornCanvas /></div>
          <div className={styles.heroCopy}>
            <Badge />
            <h1 id="tokenomics-ai-title"><span>{copy('Tokenomics AI:')}</span><span className={styles.titleGradient}>{copy('Your token model. Investor-ready in 48 hours.')}</span></h1>
            <p>{copy('AI drafts allocations and vesting. The 8Blocks scoring engine flags structural risks and refines the model. You get the refined design and a report for your data room.')}</p>
            <button className={styles.primary} type="button" onClick={requestAccess}>{copy('Request early access')}</button>
          </div>
          <div className={styles.heroFacts}><span>{copy('Early access')}</span><span>{copy('From $299')}</span><span>{copy('48h turnaround')}</span></div>
        </div>
      </section>

      <StickyStory onRequest={requestAccess} />

      <section className={styles.outputs} aria-labelledby="ai-outputs-title">
        <h2 id="ai-outputs-title">{copy('Your investor-ready AI model:')}<span>{copy('AI drafts allocations and vesting')}</span></h2>
        <div className={styles.cards}>
          <article className={`${styles.card} ${styles.allocationCard}`}>
            <h3>{copy('Refined model')}</h3><p>{copy('8 buckets + vesting, tuned against category benchmarks')}</p>
            <Image className={styles.allocationVisual} src="/img/tokenomics-ai/allocation-chart.png" width={245} height={245} alt={copy('Allocation chart showing eight buckets totaling 100% of supply')} />
          </article>
          <article className={`${styles.card} ${styles.scoreCard}`}>
            <h3>{copy('Structure Score')}</h3><p>{copy('Shows where your supply structure creates sell pressure, judged against launches like yours')}</p>
            <Image className={styles.unlockVisual} src="/img/tokenomics-ai/unlock-chart.png" width={357} height={208} alt={copy('Token unlock bars with a cumulative supply curve')} />
          </article>
          <article className={`${styles.card} ${styles.reportCard}`}>
            <h3>{copy('Investor-ready pitch deck')}</h3><p>{copy('Branded report ready for your data room in .pdf format')}</p>
            <Image className={styles.reportVisual} src="/img/tokenomics-ai/report-preview.png" width={326} height={197} alt={copy('NOVA Protocol branded tokenomics report preview')} />
            <Image className={styles.reportBehind} src="/img/tokenomics-ai/report-preview.png" width={326} height={197} alt="" />
          </article>
        </div>
      </section>

      <section id="early-access" className={styles.closing} aria-labelledby="ai-cta-title">
        <Badge />
        <h2 id="ai-cta-title"><span className={styles.titleGradient}>{copy('Claim your AI')}<br />{copy('Tokenomics model')}</span><span>{copy('From $299')}</span></h2>
        <div className={styles.closingActions}><button type="button" className={styles.primary} onClick={requestAccess}>{copy('Request early access')}</button><a className={styles.secondary} href="/contact">{copy('Contact sales')}</a></div>
      </section>

      <dialog ref={dialog} className={styles.accessDialog} aria-labelledby="ai-access-title" data-lenis-prevent onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.current?.close() } }}>
        <button type="button" className={styles.dialogClose} aria-label={copy('Close early access form')} onClick={() => dialog.current?.close()}>×</button>
        <Badge />
        <h2 id="ai-access-title">{copy('Request early access')}</h2>
        {status === 'done' ? <div role="status"><p>{copy('Thanks! Your request is in.')}</p><p>{copy('We’ll contact you about your project and the next steps.')}</p><button type="button" className={styles.primary} onClick={() => dialog.current?.close()}>{copy('Done')}</button></div> :
          <form className={styles.accessForm} onSubmit={submit}>
            <label>{copy('Email')}<input autoFocus type="email" name="email" autoComplete="email" required maxLength={254} /></label>
            <label>{copy('Project name')}<input name="project" required maxLength={200} /></label>
            <label>{copy('Your goal')}<select name="goal" required defaultValue=""><option value="" disabled>{copy('Select a goal')}</option>{['Investor round', 'Token launch', 'Refine an existing model', 'Explore a token model'].map(value => <option key={value} value={value}>{copy(value)}</option>)}</select></label>
            <label>{copy('Project stage')} <span>{copy('(optional)')}</span><select name="stage" defaultValue=""><option value="">{copy('Select a stage')}</option>{['Pre-seed', 'Private Sale', 'Pre-TGE', 'TGE', 'Post-TGE'].map(value => <option key={value} value={value}>{copy(value)}</option>)}</select></label>
            <label>{copy('How did you hear about us?')} <span>{copy('(optional)')}</span><select name="heard" defaultValue=""><option value="">{copy('Select a source')}</option>{['Search', 'Social media', 'Referral', 'Event', 'Other'].map(value => <option key={value} value={value}>{copy(value)}</option>)}</select></label>
            {status === 'error' && <p className={styles.formError} role="alert">{copy('We couldn’t send your request. Please try again.')}</p>}
            <button className={styles.primary} type="submit" disabled={status === 'sending'}>{status === 'sending' ? copy('Sending…') : copy('Request early access')}</button>
            <p className={styles.formNote}>{copy('Early access starts from $299. We’ll confirm scope and timing with you before payment.')}</p>
          </form>}
      </dialog>
    </div>
  )
}
