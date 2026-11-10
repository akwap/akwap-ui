export interface Series {
  name: string
  values: number[]
  /** 1–6: categorical slot. Assigned by entity, never by rank. */
  slot?: 1 | 2 | 3 | 4 | 5 | 6
}

export const slotVar = (slot: number) => `var(--ak-color-data-${slot})`

/** "Nice" axis ticks: 0 … max rounded to 1/2/5 × 10^n steps. */
export function niceTicks(max: number, count = 4): number[] {
  if (max <= 0) return [0]
  const raw = max / count
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) ?? raw
  const top = Math.ceil(max / step) * step
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => +(i * step).toFixed(6))
}

export function compactTick(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 10_000) return `${+(n / 1000).toFixed(0)}K`
  return n.toLocaleString('en-US')
}
