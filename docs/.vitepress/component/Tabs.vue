<script setup>
import { useSlots, ref, computed } from 'vue';

const slots = useSlots();

const tabs = computed(() => {
  return slots.default ? slots.default().filter(child => child.type && child.props) : [];
});

const activeIndex = ref(0);

const groupName = `group-${Math.random().toString(36).substring(2, 9)}`;

const isTab = tabs.props?.id;

</script>

<template>
  <div :class="isTab ? 'vp-code-group' : 'ws-tabs-container'">
    <div :class="isTab ? 'tabs' : 'ws-tablist'">
      <template v-for="(tab, index) in tabs" :key="index">
        <input
            type="radio"
            :name="groupName"
            :id="`${groupName}-${index}`"
            :checked="index === activeIndex"
            @change="activeIndex = index"
        >
        <label
            :class="isTab ? '' : 'ws-tab'"
            :data-title="tab.props?.title"
            :for="`${groupName}-${index}`"
            @click="activeIndex = index"
        >
          {{ tab.props?.title }}
        </label>
      </template>
    </div>

    <div :class="isTab ? 'blocks' : 'ws-tabcontents'">
      <template v-for="(tab, index) in tabs" :key="index">
        <div v-if="!isTab" class="ws-tabcontent" :class="[{ active: index === activeIndex }]">
          <component :is="tab"/>
        </div>
        <component v-if="isTab" :is="tab" :class="[{ active: index === activeIndex }]"/>
      </template>
    </div>
  </div>
</template>

<style scoped>

.ws-tabs-container .ws-tablist input {
  position: fixed;
  opacity: 0;
  pointer-events: none;
}

.ws-tabs-container input:checked + label::after {
  background-color: var(--vp-code-tab-active-bar-color);
}

.ws-tabs-container .ws-tablist label::after {
  position: absolute;
  right: 8px;
  bottom: -1px;
  left: 8px;
  z-index: 1;
  height: 2px;
  border-radius: 2px;
  content: "";
  background-color: #BABABA;
  transition: background-color 0.25s;
}

.ws-tabs-container .ws-tablist label:hover {
  color: var(--vp-code-tab-hover-text-color);
}

.ws-tabs-container input:checked + label {
  color: var(--vp-code-tab-active-text-color);
}

.ws-tab {
  cursor: pointer;
  position: relative;
  display: inline-block;
  border-bottom: 1px solid transparent;
  padding: 0 12px;
  line-height: 48px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-code-tab-text-color);
  white-space: nowrap;
  transition: color 0.25s;
}

.ws-tabs-container .ws-tabcontents .ws-tabcontent {
  display: none;
  margin-top: 0 !important;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
}

.ws-tabs-container .ws-tabcontents .ws-tabcontent.active {
  display: block;
}

.ws-tabcontents {
  padding: 0 12px;
}

</style>