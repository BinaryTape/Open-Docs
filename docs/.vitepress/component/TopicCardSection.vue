<script setup lang="ts">
import { useSlots, type VNode } from 'vue'
import Card from "./Card.vue";

const slots = useSlots()

export interface SectionLink {
  summary?: string
  content?: string
  href?: string
}

const links: SectionLink[] = []

let titleContent = ''

slots.default?.()?.forEach((vnode: VNode) => {
  const props = vnode.props as Record<string, any>
  const children = vnode.children

  if (typeof vnode.type === 'string' && vnode.type.toLowerCase() === 'title') {
    titleContent = typeof children === 'string' ? children : ''
  }

  if (typeof vnode.type === 'string' && vnode.type.toLowerCase() === 'a') {
    links.push({
      summary: props?.summary,
      href: props?.href,
      content: typeof children === 'string'
          ? children
          : Array.isArray(children)
              ? children.map(c => typeof c === 'string' ? c : '').join('')
              : ''
    })
  }
})
</script>


<template>
  <div class="ws-section">
    <h2 v-if="titleContent" class="ws-section-title">{{ titleContent }}</h2>
    <div class="ws-row">
      <template v-if="links.length > 0" v-for="(link, index) in links">
        <Card :href="link.href" :summary="link.summary"> {{ link.content }} </Card>
      </template>
      <slot v-else/>
    </div>
  </div>
</template>

<style scoped>
.ws-section {
  margin-top: 16px;
}

.ws-section-title {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 28px;
}

.ws-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: stretch;
  margin-top: 36px;
}

.ws-row > :nth-of-type(2n+1) {
  margin-right: 16px;
}

.ws-row > :nth-of-type(2n) {
  margin-left: 16px;
}

</style>