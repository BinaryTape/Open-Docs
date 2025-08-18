<script setup lang="ts">

</script>

<template>
  <div class="ws-procedure">
    <ol>
      <slot/>
    </ol>
  </div>
</template>

<style scoped>
.ws-procedure {
  box-sizing: border-box;
  padding: 0 16px;
  margin-bottom: 16px;
  border: 1px solid var(--vp-c-divider);
}

.ws-procedure :deep(p) {
  padding: 0;
}
</style>