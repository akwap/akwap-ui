/**
 * Accent palette: 12 hues with theme-aware roles (see styles/themes.css).
 * Class strings are written out in full so Tailwind can find them.
 */
export const ACCENT_COLORS = ['red', 'orange', 'amber', 'lime', 'green', 'teal', 'cyan', 'blue', 'indigo', 'purple', 'magenta', 'pink'] as const
export type AccentColor = (typeof ACCENT_COLORS)[number]

export interface AccentClasses {
  /** Text or icon in the accent colour (4.5:1 on surfaces and on its tint). */
  text: string
  /** Filled background; pair with `text-on-accent`. */
  strong: string
  /** Subtle tint background. */
  background: string
  /** Border that matches the tint. */
  border: string
}

export const accentClasses: Record<AccentColor, AccentClasses> = {
  red: { text: 'text-red', strong: 'bg-red-strong', background: 'bg-red-background', border: 'border-red-border' },
  orange: { text: 'text-orange', strong: 'bg-orange-strong', background: 'bg-orange-background', border: 'border-orange-border' },
  amber: { text: 'text-amber', strong: 'bg-amber-strong', background: 'bg-amber-background', border: 'border-amber-border' },
  lime: { text: 'text-lime', strong: 'bg-lime-strong', background: 'bg-lime-background', border: 'border-lime-border' },
  green: { text: 'text-green', strong: 'bg-green-strong', background: 'bg-green-background', border: 'border-green-border' },
  teal: { text: 'text-teal', strong: 'bg-teal-strong', background: 'bg-teal-background', border: 'border-teal-border' },
  cyan: { text: 'text-cyan', strong: 'bg-cyan-strong', background: 'bg-cyan-background', border: 'border-cyan-border' },
  blue: { text: 'text-blue', strong: 'bg-blue-strong', background: 'bg-blue-background', border: 'border-blue-border' },
  indigo: { text: 'text-indigo', strong: 'bg-indigo-strong', background: 'bg-indigo-background', border: 'border-indigo-border' },
  purple: { text: 'text-purple', strong: 'bg-purple-strong', background: 'bg-purple-background', border: 'border-purple-border' },
  magenta: { text: 'text-magenta', strong: 'bg-magenta-strong', background: 'bg-magenta-background', border: 'border-magenta-border' },
  pink: { text: 'text-pink', strong: 'bg-pink-strong', background: 'bg-pink-background', border: 'border-pink-border' },
}

export const isAccentColor = (v: unknown): v is AccentColor => typeof v === 'string' && (ACCENT_COLORS as readonly string[]).includes(v)

/** Stable accent for a string (e.g. a person's name), so it always gets the same colour. */
export function accentFor(key: string): AccentColor {
  let h = 0
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return ACCENT_COLORS[h % ACCENT_COLORS.length]!
}
