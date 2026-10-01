// Local runtime verification. Contact requests are mocked; no leads are sent.
// Run against an already running app: node scripts/verify-tokenomics-ai.mjs
import puppeteer from 'puppeteer'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
const base = process.env.TOKENOMICS_TEST_URL || 'http://127.0.0.1:3000'
const output = path.join(os.tmpdir(), 'tokenomics-ai-verification')
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

async function run() {
  await fs.mkdir(output, { recursive: true })
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  page.setDefaultNavigationTimeout(60000)
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 })
  await page.setRequestInterception(true)
  let submissions = 0
  let rejectContact = false
  page.on('request', request => {
    if (request.url().endsWith('/api/contact')) {
      submissions++
      return request.respond({ status: rejectContact ? 500 : 200, contentType: 'application/json', body: JSON.stringify({ success: !rejectContact }) })
    }
    request.continue()
  })
  await page.evaluateOnNewDocument(() => {
    window.binaryDraws = []
    const clear = CanvasRenderingContext2D.prototype.clearRect
    const text = CanvasRenderingContext2D.prototype.fillText
    const sprite = CanvasRenderingContext2D.prototype.drawImage
    CanvasRenderingContext2D.prototype.clearRect = function(...args) {
      if (this.canvas.dataset.sourceReady) {
        if (this.canvas.glyphs) { window.binaryDraws.push(this.canvas.glyphs); if (window.binaryDraws.length > 4) window.binaryDraws.shift() }
        this.canvas.glyphs = {}
      }
      return clear.apply(this, args)
    }
    CanvasRenderingContext2D.prototype.fillText = function(ch, x, y, ...rest) {
      if (this.canvas.dataset.sourceReady) this.canvas.glyphs[`${x.toFixed(1)},${y.toFixed(1)}`] = ch
      return text.call(this, ch, x, y, ...rest)
    }
    CanvasRenderingContext2D.prototype.drawImage = function(source, ...args) {
      if (this.canvas.dataset.sourceReady && source.dataset?.binaryAtlas && args.length === 8) {
        const [sx, , sw, , dx, dy, dw, dh] = args
        this.canvas.glyphs[`${(dx + dw / 2).toFixed(1)},${(dy + dh / 2).toFixed(1)}`] = Math.round(sx / sw) % 2 === 0 ? '0' : '1'
      }
      return sprite.call(this, source, ...args)
    }
  })
  try {
    await page.goto(base, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('h1')
    await page.evaluate(() => document.fonts.ready)
    const homeStyles = await page.evaluate(() => ({ bg: getComputedStyle(document.body).backgroundColor, font: getComputedStyle(document.body).fontFamily, title: getComputedStyle(document.querySelector('h1')).fontSize }))
    await page.screenshot({ path: path.join(output, 'existing-home.png') })
    await page.goto(`${base}/product/tokenomics-ai`, { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => document.fonts.ready)
    await page.waitForSelector('canvas[data-source-ready="true"]')
    assert(await page.$('footer'), 'Footer must be present on the AI page')
    assert.equal(await page.$('footer [class*=watermarkSection]'), null, 'AI footer excludes only the brand watermark')
    assert.equal(await page.$eval('header', el => getComputedStyle(el).backgroundColor), 'rgb(2, 2, 2)')
    await wait(500)
    const canvas = await page.evaluate(() => {
      const canvas = document.querySelector('canvas[data-source-ready]')
      const rect = canvas.getBoundingClientRect()
      return { digits: +canvas.dataset.digitCount, width: canvas.width, cssWidth: rect.width, height: canvas.height, cssHeight: rect.height, chars: [...new Set(Object.values(window.binaryDraws.at(-1) || {}))] }
    })
    assert(canvas.digits > 1000, 'Unicorn must contain many sampled digits')
    assert.equal(canvas.width, Math.round(canvas.cssWidth * 2))
    assert.equal(canvas.height, Math.round(canvas.cssHeight * 2))
    assert.deepEqual(canvas.chars.sort(), ['0', '1'])
    const glyphsBefore = await page.evaluate(() => window.binaryDraws.at(-1))
    await wait(200)
    const glyphsAfter = await page.evaluate(() => window.binaryDraws.at(-1))
    const samePositions = Object.keys(glyphsBefore).filter(key => key in glyphsAfter)
    const mutationRate = samePositions.filter(key => glyphsBefore[key] !== glyphsAfter[key]).length / samePositions.length
    assert(mutationRate > 0 && mutationRate < .1, 'Only a small percentage of persistent digits should mutate')
    await page.screenshot({ path: path.join(output, 'desktop-hero.png') })
    const geometry = await page.evaluate(() => {
      const wrapper = document.querySelector('section[class*="storySection"]')
      const stage = wrapper.firstElementChild
      const css = getComputedStyle(wrapper)
      return { start: wrapper.getBoundingClientRect().top + scrollY + parseFloat(css.paddingTop) - parseFloat(getComputedStyle(stage).top), distance: wrapper.offsetHeight - stage.offsetHeight - parseFloat(css.paddingTop), stickyTop: parseFloat(getComputedStyle(stage).top) }
    })
    const scroll = async y => { await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y); await wait(1000) }
    const steps = []
    for (const fraction of [.05, .3, .55, .8]) {
      await scroll(geometry.start + geometry.distance * fraction)
      const state = await page.evaluate(() => ({ step: +document.querySelector('[data-story-step]').dataset.storyStep, top: document.querySelector('section[class*="storySection"]').firstElementChild.getBoundingClientRect().top }))
      steps.push(state.step)
      assert(Math.abs(state.top - geometry.stickyTop) < 2, 'Story stage should remain sticky')
    }
    assert.deepEqual(steps, [0, 1, 2, 3])
    const storyGap = await page.evaluate(() => {
      const active = document.querySelector('[data-story-step] [aria-hidden="false"]')
      return document.querySelector('[class*="storyActions"]').getBoundingClientRect().top - active.querySelector('p:last-child').getBoundingClientRect().bottom
    })
    assert(storyGap >= 30, 'Story descriptions need breathing room above buttons')
    await scroll(geometry.start + geometry.distance * .05)
    await page.screenshot({ path: path.join(output, 'desktop-story.png') })
    const phases = []
    const stationaryY = await page.evaluate(() => scrollY)
    const started = Date.now()
    while (Date.now() - started < 33000) {
      const phase = await page.$eval('[data-demo-phase]', el => +el.dataset.demoPhase)
      if (phases.at(-1) !== phase) {
        phases.push(phase)
        await wait(700)
        await page.screenshot({ path: path.join(output, `demo-${phase}.png`) })
      }
      if (new Set(phases).size === 10 && phases.length >= 11) break
      await wait(250)
    }
    assert.equal(new Set(phases).size, 10, 'All ten demo states must run while scroll is stationary')
    assert(phases.some((phase, i) => i && phase === 0 && phases[i - 1] === 9), 'Demo must loop from final to initial state')
    assert.equal(await page.evaluate(() => scrollY), stationaryY)
    await page.click('button[class*="demoPlayback"]')
    const paused = await page.$eval('[data-demo-phase]', el => el.dataset.demoPhase)
    await wait(4500)
    assert.equal(await page.$eval('[data-demo-phase]', el => el.dataset.demoPhase), paused)
    await page.click('button[class*="demoPlayback"]')
    await page.waitForFunction(phase => document.querySelector('[data-demo-phase]').dataset.demoPhase !== phase, { timeout: 5000 }, paused)
    await scroll(geometry.start + geometry.distance + 100)
    const releasedTop = await page.$eval('section[class*="storySection"]', el => el.firstElementChild.getBoundingClientRect().top)
    assert(releasedTop < geometry.stickyTop - 50, 'Stage must release at wrapper end')
    await scroll(await page.$eval('#ai-outputs-title', el => el.getBoundingClientRect().top + scrollY - 130))
    await page.screenshot({ path: path.join(output, 'desktop-outputs.png') })
    await scroll(await page.$eval('#early-access', el => el.getBoundingClientRect().top + scrollY))
    await page.screenshot({ path: path.join(output, 'desktop-cta.png') })

    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 })
    await scroll(0)
    await page.screenshot({ path: path.join(output, 'mobile-hero.png') })
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390, 'No horizontal overflow on mobile')
    const mobileCanvas = await page.$eval('canvas[data-source-ready]', el => ({ backing: el.width, css: el.getBoundingClientRect().width }))
    assert.equal(mobileCanvas.backing, Math.round(mobileCanvas.css * 3))
    await scroll(await page.$eval('section[class*="storySection"]', el => el.getBoundingClientRect().top + scrollY + 180))
    await page.screenshot({ path: path.join(output, 'mobile-story.png') })
    await scroll(await page.$eval('#ai-outputs-title', el => el.getBoundingClientRect().top + scrollY - 130))
    await page.screenshot({ path: path.join(output, 'mobile-outputs.png') })

    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
    await page.goto(`${base}/product/tokenomics-ai`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('canvas[data-source-ready="true"]')
    assert.equal(await page.$eval('[data-demo-phase]', el => +el.dataset.demoPhase), 9)
    const still = await page.$eval('canvas', el => el.toDataURL())
    await wait(300)
    assert.equal(await page.$eval('canvas', el => el.toDataURL()), still, 'Reduced-motion canvas should remain static')
    const cdp = await page.createCDPSession()
    await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: output })
    await scroll(await page.$eval('section[class*="storySection"]', el => el.getBoundingClientRect().top + scrollY + 180))
    await page.click('button[class*="download"]')
    const pdfPath = path.join(output, 'nova-protocol-demo.pdf')
    for (let attempt = 0; attempt < 30; attempt++) { if (await fs.stat(pdfPath).catch(() => null)) break; await wait(500) }
    assert.equal((await fs.readFile(pdfPath)).subarray(0, 4).toString(), '%PDF')
    await scroll(0)
    await page.click('section[aria-labelledby="tokenomics-ai-title"] button')
    assert(await page.$eval('dialog', el => el.open))
    assert.equal(await page.evaluate(() => document.activeElement.name), 'email')
    await page.keyboard.press('Escape')
    assert.equal(await page.$eval('dialog', el => el.open), false)
    await page.click('section[aria-labelledby="tokenomics-ai-title"] button')
    await page.type('input[name="email"]', 'example@example.com')
    await page.type('input[name="project"]', 'Runtime verification')
    await page.select('select[name="goal"]', 'Investor round')
    rejectContact = true
    await page.click('dialog button[type="submit"]')
    await page.waitForSelector('dialog [role="alert"]')
    rejectContact = false
    await page.click('dialog button[type="submit"]')
    await page.waitForSelector('dialog [role="status"]')
    assert.equal(submissions, 2)
    await page.keyboard.press('Escape')

    await page.goto(base, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('h1')
    assert(await page.$('footer'), 'Footer must remain on existing pages')
    const homeAfter = await page.evaluate(() => ({ bg: getComputedStyle(document.body).backgroundColor, font: getComputedStyle(document.body).fontFamily, title: getComputedStyle(document.querySelector('h1')).fontSize }))
    // h1 is responsive; compare it at the original viewport.
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 })
    homeAfter.title = await page.$eval('h1', el => getComputedStyle(el).fontSize)
    assert.deepEqual(homeAfter, homeStyles, 'Existing page global styling must remain unchanged')
    assert.deepEqual(errors, [], 'No runtime page errors')
    console.log(JSON.stringify({ canvas, mutationRate, steps, phases, mobileCanvas, demoPdfDownloaded: true, submissionsMocked: submissions, existingPageUnchanged: true, errors, screenshots: output }, null, 2))
  } finally { await browser.close() }
}
run().catch(error => { console.error(error); process.exitCode = 1 })
