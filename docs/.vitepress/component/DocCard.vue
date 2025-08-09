<script setup lang="ts">
defineProps<{
    href: string
    docType: string // 卡片类型class，如 "coilCard"
    title: string
    description: string
    tags?: string[]
    aosDelay?: number
    comingSoon?: boolean
}>()
</script>

<template>
    <a :href="href" class="card" :class="docType" data-aos="fade-up" :data-aos-delay="aosDelay || 400">
        <div class="cardContent">
            <div v-if="comingSoon" class="comingSoonBadge">
                {{ $t('homepage.badge.comingSoon') }}
            </div>
            <div>
                <h2 class="cardTitle">{{ title }}</h2>
                <p class="cardDescription">{{ description }}</p>
            </div>
            <div v-if="tags?.length" class="cardMeta">
                <span v-for="(tag, i) in tags" :key="i" class="cardTag">
                    {{ tag }}
                </span>
            </div>
            <div class="cardIcon"></div>
        </div>
    </a>
</template>

<style scoped src="@/styles/doc-cards.css"></style>
<style scoped src="@/styles/doc-cards-types.css"></style>
