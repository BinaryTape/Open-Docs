<script setup lang="ts">
import KotlinHeader from './components/KotlinHeader.vue'
</script>

<template>
  <div class="kt-page kt-home-page">
    <KotlinHeader />
    <main class="kt-home">
      <img class="kt-home-bg" src="/assets/kotlin-hero-bg.webp" alt="" aria-hidden="true" />
      <section class="kt-home-hero">
        <div class="kt-home-copy">
          <h1>Kotlin</h1>
          <p>Concise. Multiplatform. Fun.</p>
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
    </main>
  </div>
</template>

