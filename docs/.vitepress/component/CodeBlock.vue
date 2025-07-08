<template>
  <div :class="`language-${props.lang} vp-adaptive-theme`">
    <button title="复制代码" class="copy"></button>
    <span class="lang"> {{props.lang}} </span>
    <div v-html="highlightedCode"></div>
  </div>
</template>

<script setup>
import { ref, watchEffect, useSlots } from 'vue';
import { codeToHtml } from 'shiki';
import { useData } from 'vitepress'

const props = defineProps({
  lang: {
    type: String,
    required: true,
  }
});

const slots = useSlots();
const highlightedCode = ref('');

const { isDark } = useData()
const getTheme = () => {
  return isDark.value ? 'github-dark' : 'github-light'
}


const getRawCode = () => {
  if (!slots.default) return '';

  const slotContent = slots.default();
  if (!slotContent || !slotContent[0]) return '';

  const firstSlot = slotContent[0];
  if (typeof firstSlot.children === 'string') {
    return firstSlot.children;
  }

  return '';
};

watchEffect(async () => {
  const rawCode = getRawCode();
  if (!rawCode) return;

  try {
    // 使用 codeToHtml 函数直接处理
    highlightedCode.value = await codeToHtml(rawCode, {
      lang: props.lang,
      theme: getTheme(),
      transformers: [{
        // 自定义 pre 标签属性的转换器
        pre(node) {
          // 添加自定义类名
          node.properties.class += ' shiki-themes vp-code';
          node.properties.style = null;
          return node;
        }
      }]
    });
  } catch (error) {
    console.error('Shiki highlighting failed:', error);
    highlightedCode.value = `<pre class="shiki shiki-themes github-light github-dark vp-code"><code>${rawCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
  }
});
</script>

