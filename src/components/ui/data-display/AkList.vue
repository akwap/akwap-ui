<script setup lang="ts" generic="T extends { id: string | number }">
/**
 * AkList — vertical list of rows with media, primary/secondary text and
 * trailing content. Use slots to customise; set `dividers` for separators.
 */
withDefaults(defineProps<{ items: T[]; dividers?: boolean; label?: string; interactive?: boolean }>(), { dividers: true })
defineEmits<{ select: [item: T] }>()
</script>

<template>
  <ul :aria-label="label" :class="dividers ? 'divide-y divide-line-subtle' : 'flex flex-col gap-1'">
    <li v-for="item in items" :key="item.id">
      <component
        :is="interactive ? 'button' : 'div'"
        :type="interactive ? 'button' : undefined"
        class="flex w-full items-center gap-3 py-3 text-left"
        :class="interactive && '-mx-2 w-[calc(100%+16px)] rounded-md px-2 hover:bg-subtle-hover focus-ring'"
        @click="interactive && $emit('select', item)"
      >
        <slot name="media" :item="item" />
        <div class="min-w-0 flex-1">
          <slot :item="item" />
        </div>
        <slot name="trailing" :item="item" />
      </component>
    </li>
  </ul>
</template>
