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
