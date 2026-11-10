import { reactive } from 'vue'
import { currentUser } from '@/services/mockData'
import type { Role } from '@/types'

/**
 * Mock authentication/session store. `role` drives role-based navigation;
 * switch it from the profile menu to preview what other roles see.
 */
export const session = reactive({
  signedIn: true,
  user: { ...currentUser },
  role: currentUser.role as Role,
})

export function signIn(email: string) {
  session.signedIn = true
  session.user.email = email || currentUser.email
}
export function signOut() {
  session.signedIn = false
}
export function hasRole(roles?: string[]) {
  return !roles || roles.includes(session.role)
}
