<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

const props = defineProps<{
  href: string
  summary: string
  badge?: string
}>()

const is640 = useMediaQuery('(min-width: 640px)')
</script>

<template>
  <div :class="['ws-card', is640 ? 'ws-col-6' : 'ws-col-12']">
    <a :href="props.href" class="ws-card-link">
      <h3><slot/></h3>
      <p>{{ props.summary }}</p>
    </a>
  </div>
</template>

<style scoped>
.ws-col-12 {
  --ws-horizontal-layout-gutter: 0;
  min-width: 100%;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.ws-card {
  padding: 24px;
  margin-bottom: 32px;
  overflow: hidden;
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;
  cursor: pointer;
  border-color: var(--vp-c-divider);
  transition: color .1s, background-color .1s, border-color .1s;
}

.ws-card:hover {
  border-color: var(--vp-c-text-2);
}

.ws-card-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.ws-card-link :deep(h3) {
  margin: 0;
}

.ws-card-link :deep(p) {
  margin: 16px 0 0;
  color: var(--vp-c-text-2);
  font-size: 16px;
}

.ws-card-link:hover {
  color: var(--vp-c-text-1);
}
</style>
