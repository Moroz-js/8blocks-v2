export type PetalTone = 'good' | 'medium' | 'bad'

export interface Petal {
  id: string
  label: string
  tip?: string
  /** 0–1, snapped to the four rings. */
  value: number
  tone: PetalTone
}

/** Ring radii as a share of the outer ring (designer's `result-chart`, flat mode). */
export const PETAL_LEVELS = [0.34, 0.56, 0.78, 1]

/** Tone used by the flat chart for a ring value. */
export function petalTone(value: number): PetalTone {
  if (value <= 0.45) return 'bad'
  if (value <= 0.67) return 'medium'
  return 'good'
}
