'use client'

import Image from 'next/image'
import { useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { trackPlatformEvent } from '@/shared/lib/platform-analytics'
import { BinaryUnicornCanvas } from './BinaryUnicornCanvas'
import { StickyStory } from './StickyStory'
import { lang } from '@/shared/i18n'
import { copy } from './copy'
import { artworkPath, pagePath } from './paths'
import styles from './TokenomicsAi.module.scss'

function Badge() {
  return <span className={styles.badge}><i aria-hidden="true" />{copy('Limited slots available')}</span>
}

const compareRows: { label: string, hint: string, cells: Array<'yes' | 'maybe' | 'no' | string> }[] = [
  { label: 'Price', hint: 'The cost of a tokenomics build for the chosen method and the scope of work.', cells: ['$0', '$300/m', '$15000'] },
  { label: 'Allocations', hint: 'How tokens are split between the team, investors, community, ecosystem, and other participants.', cells: ['yes', 'yes', 'yes'] },
  { label: 'Vesting and cliffs', hint: 'Whether a justified unlock schedule can account for participant interests and sell pressure.', cells: ['yes', 'yes', 'yes'] },
  { label: 'Burn', hint: 'Whether a sound mechanism for reducing token supply can be designed.', cells: ['maybe', 'yes', 'yes'] },
  { label: 'Buyback', hint: 'Whether a sustainable market buyback can be designed from the project revenue and economy.', cells: ['maybe', 'yes', 'yes'] },
  { label: 'Staking (formulas and logic)', hint: 'Whether yield, rewards, and the effect of staking on the token economy can be justified.', cells: ['maybe', 'yes', 'yes'] },
  { label: 'Treasury (accumulation and turnover)', hint: 'Whether reserves can be built, allocated, and used so the project stays solvent.', cells: ['no', 'yes', 'yes'] },
  { label: 'Token utilities', hint: 'Whether real token uses can be proposed that create demand inside the ecosystem.', cells: ['maybe', 'yes', 'yes'] },
  { label: 'Answer to “who will buy your token, and why”', hint: 'Whether the buyers can be named and the reasons to buy and hold the token can be justified.', cells: ['no', 'yes', 'yes'] },
]

const flowNodes: Array<[string, number, number, number, number]> = [
  ['Emission', 114.19, 26.07, 76.37, 29.48],
  ['Investors / Users', 17.08, 94.75, 76.37, 29.48],
  ['Team', 114.19, 94.75, 76.37, 29.48],
  ['Treasury', 211.3, 94.75, 76.37, 29.48],
  ['Utility', 17.08, 158.59, 76.37, 29.48],
  ['Market', 114.19, 157.38, 173.48, 32.16],
  ['Burn', 17.08, 222.65, 76.37, 29.48],
]

function CirculationChart({ label }: { label: string }) {
  return (
    <svg className={styles.flowChart} viewBox="0 0 305 275.3" role="img" aria-label={label}>
      <svg x="6.1" y="6.08" width="293.96" height="263.78" viewBox="0 0 293.961 263.779" fill="none">
        <path d="M146.737 88.5252L148.68 85.1589H144.793L146.737 88.5252ZM146.737 49.7902H146.4V85.4955H146.737H147.073V49.7902H146.737Z" fill="white" fillOpacity="0.32" />
        <path d="M49.6247 69.2795H243.605" stroke="white" strokeOpacity="0.32" strokeWidth="0.673" strokeLinejoin="round" />
        <path d="M49.9613 69.2795V68.9428H49.288V69.2795H49.6247H49.9613ZM49.6247 88.5252L51.5682 85.1588H47.6811L49.6247 88.5252ZM49.6247 69.2795H49.288V85.4954H49.6247H49.9613V69.2795H49.6247Z" fill="white" fillOpacity="0.32" />
        <path d="M243.941 69.2795V68.9428H243.267V69.2795H243.604H243.941ZM243.604 88.5252L245.548 85.1588H241.661L243.604 88.5252ZM243.604 69.2795H243.267V85.4954H243.604H243.941V69.2795H243.604Z" fill="white" fillOpacity="0.32" />
        <path d="M293.137 0.336636H293.473C293.473 0.150717 293.323 0 293.137 0V0.336636ZM0.336636 0.336636V0C0.150717 0 0 0.150717 0 0.336636L0.336636 0.336636ZM0.336636 103.874H0C0 104.06 0.150717 104.21 0.336636 104.21L0.336636 103.874ZM10.8286 103.874L7.46227 101.93V105.817L10.8286 103.874ZM293.137 103.874H293.473V0.336636H293.137H292.8V103.874H293.137ZM293.137 0.336636V0H0.336636V0.336636V0.673273H293.137V0.336636ZM0.336636 0.336636H0V103.874H0.336636H0.673273V0.336636H0.336636ZM0.336636 103.874V104.21H7.79891V103.874V103.537H0.336636V103.874Z" fill="white" fillOpacity="0.32" />
        <path d="M0.336636 167.701V167.365C0.150717 167.365 0 167.515 0 167.701H0.336636ZM0.336636 263.443H0C0 263.628 0.150717 263.779 0.336636 263.779L0.336636 263.443ZM293.625 263.443V263.779C293.811 263.779 293.961 263.628 293.961 263.443H293.625ZM293.625 103.874H293.961C293.961 103.688 293.811 103.537 293.625 103.537V103.874ZM282.401 103.874L285.767 105.817V101.93L282.401 103.874ZM11.3166 167.701V167.365H0.336636V167.701V168.038H11.3166V167.701ZM0.336636 167.701H0V263.443H0.336636H0.673273V167.701H0.336636ZM0.336636 263.443V263.779H293.625V263.443V263.106H0.336636V263.443ZM293.625 263.443H293.961V103.874H293.625H293.288V263.443H293.625ZM293.625 103.874V103.537H285.43V103.874V104.21H293.625V103.874Z" fill="white" fillOpacity="0.32" />
        <path d="M98.1808 103.874H98.5175C98.5175 103.688 98.3667 103.537 98.1808 103.537V103.874ZM88.1768 103.874L91.5432 105.817V101.93L88.1768 103.874ZM98.1808 167.701H98.5175V103.874H98.1808H97.8442V167.701H98.1808ZM98.1808 103.874V103.537H91.2065V103.874V104.21H98.1808V103.874Z" fill="white" fillOpacity="0.32" />
        <path d="M98.1809 167.364H97.8442V168.038H98.1809V167.701V167.364ZM107.941 167.701L104.575 165.757V169.645L107.941 167.701ZM98.1809 167.701V168.038H104.911V167.701V167.364H98.1809V167.701Z" fill="white" fillOpacity="0.32" />
        <path d="M49.6247 118.49V152.353" stroke="white" strokeOpacity="0.32" strokeWidth="0.673" strokeLinejoin="round" />
        <path d="M146.737 135.056H146.4C146.4 135.242 146.551 135.392 146.737 135.392V135.056ZM195.293 135.056H195.629C195.629 134.87 195.479 134.719 195.293 134.719V135.056ZM195.293 151.134L197.236 147.768H193.349L195.293 151.134ZM146.737 118.49H146.4V135.056H146.737H147.073V118.49H146.737ZM146.737 135.056V135.392H195.293V135.056V134.719H146.737V135.056ZM195.293 135.056H194.956V148.105H195.293H195.629V135.056H195.293Z" fill="white" fillOpacity="0.32" />
        <path d="M49.6247 216.424L51.5682 213.058H47.6811L49.6247 216.424ZM49.6247 182.318H49.288V213.395H49.6247H49.9613V182.318H49.6247Z" fill="white" fillOpacity="0.32" />
      </svg>
      {flowNodes.map(([name, x, y, width, height]) => (
        <g key={name}>
          <rect x={x} y={y} width={width} height={height} rx="3.9" fill="white" fillOpacity="0.12" />
          <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="#fff" fontSize="9.36" fontWeight="600" fontFamily="Manrope, sans-serif">
            {name.split(' / ').map((line, index, lines) => (
              <tspan key={line} x={x + width / 2} dy={index === 0 ? (lines.length === 1 ? '0.35em' : '-0.35em') : '1.15em'}>{line}</tspan>
            ))}
          </text>
        </g>
      ))}
    </svg>
  )
}

function Hint({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <span className={styles.tip} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" className={styles.tipButton} aria-expanded={open} aria-label={text} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
        <Image src={artworkPath('compare-info', 'svg')} width={22} height={22} alt="" unoptimized />
      </button>
      {open && <span className={styles.tipBubble} role="tooltip">{text}</span>}
    </span>
  )
}

function statusCell(cell: 'yes' | 'maybe' | 'no' | string) {
  if (cell === 'yes' || cell === 'maybe' || cell === 'no') {
    const icon = cell === 'yes' ? 'compare-check' : cell === 'maybe' ? 'compare-warn' : 'compare-no'
    const name = cell === 'yes' ? 'Included' : cell === 'maybe' ? 'Possible' : 'Not included'
    return (
      <span className={styles.status}>
        <Image src={artworkPath(icon, 'svg')} width={34} height={34} alt={copy(name)} unoptimized />
        {cell === 'maybe' && <span>{copy('Possible')}</span>}
      </span>
    )
  }
  return cell
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
      const response = await fetch(pagePath('/api/contact'), {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: project, email, message: [copy('Tokenomics AI early access'), `${copy('Project')}: ${project}`, `${copy('Goal')}: ${copy(goal)}`, `${copy('Stage')}: ${copy(stage || 'Not specified')}`, `${copy('Source')}: ${copy(heard || 'Not specified')}`].join('\n') }),
      })
      if (!response.ok) throw new Error('Unable to send request')
      setStatus('done')
      trackPlatformEvent('lead_form_submit', { tool: 'tokenomics_ai', form: 'tokenomics_ai_early_access', goal, stage, heard })
    } catch { setStatus('error') }
    finally { submitting.current = false }
  }

  return (
    <div className={`${styles.page} ${fontClass}`} lang={lang} style={{
      '--ai-demo-background': `url("${artworkPath('demo-gradient')}")`,
      '--ai-allocation-background': `url("${artworkPath('allocation-background')}")`,
    } as CSSProperties}>
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
          <article className={styles.card}>
            <h3>{copy('Allocation and vesting')}</h3>
            <p>{copy('Who receives how many tokens, and the conditions for them to enter circulation')}</p>
            <div className={styles.vesting}>
              <Image src={artworkPath('vesting-area', 'svg')} width={349} height={226} alt={copy('Vesting chart of token allocations entering circulation')} unoptimized />
              <ul className={styles.legend}>
                {[['#fff', 'Team'], ['#58444c', 'Public'], ['#49323d', 'Advision'], ['#432a35', 'Seed'], ['#3d1d2b', 'Pre-Seed'], ['#381022', 'Lead VC']].map(([color, name]) => (
                  <li key={name}><i style={{ background: color }} />{name}</li>
                ))}
              </ul>
            </div>
          </article>
          <article className={styles.card}>
            <h3>{copy('Circulation scheme')}</h3>
            <p>{copy('How tokens are issued, circulate, are withdrawn, and burned')}</p>
            <CirculationChart label={copy('Circulation scheme')} />
          </article>
          <article className={styles.card}>
            <h3>{copy('Token utility logic')}</h3>
            <p>{copy('Incentives to buy and use the token')}</p>
            <ul className={styles.checks}>
              {['Who will buy your token, and why?', 'How can the token be used to get an extra benefit?', 'If the token pays no income, what does it give?', 'Staking is not a utility. It only delays a sale.'].map(item => (
                <li key={item}><Image src={artworkPath('check-mark', 'svg')} width={17} height={17} alt="" unoptimized /><span>{copy(item)}</span></li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section id="early-access" className={styles.compare} aria-labelledby="ai-cta-title">
        <Badge />
        <h2 id="ai-cta-title" className={styles.titleGradient}>{copy('Trust a tuned model')}</h2>
        <p className={styles.compareLead}>{copy('A generic AI picks a formula, explains it, and might guess right. It still cannot give an individual approach.')}</p>
        <div className={styles.compareActions}><button type="button" className={styles.primary} onClick={requestAccess}>{copy('Request early access')}</button><a className={styles.secondary} href={pagePath('/contact')}>{copy('Contact sales')}</a></div>
        <div className={styles.matrixWrap}>
          <div className={styles.matrix} role="table" aria-label={copy('Comparison of ChatGPT, Tokenomics AI, and consulting')}>
            <div className={styles.highlightCol} aria-hidden="true" />
            <div className={styles.matrixRow} role="row">
              <div role="columnheader" />
              {['ChatGPT', 'Tokenomics AI', 'Consulting'].map(name => <div key={name} role="columnheader">{name}</div>)}
            </div>
            {compareRows.map(row => (
              <div key={row.label} className={styles.matrixRow} role="row">
                <div className={styles.feature} role="rowheader"><Hint text={copy(row.hint)} /><span>{copy(row.label)}</span></div>
                {row.cells.map((cell, index) => <div key={index} role="cell">{statusCell(cell)}</div>)}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.idea}>
          <Image src={artworkPath('idea-bulb', 'svg')} width={44} height={44} alt="" unoptimized />
          <p className={styles.titleGradient}>{copy('Hand your ideas to the agent and get a first proposal for free')}</p>
          <div className={styles.compareActions}><button type="button" className={styles.primary} onClick={requestAccess}>{copy('Request early access')}</button><a className={styles.secondary} href={pagePath('/contact')}>{copy('Contact sales')}</a></div>
        </div>
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
