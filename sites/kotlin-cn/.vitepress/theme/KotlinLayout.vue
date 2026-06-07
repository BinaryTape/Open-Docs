<script setup lang="ts">
import { useData } from 'vitepress'
import KotlinHome from './KotlinHome.vue'
import KotlinDocsLayout from './KotlinDocsLayout.vue'

const { frontmatter } = useData()
</script>

<template>
  <KotlinHome v-if="frontmatter.layout === 'kotlin-home'" />
  <KotlinDocsLayout v-else />
</template>

