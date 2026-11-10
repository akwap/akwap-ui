/**
 * Mock auth API. Simulates latency and the error cases the auth pages
 * demonstrate. Swap these for real calls in your application.
 */
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export class AuthError extends Error {}

export const DEMO_PASSWORD = 'Akwap!2026'

export async function login(email: string, password: string) {
  await wait(900)
  if (email.toLowerCase() === 'locked@akwap.example') throw new AuthError('This account is locked. Contact your administrator.')
  if (password !== DEMO_PASSWORD) throw new AuthError('The email or password is incorrect. Try again or reset your password.')
  return { email }
}

export async function register(email: string) {
  await wait(1000)
  if (email.toLowerCase() === 'taken@akwap.example') throw new AuthError('An account with this email already exists.')
  return { email }
}

export async function requestPasswordReset(email: string) {
  await wait(800)
  if (email.toLowerCase().endsWith('@blocked.example')) throw new AuthError('We could not send email to this address. Try another one.')
  return { email }
}

export async function resetPassword(token: string) {
  await wait(900)
  if (token === 'expired') throw new AuthError('expired')
  return true
}

export async function resendVerification() {
  await wait(700)
  return true
}
