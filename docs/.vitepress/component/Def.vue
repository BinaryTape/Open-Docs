<script setup lang="ts">
import {inject, Ref} from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

const isExpanded = inject('isExpanded') as Ref<boolean>
</script>

<template>
  <div v-if="isExpanded">
    <details class="details custom-block">
      <summary>{{ props.title }}</summary>
      <div class="ws-def-collapse-content">
        <slot/>
      </div>
    </details>
  </div>

  <div v-if="!isExpanded" class="ws-def">
    <dt class="ws-def-title">{{ props.title }}</dt>
    <dd class="ws-def-content">
      <slot/>
    </dd>
  </div>
</template>


<style scoped>
.ws-def {
  margin-top: 16px;
  padding: 16px;
  border-radius: 8px;
  border-color: var(--vp-custom-block-details-border);
  color: var(--vp-custom-block-details-text);
  background-color: var(--vp-custom-block-details-bg);
}
.ws-def-title {
  float: left;
  width: calc(33.3% -  32px);
  font-weight: 700;
  font-size: 1em;
}

.ws-def-collapse-content {
  padding: 0 16px;
}

.ws-def-content {
  padding-left: 33.3%;
}

.ws-def-content > *:first-child {
  margin: 0;
}

.ws-def-content > *:not(:first-child) {
  margin: 12px 0 0 !important;
}

.ws-def-collapse-content :deep(i) {
  font-style: normal;
  font-weight: bold;
}

</style>