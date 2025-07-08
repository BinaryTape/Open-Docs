<script setup lang="ts">

import { provide, ref } from 'vue'
const props = defineProps({
  collapsible: {
    type: String,
    required: false
  }
})

// 使用 ref 包装布尔值，使其具有响应性
const isExpanded = ref(props.collapsible != null)
provide('isExpanded', isExpanded)

</script>

<template>
  <div class="ws-deflist">
    <slot/>
  </div>
</template>

<style scoped>
.ws-deflist {
  margin: 24px 0;
}
</style>