<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed } from 'vue'

defineProps<{
  docsMode?: boolean
}>()

const { theme } = useData()
const route = useRoute()
const docs = computed(() => theme.value.communityDocs || [])
const kotlinVersion = computed(() => theme.value.kotlinVersion || '')

function isActive(home: string) {
  if (home.startsWith('/docs/language/')) return route.path.startsWith('/docs/language/')
  if (home.startsWith('/docs/multiplatform/')) return route.path.startsWith('/docs/multiplatform/')
  if (home.startsWith('/docs/koog/')) return route.path.startsWith('/docs/koog/')
  return false
}
</script>

<template>
  <header class="kt-header" :class="{ 'is-docs': docsMode }">
    <a class="kt-brand" href="/" aria-label="Kotlin 中文社区首页">
      <img src="/assets/kotlin-logo-white.svg" alt="Kotlin" />
      <span v-if="kotlinVersion">v{{ kotlinVersion }}</span>
    </a>
    <nav class="kt-top-docs" aria-label="Documentation">
      <span class="kt-docs-label">Docs</span>
      <a
        v-for="doc in docs"
        :key="doc.key"
        :href="doc.home"
        :class="{ active: isActive(doc.home) }"
      >
        {{ doc.label }}
      </a>
    </nav>
  </header>
</template>
