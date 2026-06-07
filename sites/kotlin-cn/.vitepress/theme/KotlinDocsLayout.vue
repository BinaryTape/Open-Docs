<script setup lang="ts">
import { Content, useData, useRoute } from 'vitepress'
import { computed } from 'vue'
import KotlinHeader from './components/KotlinHeader.vue'
import KotlinSidebar from './components/KotlinSidebar.vue'

const { theme } = useData()
const route = useRoute()

const docs = computed(() => theme.value.communityDocs || [])
const activeKey = computed(() => {
  if (route.path.startsWith('/docs/multiplatform/')) return 'multiplatform'
  if (route.path.startsWith('/docs/koog/')) return 'koog'
  return 'language'
})
const activeDoc = computed(() => docs.value.find((doc) => doc.key === activeKey.value) || docs.value[0])
</script>

<template>
  <div class="kt-page kt-doc-page">
    <KotlinHeader docs-mode />
    <div class="kt-doc-shell">
      <KotlinSidebar :docs="docs" :active-key="activeKey" :items="activeDoc?.sidebar || []" />
      <main class="kt-doc-main">
        <article class="vp-doc kt-doc-content">
          <Content />
        </article>
      </main>
    </div>
  </div>
</template>
