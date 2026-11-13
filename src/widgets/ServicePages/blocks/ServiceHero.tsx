import type { CSSProperties, ReactNode } from 'react'
import Image, { type StaticImageData } from 'next/image'
import clsx from 'clsx'
import { BinaryScene } from '@/widgets/BinaryArt/BinaryScene'
import type { BinarySceneId } from '@/widgets/BinaryArt/scene/types'
import heroFade from '../assets/hero-fade.webp'
import styles from './ServiceHero.module.scss'

interface ServiceHeroProps {
  /** Binary scene behind the text; or `image` for a full-bleed photo. */
  scene?: BinarySceneId
  image?: StaticImageData
  /** Scene offset from the top of the hero, px (the designer's frame). */
  artTop?: number
  /** Horizontal scene shift, px; a shifted scene fades out on the left. */
  artLeft?: number
  /** Line above the title (badges). */
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** `lg` — Heading 2 (one-word titles), `md` — Heading 3 (long titles), `sm` — Heading 4. */
  titleSize?: 'lg' | 'md' | 'sm'
  /** Content pinned to a bottom corner (partner logos, facts). */
  corner?: ReactNode
  cornerAlign?: 'left' | 'right'
  /** Buttons and facts under the text. */
  children?: ReactNode
  /** `center` — text block centred vertically; `spread` — text on top, actions at the bottom. */
  layout?: 'center' | 'spread'
  /** Extra line between the text and the actions (spread layout). */
  aside?: ReactNode
  /** Small muted line under the actions. */
  footnote?: ReactNode
}

/** Full-bleed service hero with a binary scene, sliding under the site header. */
export function ServiceHero({
  scene,
  image,
  artTop = 0,
  artLeft = 0,
  eyebrow,
  title,
  description,
  titleSize = 'lg',
  children,
  layout = 'center',
  aside,
  footnote,
  corner,
  cornerAlign = 'right',
}: ServiceHeroProps) {
  return (
    <section
      data-under-header
      className={clsx(styles.hero, styles[layout], footnote && styles.withFootnote, image && styles.withImage)}
      style={{ '--art-top': `${artTop}px`, '--art-left': `${artLeft}px` } as CSSProperties}
    >
      {scene && (
        <>
          <div className={clsx(styles.art, artLeft !== 0 && styles.artShifted)}>
            <BinaryScene scene={scene} className={styles.scene} />
          </div>
          <div className={styles.glow} aria-hidden="true" />
          <Image src={heroFade} alt="" className={styles.fadeImage} sizes="100vw" />
        </>
      )}
      {image && <Image src={image} alt="" fill priority sizes="100vw" className={styles.photo} />}
      <div className={styles.fade} aria-hidden="true" />
      <div className={styles.inner}>
        {eyebrow}
        <div className={styles.text}>
          <h1 className={clsx(styles.title, styles[titleSize])}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        {aside}
        {children && <div className={styles.actions}>{children}</div>}
        {footnote && <p className={styles.footnote}>{footnote}</p>}
        {corner && <div className={clsx(styles.corner, cornerAlign === 'left' && styles.cornerLeft)}>{corner}</div>}
      </div>
    </section>
  )
}
