<script setup lang="ts">
import SidebarItem from './SidebarItem.vue'

defineProps<{
  docs: Array<{ key: string; label: string; home: string }>
  activeKey: string
  items: any[]
}>()
</script>

<template>
  <aside class="kt-sidebar">
    <div class="kt-sidebar-tabs" role="tablist" aria-label="Documentation sections">
      <a
        v-for="doc in docs"
        :key="doc.key"
        :href="doc.home"
        :class="{ active: activeKey === doc.key }"
      >
        {{ doc.label }}
      </a>
    </div>
    <nav class="kt-sidebar-list" aria-label="Current documentation navigation">
      <SidebarItem v-for="item in items" :key="`${item.text}-${item.link || item.href || ''}`" :item="item" />
    </nav>
  </aside>
</template>

