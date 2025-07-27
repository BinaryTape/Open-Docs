<script setup lang="ts">
import { useSlots, type VNode } from 'vue'

const slots = useSlots()

let titleContent = ''

slots.default?.()?.forEach((vnode: VNode) => {
  const children = vnode.children

  if (typeof vnode.type === 'string' && vnode.type.toLowerCase() === 'title') {
    titleContent = typeof children === 'string' ? children : ''
  }
})
</script>

<template>
  <div class="page">
    <h1 v-if="titleContent" class="page-title">{{ titleContent }}</h1>
    <slot/>
  </div>
</template>