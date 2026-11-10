<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { BarChart3, Home, Moon, Search, Users } from '@lucide/vue'
import { AkButton, AkCommandPalette, AkKbd, useTheme, type Command } from '@/design-system'

const open = ref(false)
const router = useRouter()
const { setTheme } = useTheme()
const commands: Command[] = [
  { id: 'home', label: 'Go to overview', group: 'Pages', icon: Home, run: () => router.push('/dashboard') },
  { id: 'users', label: 'Go to users', group: 'Pages', icon: Users, keywords: 'members people', run: () => router.push('/dashboard/users') },
  { id: 'analytics', label: 'Go to analytics', group: 'Pages', icon: BarChart3, run: () => router.push('/dashboard/analytics') },
  { id: 'dark', label: 'Switch to dark theme', group: 'Actions', icon: Moon, run: () => setTheme('dark') },
]
</script>

<template>
  <AkButton :icon="Search" @click="open = true">
    Search commands <AkKbd class="ml-2">Ctrl</AkKbd><AkKbd>K</AkKbd>
  </AkButton>
  <AkCommandPalette v-model:open="open" :commands="commands" />
</template>
