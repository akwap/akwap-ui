/** ISO date helpers working in local time with 'YYYY-MM-DD' strings. */
export const pad = (n: number) => String(n).padStart(2, '0')
export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export function fromISODate(s: string | null | undefined): Date | null {
  if (!s) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return isNaN(d.getTime()) ? null : d
}
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
export const addMonths = (d: Date, n: number) => {
  const r = new Date(d.getFullYear(), d.getMonth() + n, 1)
  const last = new Date(r.getFullYear(), r.getMonth() + 1, 0).getDate()
  r.setDate(Math.min(d.getDate(), last))
  return r
}
export const sameDay = (a: Date | null, b: Date | null) => !!a && !!b && toISODate(a) === toISODate(b)
export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
export const formatHuman = (iso: string | null | undefined) => {
  const d = fromISODate(iso)
  return d ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d) : ''
}
/** Parses user-typed dates: 2026-11-10, 11/10/2026, Nov 10 2026, 10 Nov 2026. */
export function parseLooseDate(input: string): string | null {
  const s = input.trim()
  if (!s) return null
  const iso = fromISODate(s)
  if (iso) return toISODate(iso)
  const us = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s)
  if (us) {
    const d = new Date(Number(us[3]), Number(us[1]) - 1, Number(us[2]))
    return isNaN(d.getTime()) ? null : toISODate(d)
  }
  const t = Date.parse(s)
  return isNaN(t) ? null : toISODate(new Date(t))
}
