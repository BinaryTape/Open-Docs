<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    required: false
  }
})
</script>

<template>
  <ol v-if="props.type">
    <slot/>
  </ol>

  <ul v-else>
    <slot/>
  </ul>
</template>