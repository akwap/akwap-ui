import { reactive } from 'vue'
import { users as seed } from '@/services/mockData'
import type { User } from '@/types'

const state = reactive<{ list: User[] }>({ list: seed.map((u) => ({ ...u })) })
let nextId = seed.length + 1

/** In-memory user CRUD used by the User management page. */
export function useUsers() {
  return {
    state,
    add(u: Omit<User, 'id'>) {
      const user = { ...u, id: nextId++ }
      state.list.unshift(user)
      return user
    },
    update(id: number, patch: Partial<User>) {
      const u = state.list.find((x) => x.id === id)
      if (u) Object.assign(u, patch)
    },
    remove(ids: number[]) {
      state.list = state.list.filter((u) => !ids.includes(u.id))
    },
  }
}
