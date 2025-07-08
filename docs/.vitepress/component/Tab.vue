<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  groupKey: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <slot></slot>
</template>
