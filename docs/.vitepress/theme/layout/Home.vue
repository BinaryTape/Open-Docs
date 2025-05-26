<script setup lang="ts">
import { useData } from 'vitepress';
const { site } = useData();
</script>

<template>
    <main class="mainContainer">
        <div class="heroSection">
            <h1 class="heroTitle">{{ site.title }}</h1>
            <p class="heroSubtitle">
                {{ $t('homepage.hero.subtitle') }}
            </p>
        </div>

        <div class="cardsContainer">
            <a href="koin/setup/koin" :class="['card', 'koinCard']" data-aos="fade-up" data-aos-delay="100">
                <div class="cardContent">
                    <div>
                        <h2 class="cardTitle">Koin</h2>
                        <p class="cardDescription">
                            {{ $t('homepage.card.koin.description') }}
                        </p>
                    </div>
                    <div class="cardMeta">
                        <span class="cardTag">DI</span>
                        <span class="cardTag">Kotlin</span>
                    </div>
                    <div class="cardIcon"></div>
                </div>
            </a>

            <a href="kotlin/getting-started" :class="['card', 'kotlinCard']" data-aos="fade-up" data-aos-delay="200">
                <div class="cardContent">
                    <div>
                        <h2 class="cardTitle">Kotlin</h2>
                        <p class="cardDescription">
                            {{ $t('homepage.card.kotlin.description') }}
                        </p>
                    </div>
                    <div class="cardMeta">
                        <span class="cardTag"> {{ $t('homepage.card.kotlin.tag.language') }}
                        </span>
                        <span class="cardTag"> {{ $t('homepage.card.kotlin.tag.crossplatform') }}
                        </span>
                    </div>
                    <div class="cardIcon"></div>
                </div>
            </a>

            <a href="" :class="['card', 'ktorCard']" data-aos="fade-up" data-aos-delay="300">
                <div class="cardContent">
                    <div class="comingSoonBadge">
                        {{ $t('homepage.badge.comingSoon') }}
                    </div>
                    <div>
                        <h2 class="cardTitle">Ktor</h2>
                        <p class="cardDescription">
                            {{ $t('homepage.card.ktor.description') }}
                        </p>
                    </div>
                    <div class="cardMeta">
                        <span class="cardTag"> {{ $t('homepage.card.ktor.tag.web') }}
                        </span>
                        <span class="cardTag"> {{ $t('homepage.card.ktor.tag.async') }}
                        </span>
                    </div>
                    <div class="cardIcon"></div>
                </div>
            </a>

            <a href="" :class="['card', 'sqldelightCard']" data-aos="fade-up" data-aos-delay="400">
                <div class="cardContent">
                    <div class="comingSoonBadge">
                        {{ $t('homepage.badge.comingSoon') }}
                    </div>
                    <div>
                        <h2 class="cardTitle">SQLDelight</h2>
                        <p class="cardDescription">
                            {{ $t('homepage.card.sqldelight.description') }}
                        </p>
                    </div>
                    <div class="cardMeta">
                        <span class="cardTag">{{ $t('homepage.card.sqldelight.tag.sql') }}</span>
                        <span class="cardTag">{{ $t('homepage.card.sqldelight.tag.database') }}</span>
                    </div>
                    <div class="cardIcon"></div>
                </div>
            </a>
        </div>

        <div class="footerBanner">
            <div class="bannerContent">
                <h2 class="bannerTitle">
                    {{ $t('homepage.banner.title') }}
                </h2>
                <p class="bannerDescription">
                    {{ $t('homepage.banner.description') }}
                </p>
            </div>
        </div>

        <div class="adBanner">
            <div class="adContentVertical">
                <img src="https://2bab-images.lastmayday.com/binarytape-logo.webp?imageslim" alt="BinaryTape Logo"
                    class="adLogo" />
                <div class="adInfo">
                    <h3 class="adTitle">
                        <a href="https://binarytape.com" target="_blank">BinaryTape</a>
                    </h3>
                    <p class="adDescription">
                        <a href="https://binarytape.com" target="_blank">BinaryTape</a>
                        {{ $t('homepage.ad.description') }}
                    </p>
                    <p class="adContact">
                        {{ $t('homepage.ad.contact') }}
                    </p>
                    <p class="adSponsor">
                        {{ $t('homepage.ad.sponsor') }}
                    </p>
                </div>
            </div>
        </div>
    </main>
</template>