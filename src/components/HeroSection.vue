<template>
  <section class="hero">
    <div class="hero-emoji">🐶</div>
    <h1 class="hero-title">{{ t('heroTitle') }}</h1>
    <p class="hero-desc">{{ t('heroDesc') }}</p>
    <div class="badges">
      <span class="badge" v-for="b in t('badges')" :key="b">{{ b }}</span>
    </div>
  </section>
</template>

<script setup>
import { t } from '../i18n.js'
</script>

<style scoped>
.hero {
  text-align: left;
  padding: 40px 0 48px;
}
.hero-emoji {
  font-size: 1.5rem;
  margin-bottom: 12px;
  opacity: 0.8;
}
.hero-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 16px;
  line-height: 1.3;
}
.hero-desc {
  font-size: 1.05rem;
  color: var(--text-sub);
  margin-bottom: 24px;
  word-break: keep-all;
}
.badges {
  display: flex;
  gap: 12px;
}
.badge {
  background: transparent;
  color: #8E847B;
  padding: 2px 0;
  font-size: 0.85rem;
  font-weight: 500;
}
.badge:not(:last-child)::after {
  content: "·";
  margin-left: 12px;
  color: var(--border-light);
}
</style>
