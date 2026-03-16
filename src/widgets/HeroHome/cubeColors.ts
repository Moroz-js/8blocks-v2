/**
 * Color palette for the isometric cubes canvas (HeroCanvas).
 * Edit these to retheme the cubes independently from CSS.
 * Values are RGB channel strings for use in rgba().
 */

export const CUBE_COLORS = {
  // Base palette (matches _variables.scss $pal-* values)
  roseLight:   '217, 173, 208',  // $pal-rose      #D9ADD0
  magenta:     '194, 78, 136',   // $pal-magenta   #C24E88
  purple:      '142, 74, 189',   // $pal-purple    #8E4ABD
  warmWhite:   '227, 208, 213',  // $pal-warm-white #E3D0D5

  // Dark shadow tones (cube side faces)
  darkMagenta: '80, 20, 80',
  darkPurple:  '50, 10, 60',
} as const

// Opacity multipliers per face (tweak to change cube depth/contrast)
export const CUBE_OPACITY = {
  glowPrimary:   0.20,
  glowSecondary: 0.08,
  topFaceLight:  0.42,
  topFaceDark:   0.30,
  topEdge:       0.90,
  leftFaceTop:   0.58,
  leftFaceBot:   0.72,
  leftEdge:      0.50,
  rightFaceTop:  0.52,
  rightFaceBot:  0.65,
  rightEdge:     0.44,
  glint:         0.28,
} as const
