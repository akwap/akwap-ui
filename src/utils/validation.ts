export type Rule<T = string> = (value: T) => string | true

export const rules = {
  required: (label = 'This field'): Rule<unknown> => (v) =>
    (Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && String(v).trim() !== '' && v !== false) ||
    `${label} is required`,
  email: (): Rule => (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Enter a valid email address, like name@company.com',
  minLength: (n: number, label = 'This field'): Rule => (v) => !v || v.length >= n || `${label} must be at least ${n} characters`,
  phone: (): Rule => (v) => !v || /^\+?[0-9\s()-]{7,20}$/.test(v) || 'Enter a valid phone number, like +254 712 345 678',
  matches: (other: () => string, message = 'Values do not match'): Rule => (v) => v === other() || message,
  strongPassword: (): Rule => (v) => !v || passwordStrength(v).score >= 2 || 'Choose a stronger password',
}

export function validate<T>(value: T, list: Rule<T>[]): string | null {
  for (const r of list) {
    const res = r(value)
    if (res !== true) return res
  }
  return null
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4
  label: 'Too short' | 'Weak' | 'Fair' | 'Good' | 'Strong'
  checks: { label: string; met: boolean }[]
}

export function passwordStrength(pw: string): PasswordStrength {
  const checks = [
    { label: 'At least 8 characters', met: pw.length >= 8 },
    { label: 'Upper and lower case letters', met: /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
    { label: 'At least one number', met: /\d/.test(pw) },
    { label: 'At least one symbol', met: /[^A-Za-z0-9]/.test(pw) },
  ]
  if (pw.length < 8) return { score: pw.length ? 1 : 0, label: pw.length ? 'Too short' : 'Too short', checks }
  const met = checks.filter((c) => c.met).length
  const score = Math.min(4, Math.max(1, met - (pw.length >= 12 ? 0 : 1) + (pw.length >= 14 ? 1 : 0))) as PasswordStrength['score']
  const label = (['Too short', 'Weak', 'Fair', 'Good', 'Strong'] as const)[score]
  return { score, label, checks }
}
