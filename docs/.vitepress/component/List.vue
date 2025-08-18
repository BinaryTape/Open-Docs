<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    required: false
  },
  columns: {
    type: String,
    required: false
  }
})
</script>

<template>
  <ol v-if="props.type">
    <slot/>
  </ol>

  <ul v-else :class="columns ? 'ws-flex-list' : ''">
    <slot/>
  </ul>
</template>

<style scoped>
.ws-flex-list {
  display: flex;
  flex-flow: wrap;
  padding: 0;
  list-style: none;
}

.ws-flex-list :deep(li){
  flex-basis: 50%;
  padding-right: 16px;
  margin-top: 24px;
}

.ws-flex-list :deep(img) {
  height: revert-layer;
}

</style>