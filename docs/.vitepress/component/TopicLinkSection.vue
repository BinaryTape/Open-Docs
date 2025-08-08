<script setup lang="ts">

</script>

<template>
  <div class="ws-section">
    <div class="ws-row">
      <slot/>
    </div>
  </div>
</template>

<style scoped>
.ws-section {
  margin-top: 16px;
}

.ws-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: stretch;
}

.ws-row > * {
  margin-left: 16px;
}

.ws-row > :first-child,
.ws-row > :nth-child(4n) {
  margin-left: 0;
}
</style>
