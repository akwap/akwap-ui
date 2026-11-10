<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue'
import { ChevronDown } from '@lucide/vue'
import { RouterLink, useRoute } from 'vue-router'
import AkTooltip from '../overlays/AkTooltip.vue'
import AkMenu from '../overlays/AkMenu.vue'

export interface NavItem {
  label: string
  to?: string
  icon?: Component
  badge?: string | number
  /** Visually emphasised count (e.g. unread). */
  badgeIntent?: 'brand' | 'danger' | 'neutral'
  children?: NavItem[]
  /** Only show to users with one of these roles. Filtered by the parent. */
  roles?: string[]
  exact?: boolean
}
export interface NavSection {
  title?: string
  items: NavItem[]
}

/**
 * AkNavList — vertical navigation for sidebars and drawers.
 * Supports sections, nested items (disclosure), badges, active route
 * highlighting and a collapsed icon-only mode with tooltips and flyouts.
 */
const props = withDefaults(defineProps<{ sections: NavSection[]; collapsed?: boolean; label?: string }>(), { label: 'Main' })
const emit = defineEmits<{ navigate: [] }>()
const route = useRoute()

function isActive(item: NavItem): boolean {
  if (item.to) {
    if (item.exact ? route.path === item.to : route.path === item.to || route.path.startsWith(item.to + '/')) return true
  }
  return !!item.children?.some(isActive)
}
const expanded = ref<Record<string, boolean>>({})
watch(
  () => route.path,
  () => {
    for (const s of props.sections) for (const it of s.items) if (it.children && isActive(it)) expanded.value[it.label] = true
  },
  { immediate: true },
)
const badgeCls = (i: NavItem) =>
  ({ brand: 'bg-brand text-on-brand', danger: 'bg-danger-strong text-on-brand', neutral: 'bg-surface-selected text-secondary' })[i.badgeIntent ?? 'neutral']
const itemBase =
  'group relative flex w-full items-center gap-3 rounded-md text-body-1 transition-colors duration-faster focus-ring-inset min-h-9'
const activeCls = 'bg-surface-selected font-semibold text-primary'
const idleCls = 'text-secondary hover:bg-subtle-hover hover:text-primary'
const anyCollapsed = computed(() => props.collapsed)
</script>

<template>
  <nav :aria-label="label" class="flex flex-col gap-4">
    <div v-for="(section, si) in sections" :key="si" class="flex flex-col gap-0.5">
      <h3 v-if="section.title && !anyCollapsed" class="px-3 pb-1 text-caption-1-strong tracking-wide text-tertiary uppercase">{{ section.title }}</h3>
      <div v-else-if="section.title && si > 0" class="mx-3 mb-1 h-px bg-line-subtle" role="presentation" />
      <ul class="flex flex-col gap-0.5">
        <li v-for="item in section.items" :key="item.label">
          <!-- Collapsed: icon-only with tooltip / flyout -->
          <template v-if="collapsed">
            <AkMenu v-if="item.children" :items="item.children.map((c) => ({ label: c.label, to: c.to, icon: c.icon }))" placement="right" :label="item.label">
              <template #trigger="{ attrs }">
                <AkTooltip :content="item.label" placement="right" relationship="label">
                  <template #default="{ tooltipAttrs }">
                    <button v-bind="{ ...attrs, ...tooltipAttrs }" type="button" :class="[itemBase, 'justify-center px-0', isActive(item) ? activeCls : idleCls]">
                      <component :is="item.icon" class="size-5" :class="isActive(item) && 'text-brand'" aria-hidden="true" />
                    </button>
                  </template>
                </AkTooltip>
              </template>
            </AkMenu>
            <AkTooltip v-else :content="item.badge ? `${item.label} (${item.badge})` : item.label" placement="right" relationship="label">
              <template #default="{ tooltipAttrs }">
                <RouterLink
                  :to="item.to ?? '#'"
                  v-bind="tooltipAttrs"
                  :class="[itemBase, 'justify-center px-0', isActive(item) ? activeCls : idleCls]"
                  :aria-current="isActive(item) ? 'page' : undefined"
                  @click="emit('navigate')"
                >
                  <span v-if="isActive(item)" class="absolute inset-y-2 left-0 w-[3px] rounded-full bg-brand" aria-hidden="true" />
                  <component :is="item.icon" class="size-5" :class="isActive(item) && 'text-brand'" aria-hidden="true" />
                  <span v-if="item.badge" class="absolute top-1 right-1 size-2 rounded-full" :class="item.badgeIntent === 'danger' ? 'bg-danger-strong' : 'bg-brand'" aria-hidden="true" />
                </RouterLink>
              </template>
            </AkTooltip>
          </template>

          <!-- Expanded -->
          <template v-else>
            <button
              v-if="item.children"
              type="button"
              :class="[itemBase, 'px-3', isActive(item) ? 'font-semibold text-primary' : idleCls]"
              :aria-expanded="expanded[item.label] ? 'true' : 'false'"
              @click="expanded[item.label] = !expanded[item.label]"
            >
              <component :is="item.icon" v-if="item.icon" class="size-5 shrink-0" :class="isActive(item) && 'text-brand'" aria-hidden="true" />
              <span class="flex-1 truncate text-left">{{ item.label }}</span>
              <ChevronDown class="size-4 shrink-0 text-tertiary transition-transform duration-fast" :class="expanded[item.label] && 'rotate-180'" aria-hidden="true" />
            </button>
            <RouterLink
              v-else
              :to="item.to ?? '#'"
              :class="[itemBase, 'px-3', isActive(item) ? activeCls : idleCls]"
              :aria-current="isActive(item) ? 'page' : undefined"
              @click="emit('navigate')"
            >
              <span v-if="isActive(item)" class="absolute inset-y-2 left-0 w-[3px] rounded-full bg-brand" aria-hidden="true" />
              <component :is="item.icon" v-if="item.icon" class="size-5 shrink-0" :class="isActive(item) && 'text-brand'" aria-hidden="true" />
              <span class="flex-1 truncate">{{ item.label }}</span>
              <span v-if="item.badge !== undefined" class="min-w-5 rounded-full px-1.5 text-center text-caption-1 font-semibold" :class="badgeCls(item)">{{ item.badge }}</span>
            </RouterLink>
            <ul v-if="item.children && expanded[item.label]" class="mt-0.5 flex flex-col gap-0.5">
              <li v-for="child in item.children" :key="child.label">
                <RouterLink
                  :to="child.to ?? '#'"
                  :class="[itemBase, 'min-h-8 pr-3 pl-11', isActive(child) ? activeCls : idleCls]"
                  :aria-current="isActive(child) ? 'page' : undefined"
                  @click="emit('navigate')"
                >
                  <span v-if="isActive(child)" class="absolute inset-y-2 left-0 w-[3px] rounded-full bg-brand" aria-hidden="true" />
                  <span class="flex-1 truncate">{{ child.label }}</span>
                  <span v-if="child.badge !== undefined" class="rounded-full px-1.5 text-caption-1 font-semibold" :class="badgeCls(child)">{{ child.badge }}</span>
                </RouterLink>
              </li>
            </ul>
          </template>
        </li>
      </ul>
    </div>
  </nav>
</template>
