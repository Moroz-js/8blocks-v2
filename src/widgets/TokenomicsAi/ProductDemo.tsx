'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'
import { copy } from './copy'
import styles from './TokenomicsAi.module.scss'

const durations = [1800, 2400, 2200, 2400, 2400, 2800, 2500, 2800, 2400, 4200]
const labels = [copy('Welcome'), copy('Describe your project'), copy('Project name'), copy('Sector'), copy('Stage'), copy('Funding round'), copy('Drafting allocations'), copy('Testing unlock spikes'), copy('Creating investor PDF'), copy('Your model is ready')]
const messages = [
  { text: copy('I need tokenomics for solar panels company'), user: true },
  { text: copy('What is your project name?') },
  { text: 'NOVA PROTOCOL', user: true },
  { text: copy('Your sector is?') },
  { text: 'DeFi', user: true },
  { text: copy('Your stage is?') },
  { text: copy('Pre-seed'), user: true },
  { text: copy('Planned raise size and rounds?') },
  { text: copy('$2M seed, then\na community round'), user: true },
]

export function ProductDemo() {
  const rootRef = useRef<HTMLDivElement>(null)
  const messageListRef = useRef<HTMLDivElement>(null)
  const [chatOffset, setChatOffset] = useState(0)
  const [downloadState, setDownloadState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [visible, setVisible] = useState(false)
  const [paused, setPaused] = useState(false)
  const [phase, setPhase] = useState(0)
  const reducedMotion = useReducedMotion()
  const shownPhase = reducedMotion ? 9 : phase

  useEffect(() => {
    const element = rootRef.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Deliberately has no scroll progress or story-step dependency.
    if (!visible || paused || reducedMotion) return
    let timer = 0
    const schedule = () => {
      window.clearTimeout(timer)
      if (!document.hidden) timer = window.setTimeout(() => setPhase(current => (current + 1) % durations.length), durations[phase])
    }
    schedule()
    document.addEventListener('visibilitychange', schedule)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', schedule)
    }
  }, [phase, visible, paused, reducedMotion])

  const transition = { duration: reducedMotion ? 0 : 0.45, ease: 'easeOut' as const }
  const chat = shownPhase >= 2 && shownPhase <= 5
  const count = [0, 0, 2, 4, 6, 9][shownPhase] ?? 0
  useLayoutEffect(() => {
    const list = messageListRef.current
    const body = list?.parentElement
    if (!list || !body || !chat) return
    const measure = () => setChatOffset(body.clientHeight - list.scrollHeight - body.clientWidth * 20 / 414)
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    observer.observe(body)
    measure()
    return () => observer.disconnect()
  }, [shownPhase, chat])

  async function downloadReport() {
    if (downloadState === 'loading') return
    setDownloadState('loading')
    try {
    const { jsPDF } = await import('jspdf')
    const pdf = new jsPDF()
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(24)
    pdf.text('NOVA PROTOCOL', 20, 28)
    pdf.text('Tokenomics', 20, 40)
    pdf.setFontSize(11)
    pdf.text('DeFi  |  Pre-seed  |  $2M seed + community round', 20, 54)
    pdf.setTextColor(100)
    pdf.text('Illustrative product demo. This is not a live model run.', 20, 65)
    const [allocation, unlock] = await Promise.all(['allocation-chart', 'unlock-chart'].map(async name => {
      const response = await fetch(`/img/tokenomics-ai/${name}.png`)
      if (!response.ok) throw new Error('Unable to load report artwork')
      const blob = await response.blob()
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    }))
    pdf.setFillColor(45, 8, 28)
    pdf.roundedRect(20, 78, 170, 92, 5, 5, 'F')
    pdf.addImage(allocation, 'PNG', 67, 82, 82, 82)
    pdf.setTextColor(20)
    pdf.setFontSize(16)
    pdf.text('Allocation and vesting preview', 20, 184)
    pdf.setFillColor(45, 8, 28)
    pdf.roundedRect(20, 194, 170, 80, 5, 5, 'F')
    pdf.addImage(unlock, 'PNG', 32, 199, 145, 70)
    pdf.save('nova-protocol-demo.pdf')
    setDownloadState('idle')
    } catch { setDownloadState('error') }
  }

  return (
    <div ref={rootRef} className={styles.demo} data-demo-phase={shownPhase} aria-label={copy('Animated preview of the Tokenomics AI product')}>
      <div className={styles.demoWindow}>
        <div className={styles.demoChrome} aria-hidden="true">
          <div className={styles.windowDots}><i /><i /><i /></div>
          <span>8blocks AI</span>
        </div>
        <div className={styles.demoBody} aria-hidden="true">
          <AnimatePresence initial={false}>
            {shownPhase < 2 && (
              <motion.div key="welcome" className={styles.welcome} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={transition}>
                <Image src="/img/tokenomics-ai/ai-orb.png" width={86} height={86} alt="" />
                <p>{copy('Hi there! What’s')}<br />{copy('on your mind?')}</p>
              </motion.div>
            )}
            {chat && (
              <motion.div key="conversation" className={styles.conversation} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
                <motion.div ref={messageListRef} className={styles.messageList} animate={{ y: chatOffset }} transition={{ ...transition, duration: reducedMotion ? 0 : 0.65 }}>
                  {messages.slice(0, count).map((message, index) => (
                    <motion.div key={index} className={`${styles.message} ${message.user ? styles.userMessage : styles.aiMessage}`} initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={transition}>{message.text}</motion.div>
                  ))}
                  {(shownPhase === 3 || shownPhase === 4) && <motion.div key={`choices-${shownPhase}`} className={styles.demoChoices} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={transition}>{(shownPhase === 3 ? ['DeFi', 'GameFi', 'RWA', copy('Finance')] : [copy('Pre-seed'), copy('Private Sale'), 'Pre-TGE', 'TGE']).map(choice => <span key={choice}>{choice}</span>)}</motion.div>}
                </motion.div>
              </motion.div>
            )}
            {shownPhase >= 6 && (
              <motion.div key={`output-${shownPhase}`} className={styles.demoOutput} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={transition}>
                {shownPhase === 6 && <><Image className={styles.demoDonut} src="/img/tokenomics-ai/allocation-chart.png" width={140} height={140} alt="" /><p>{copy('Drafting 8 allocation buckets...')}</p></>}
                {shownPhase === 7 && <><Image className={styles.demoUnlock} src="/img/tokenomics-ai/unlock-chart.png" width={280} height={163} alt="" /><p>{copy('Testing unlock spikes...')}</p></>}
                {shownPhase === 8 && <><motion.span className={styles.pdfProgress} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ duration: reducedMotion ? 0 : 1.8 }}>99%</motion.span><p>{copy('Creating a PDF for your investor...')}</p></>}
                {shownPhase === 9 && <div className={styles.demoResult}><div><h3>NOVA PROTOCOL<br />{copy('Tokenomics')}</h3><p>{copy('DeFi · Pre-seed · $2M')}</p></div><Image src="/img/tokenomics-ai/allocation-chart.png" width={171} height={171} alt="" /></div>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {shownPhase === 9 && <button type="button" className={styles.download} disabled={downloadState === 'loading'} onClick={downloadReport}>{downloadState === 'loading' ? copy('Preparing…') : copy('Download')}<span className={styles.srOnly}> {copy('illustrative demo PDF')}</span></button>}
        {downloadState === 'error' && <p role="alert" className={styles.demoError}>{copy('Download failed. Please try again.')}</p>}
      </div>
      <div className={styles.demoInput} aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}><motion.span key={shownPhase === 1 ? 'request' : shownPhase === 2 ? 'name' : shownPhase > 6 ? 'ask' : 'placeholder'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} className={shownPhase === 1 || shownPhase === 2 ? styles.typedInput : ''}>{shownPhase === 1 ? copy('I need tokenomics for solar panels company') : shownPhase === 2 ? 'NOVA PROTOCOL' : shownPhase > 6 ? copy('Ask anything...') : copy('Describe your project...')}</motion.span></AnimatePresence>
        {(shownPhase === 1 || shownPhase === 2) && <span className={styles.sendIcon}>➤</span>}
      </div>
      <span className={styles.srOnly}>{copy('Illustrative demo:')} {labels[shownPhase]}{copy('. No live model is being generated.')}</span>
      {!reducedMotion && <button type="button" className={styles.demoPlayback} onClick={() => setPaused(current => !current)} aria-label={paused ? copy('Play product demo') : copy('Pause product demo')}>{paused ? copy('▶ Play') : copy('Ⅱ Pause')}</button>}
    </div>
  )
}
