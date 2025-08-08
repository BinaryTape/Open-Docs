<script setup lang="ts">
import {useSlots, type VNode} from 'vue'

const props = defineProps({
  title : {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  }
})

const slots = useSlots()

let isHeading = false
slots.default?.()?.forEach((vnode: VNode) => {
  if (typeof vnode.type === 'object' && vnode.type.__name === 'Chapter') {
    isHeading = true
  }
})

</script>

<template>
  <div class="ws-chapter">
    <h1 :id="props.id" v-if="isHeading">
      {{ props.title }}
      <a class="header-anchor" :href="`#${props.id}`"></a>
    </h1>
    <h2 :id="props.id" v-else>
      {{ props.title }}
      <a class="header-anchor" :href="`#${props.id}`"></a>
    </h2>
    <slot/>
  </div>
</template>

<style scoped>
.ws-chapter :deep(h2) {
  border: none;
  padding: 0;
}

.ws-chapter :deep(h1) {
  margin: 64px 0 0;
}

.header-anchor {
  top: 0;
}
</style>