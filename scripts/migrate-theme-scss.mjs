import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src')

const replacements = [
  ['rgba(255, 255, 255, 0.055)', '$bg-secondary'],
  ['rgba(255,255,255,0.055)', '$bg-secondary'],
  ['rgba(255, 255, 255, 0.05)', '$button-ghost-hover-bg'],
  ['rgba(255,255,255,0.05)', '$button-ghost-hover-bg'],
  ['rgba(255, 255, 255, 0.08)', '$bg-tertiary'],
  ['rgba(255,255,255,0.08)', '$bg-tertiary'],
  ['rgba(255, 255, 255, 0.07)', '$border-secondary'],
  ['rgba(255,255,255,0.07)', '$border-secondary'],
  ['rgba(255, 255, 255, 0.06)', '$border-secondary'],
  ['rgba(255,255,255,0.06)', '$border-secondary'],
  ['rgba(255, 255, 255, 0.04)', '$bg-secondary'],
  ['rgba(255,255,255,0.04)', '$bg-secondary'],
  ['rgba(255, 255, 255, 0.03)', '$bg-secondary'],
  ['rgba(255,255,255,0.03)', '$bg-secondary'],
  ['rgba(255, 255, 255, 0.025)', '$bg-secondary'],
  ['rgba(255, 255, 255, 0.02)', '$bg-secondary'],
  ['rgba(255,255,255,0.02)', '$bg-secondary'],
  ['rgba(255, 255, 255, 0.01)', '$bg-secondary'],
  ['rgba(255, 255, 255, 0.1)', '$border-primary'],
  ['rgba(255,255,255,0.1)', '$border-primary'],
  ['rgba(255, 255, 255, 0.12)', '$border-primary'],
  ['rgba(255, 255, 255, 0.13)', '$border-primary'],
  ['rgba(255, 255, 255, 0.14)', '$border-primary'],
  ['rgba(255, 255, 255, 0.15)', '$border-primary'],
  ['rgba(255, 255, 255, 0.2)', '$border-primary'],
  ['rgba(255, 255, 255, 0.25)', '$border-primary'],
  ['rgba(255, 255, 255, 0.3)', '$border-primary'],
  ['rgba(255, 255, 255, 0.35)', '$border-primary'],
  ['rgba(255, 255, 255, 0.4)', '$text-tertiary'],
  ['rgba(255, 255, 255, 0.45)', '$text-secondary'],
  ['rgba(255, 255, 255, 0.5)', '$text-secondary'],
  ['rgba(255, 255, 255, 0.75)', '$text-on-media'],
  ['rgba(255, 255, 255, 0.85)', '$muted-strong'],
  ['rgba(255, 255, 255, 0.7)', '$text-secondary'],
  ['rgba(255, 255, 255, 0.9)', '$glass-highlight'],
  ['rgba(255,255,255,0.9)', '$glass-highlight'],
  ['rgba(255, 255, 255, 1)', '$text-primary'],
  ['rgba(255, 255, 255, 0.18)', '$border-secondary'],
  ['rgba(255, 255, 255, 0.28)', '$text-tertiary'],
  ['color: white', 'color: $text-primary'],
  ['color: #050308', 'color: $button-primary-fg'],
  ['background: #0a0810', 'background: $section-inset-bg'],
  ['background-color: #0a0810', 'background-color: $section-inset-bg'],
  ['#050308', '$button-primary-fg'],
  ['#0a0a0f', '$button-primary-fg'],
  ['rgba(4, 2, 8, 0.20)', '$header-bg'],
  ['rgba(4, 2, 8, 0.97)', '$header-bg-solid'],
  ['rgba(10, 8, 16, 0.92)', '$fab-bg'],
  ['rgba(5, 3, 8, 0.35)', '$overlay-scrim'],
  ['rgba(12, 10, 18, 0.55)', '$card-panel-bg'],
  ['rgba(18, 14, 28, 0.7)', '$card-panel-bg-hover'],
  ['rgba(0, 0, 0, 0.35) 100%', '$cover-scrim 100%'],
  ['linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.35) 100%)', 'linear-gradient(to bottom, transparent 50%, $cover-scrim 100%)'],
  ['background: #f5f3f0', 'background: $benefits-card-bg'],
  ['color: rgba(0, 0, 0, 0.88)', 'color: $benefits-card-text'],
  ['color: rgba(0, 0, 0, 0.08)', 'color: $benefits-card-number'],
  ['background: #1a1a1f', 'background: $about-media-bg'],
  ['background: #222228', 'background: $about-media-bg-hover'],
  ['background: #fff', 'background: $newsletter-input-bg'],
  ['background: #ffffff', 'background: $newsletter-input-bg'],
  ['color: #0e0e12', 'color: $newsletter-input-fg'],
  ['color: #ff6b6b', 'color: $error-fg'],
  ['color: #f87171', 'color: $error-fg'],
  ['border-top-color: #fff', 'border-top-color: $newsletter-input-bg'],
  ['border-top-color: #050308', 'border-top-color: $button-primary-fg'],
  ['border: 2px solid rgba(0, 0, 0, 0.3)', 'border: 2px solid $border-primary'],
  ['box-shadow: 0 12px 32px rgba(255, 255, 255, 0.1)', 'box-shadow: $glass-shadow'],
  ['background: rgba(255, 255, 255, 0.88)', 'background: $button-primary-hover'],
  ['rgba(197, 61, 255, 0.5)', '$focus-accent'],
  ['rgba(197, 61, 255, 0.45)', '$focus-accent'],
  ['rgba(197, 61, 255, 0.3)', '$border-primary'],
  ['rgba(197, 61, 255, 0.1)', '$focus-accent-glow'],
  ['rgba(197, 61, 255, 0.04)', '$focus-accent-bg'],
  ['rgba(197, 61, 255, 0.06)', '$focus-accent-bg'],
  ['rgba(197, 61, 255, 0.85)', 'rgba($pal-magenta, 0.85)'],
  ['rgba(255, 107, 107, 0.08)', '$error-bg'],
  ['rgba(255, 107, 107, 0.2)', '$error-border'],
  ['rgba(117, 251, 99, 0.04)', '$success-bg'],
  ['rgba(117, 251, 99, 0.15)', '$success-bg-strong'],
  ['rgba(117, 251, 99, 0.25)', '$success-border'],
  ['rgba(117, 251, 99, 0.3)', '$success-border'],
  ['color: rgb(80, 220, 140)', 'color: $success-fg-alt'],
  ['border-color: rgba(80, 220, 140, 0.4)', 'border-color: $success-border'],
]

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    if (fs.statSync(p).isDirectory()) walk(p, files)
    else if (name.endsWith('.module.scss')) files.push(p)
  }
  return files
}

const skip = new Set([
  path.normalize('src/shared/ui/Button/Button.module.scss'),
  path.normalize('src/widgets/Header/Header.module.scss'),
  path.normalize('src/shared/ui/ThemeToggle/ThemeToggle.module.scss'),
])

for (const file of walk(root)) {
  const rel = path.relative(path.join(root, '..'), file).replace(/\\/g, '/')
  if (skip.has(rel)) continue
  let content = fs.readFileSync(file, 'utf8')
  if (!content.includes('@use') && !content.includes("@use")) {
    content = `@use '@/shared/styles/variables' as *;\n\n${content}`
  }
  let changed = false
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to)
      changed = true
    }
  }
  if (changed) fs.writeFileSync(file, content)
  console.log(changed ? 'updated' : 'skip', rel)
}
