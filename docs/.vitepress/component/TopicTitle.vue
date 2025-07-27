<script setup lang="ts">
import {computed} from "vue";

const props = defineProps({
  id: {
    type: String,
    required: false
  },
  level: {
    type: Number,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  labelRef: {
    type: String,
    required: true
  }
})

const refMapping = new Map([
  ['server-plugin', 'Server Plugin'],
  ['client-plugin', 'Client Plugin'],
  ['experimental-general', 'Experimental'],
  ['experimental-opt-in', 'Experimental'],
  ['experimental', 'Experimental'],
  ['advanced', 'Advanced'],
  ['beta', 'Beta'],
  ['alpha', 'Alpha'],
  ['eap', "EAP"]
]);

const labelColor = new Map([
    ['server-plugin', '#6b57ff'],
    ['client-plugin', '#ff58a2'],
    ['experimental-general', '#f45c4a'],
    ['experimental-opt-in', '#f45c4a'],
    ['experimental', '#f45c4a'],
    ['advanced', '#6b57ff'],
    ['alpha', '#ff58a2'],
    ['beta', '#fc801d'],
    ['eap', '#f45c4a']
]);

const labelBackground = new Map([
    ['server-plugin', '#6b57ff33'],
    ['client-plugin', '#ff58a233'],
    ['experimental-general', '#f45c4a33'],
    ['experimental-opt-in', '#f45c4a33'],
    ['experimental', '#f45c4a33'],
    ['advanced', '#6b57ff33'],
    ['alpha', '#ff58a233'],
    ['beta', '#fc801d33'],
    ['eap', '#f45c4a33']
])

const label = refMapping.get(props.labelRef)
const bgColor = labelColor.get(props.labelRef)
const labelBackColor = labelBackground.get(props.labelRef)

const levelClass = computed(() => props.level ? `ws-topic-title--h${props.level}` : '')
</script>

<template>
  <div class="ws-topic-title" :class="levelClass">
    <div class="ws-topic-label">
      <div class="ws-topic-label-background" :style="{ '--ws-label-background': labelBackColor }"></div>
      <span class="ws-topic-label-text" :style="{ backgroundColor: bgColor }">{{ label }}</span>
    </div>
    <component
        :is="props.level ? 'h' + props.level : 'h1'"
        :id="props.id"
    >{{ props.title }}</component>
  </div>
</template>

<style scoped>
.ws-topic-title--h2 {
  margin-top: 48px;
}

.ws-topic-title--h3 {
  margin-top: 32px;
}

.ws-topic-title h1, .ws-topic-title h2, .ws-topic-title h3, .ws-topic-title h4, .ws-topic-title h5, .ws-topic-title h6{
  margin: auto;
  border-top: 0;
  padding-top: 0;
}

.ws-topic-label {
  position: relative;
  left: -24px;
  margin-bottom: 16px;
  width: 100%;
}

.ws-topic-label-background {
  --ws-label-background: #6b57ff33;
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 330px;
  border-radius: 4px;
  background-image: linear-gradient(155deg,var(--ws-label-background),transparent 24%);
}

.ws-topic-label-text {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  cursor: default;
  font-size: 14px;
  color: var(--vp-c-bg);
  background-color: #6b57ff;
  font-weight: 400;
}
</style>