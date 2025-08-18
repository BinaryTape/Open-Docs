<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  groupKey: {
    type: String,
    required: false,
  },
  id: {
    type: String,
    required: false,
  }
});
</script>

<template>
  <slot></slot>
</template>
