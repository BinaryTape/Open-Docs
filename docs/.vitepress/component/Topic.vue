<script setup lang="ts">

import {useSlots, type VNode} from "vue";
import TopicTitle from "./TopicTitle.vue";

const slots = useSlots()

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

let isStartingPage = false
let ref = ''

slots.default?.()?.forEach((vnode: VNode) => {
  if (typeof vnode.type === 'object' && vnode.type.__name === 'Page') {
    isStartingPage = true;
  }
  if (typeof vnode.type === 'string' && vnode.type.toLowerCase() === 'primary-label') {
    ref = vnode.props['ref'].toString()
  }
})
</script>

<template>
  <TopicTitle v-if="!isStartingPage" :labelRef="ref" :title="props.title"/>
  <slot/>
</template>

<style scoped>

</style>