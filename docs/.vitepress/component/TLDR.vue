<script setup lang="ts">

</script>

<template>
  <div class="ws-tldr">
    <slot/>
  </div>
</template>

<style scoped>
.ws-tldr {
  display: inline-flex;
  flex-flow: column nowrap;
  padding: 16px;
  border: 1px solid #d1d1d2;
  border-radius: 6px;
}

.ws-tldr img {
  vertical-align: middle !important;
  display: inline-block !important;
}

.ws-tldr :deep(p) {
  margin: 0;
}
</style>