<script setup lang="ts">
import {inject, ref, Ref, useSlots, type VNode} from 'vue'

const slots = useSlots()

const props = defineProps({
  title: {
    type: String,
    required: false
  },
  id: {
    type: String,
    required: false
  }
})

let titleChildren;
slots.default?.()?.forEach((vnode: VNode) => {
  if (typeof vnode.type === 'string' && vnode.type.toLowerCase() === 'title' ) {
    titleChildren = vnode.children
  }
})

const isExpanded = inject('isExpanded') as Ref<boolean>
const titleContent = ref(titleChildren ? titleChildren : '')
</script>

<template>
  <div v-if="isExpanded" :id>
    <details class="details custom-block">
      <summary>{{ props.title }}</summary>
      <div class="ws-def-collapse-content">
        <slot/>
      </div>
    </details>
  </div>

  <div v-if="!isExpanded" class="ws-def" :id>
    <dt v-if="title" class="ws-def-title">{{ props.title }}</dt>
    <dt v-else class="ws-def-title"><div v-html="titleContent"/></dt>
    <dd class="ws-def-content">
      <slot/>
    </dd>
  </div>
</template>


<style scoped>
.ws-def {
  margin-top: 16px;
  padding: 16px;
  border-radius: 8px;
  border-color: var(--vp-custom-block-details-border);
  color: var(--vp-custom-block-details-text);
  background-color: var(--vp-custom-block-details-bg);
}
.ws-def-title {
  float: left;
  width: calc(33.3% -  32px);
  font-weight: 700;
  font-size: 1em;
}

.ws-def-collapse-content {
  padding: 0 16px;
}

.ws-def-content {
  padding-left: 33.3%;
}

.ws-def-content > *:first-child {
  margin: 0;
}

.ws-def-content > *:not(:first-child) {
  margin: 12px 0 0 !important;
}

.ws-def-collapse-content :deep(i) {
  font-style: normal;
  font-weight: bold;
}

</style>