<script setup>
import { ref } from 'vue'
import HeroSection from './components/HeroSection.vue'
import SajuForm from './components/SajuForm.vue'
import SajuResult from './components/SajuResult.vue'
import { computeSaju } from './saju'

const result = ref(null)

function onSubmit({ name, breed, year, month, day, hour }) {
  result.value = { name, breed, ...computeSaju(year, month, day, hour) }
}

function reset() {
  result.value = null
}
</script>

<template>
  <div class="app">
    <header class="header">
      <span class="logo">🐾 PetLife</span>
    </header>
    <HeroSection v-if="!result" />
    <SajuForm v-if="!result" @submit="onSubmit" />
    <SajuResult v-if="result" :result="result" @reset="reset" />
    <footer class="footer">© 2026 PetLife — 반려동물과 함께하는 행복한 삶 🐶</footer>
  </div>
</template>

<style>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');

:root {
  --primary: #7B5E4D;
  --primary-light: #F8F5F2;
  --text-main: #2C2C2C;
  --text-sub: #666666;
  --border-light: #E5E1DA;
  --bg-main: #FDFCFB;
  --white: #FFFFFF;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--bg-main);
  color: var(--text-main);
  line-height: 1.6;
  letter-spacing: -0.01em;
}

.app {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 32px 0;
}

.logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: -0.02em;
}

.footer {
  text-align: center;
  padding: 60px 0 20px;
  font-size: 0.85rem;
  color: #B0A8A0;
}

button {
  font-family: inherit;
  transition: all 0.2s ease;
}

input, select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>
