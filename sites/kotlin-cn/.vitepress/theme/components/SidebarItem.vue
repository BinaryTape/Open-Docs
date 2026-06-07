<script setup lang="ts">
import { useRoute } from 'vitepress'
import { computed } from 'vue'

const props = defineProps<{
  item: {
    text?: string
    link?: string
    href?: string
    items?: any[]
  }
}>()

const route = useRoute()

const target = computed(() => props.item.link || props.item.href || '')
const isActive = computed(() => {
  if (!target.value) return false
  const current = route.path.replace(/\/$/, '')
  const link = target.value.replace(/\/$/, '')
  return current === link
})
const hasActiveChild = computed(() => containsActive(props.item))
const isGroup = computed(() => Array.isArray(props.item.items) && props.item.items.length > 0)

function containsActive(item: any): boolean {
  if (!item) return false
  if (item.link && route.path.replace(/\/$/, '') === item.link.replace(/\/$/, '')) return true
  return Array.isArray(item.items) && item.items.some(containsActive)
}
</script>

<template>
  <div class="kt-sidebar-node">
    <a v-if="target && !isGroup" class="kt-sidebar-link" :class="{ active: isActive }" :href="target">
      {{ item.text }}
    </a>

    <details v-else-if="isGroup" class="kt-sidebar-group" :open="hasActiveChild">
      <summary>{{ item.text }}</summary>
      <div class="kt-sidebar-children">
        <SidebarItem
          v-for="child in item.items"
          :key="`${child.text}-${child.link || child.href || ''}`"
          :item="child"
        />
      </div>
    </details>

    <div v-else-if="item.text" class="kt-sidebar-heading">
      {{ item.text }}
    </div>
  </div>
</template>

