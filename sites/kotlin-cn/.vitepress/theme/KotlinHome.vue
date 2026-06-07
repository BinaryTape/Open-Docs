<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import KotlinHeader from './components/KotlinHeader.vue'

const { theme } = useData()
const homeMeta = computed(() => theme.value.homeMeta || {})
</script>

<template>
  <div class="kt-page kt-home-page">
    <KotlinHeader />
    <main class="kt-home">
      <img class="kt-home-bg" src="/assets/kotlin-hero-bg.webp" alt="" aria-hidden="true" />
      <section class="kt-home-hero">
        <div class="kt-home-copy">
          <h1>Kotlin</h1>
          <p>简洁。多平台。有趣。</p>
          <a class="kt-primary-button" href="/docs/language/home">Get started</a>
          <div class="kt-developed">
            <span>Developed by</span>
            <img src="/assets/jetbrains-logo-white.svg" alt="JetBrains" />
          </div>
        </div>
        <div class="kt-home-art">
          <img
            src="/assets/kotlin-hero-cover.png"
            srcset="/assets/kotlin-hero-cover@2x.png 2x"
            width="560"
            height="560"
            alt="Kotlin"
          />
        </div>
      </section>
      <footer class="kt-home-footer" aria-label="站点信息">
        <div class="kt-home-footer-inner">
          <p v-if="homeMeta.updatedAt && homeMeta.nextUpdateAt" class="kt-home-sync">
            <span>
              <strong>同步</strong>
              <b>{{ homeMeta.updatedAt }}</b>
            </span>
            <i aria-hidden="true"></i>
            <span>
              <strong>下次</strong>
              <b>{{ homeMeta.nextUpdateAt }}</b>
            </span>
          </p>
          <p class="kt-home-community">由 Kotlin 中文开发者社区维护</p>
        </div>
      </footer>
    </main>
  </div>
</template>
