<script setup lang="ts">
const props = defineProps({
  width: {
    type: String,
    required: false
  },
  height: {
    type: String,
    required: false
  },
  src: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: false
  }
})

</script>

<template>
  <div class="youtube-video-container" :style="[`width: ${props.width}px`, `height: ${props.height}px`]">
    <iframe
        width="100%"
        height="100%"
        :src="src"
        :title="title"
        style="border: 0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
    ></iframe>
  </div>
</template>