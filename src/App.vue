<script setup>
import { ref, onMounted } from 'vue'
import HeroSection from './components/HeroSection.vue'
import SajuForm from './components/SajuForm.vue'
import SajuResult from './components/SajuResult.vue'
import HistoryList from './components/HistoryList.vue'
import { computeSaju } from './saju'
import { currentLang, toggleLang, t } from './i18n.js'

const STORAGE_KEY = 'petlife_history'
const DARK_KEY = 'petlife_dark'
const result = ref(null)
const showHistory = ref(false)
const history = ref([])
const isDark = ref(false)

function initDarkMode() {
  const saved = localStorage.getItem(DARK_KEY)
  if (saved !== null) {
    isDark.value = saved === 'true'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyDark()
}

function applyDark() {
  document.documentElement.classList.toggle('dark', isDark.value)
}

function toggleDark() {
  isDark.value = !isDark.value
  localStorage.setItem(DARK_KEY, String(isDark.value))
  applyDark()
}

onMounted(initDarkMode)

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    history.value = raw ? JSON.parse(raw) : []
  } catch { history.value = [] }
}

function saveHistory(item) {
  loadHistory()
  const entry = { ...item, id: Date.now(), savedAt: new Date().toISOString() }
  history.value.unshift(entry)
  if (history.value.length > 20) history.value = history.value.slice(0, 20)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
}

function deleteHistory(id) {
  history.value = history.value.filter(h => h.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
}

loadHistory()

function onSubmit({ petType, name, breed, year, month, day, hour }) {
  const data = { petType, name, breed, year, month, day, hour, ...computeSaju(year, month, day, hour, petType) }
  result.value = data
  showHistory.value = false
  saveHistory(data)
}

function viewHistory(item) {
  result.value = item
  showHistory.value = false
}

function reset() {
  result.value = null
  showHistory.value = false
}
</script>

<template>
  <div class="app">
    <header class="header">
      <span class="logo" @click="reset" style="cursor:pointer">🐾 PetLife</span>
      <button class="dark-toggle" @click="toggleDark" :title="isDark ? '라이트 모드' : '다크 모드'">{{ isDark ? '☀️' : '🌙' }}</button>
      <button class="lang-toggle" @click="toggleLang">{{ currentLang === 'ko' ? 'EN' : '한' }}</button>
      <button v-if="history.length && !result" class="history-toggle" @click="showHistory = !showHistory">
        {{ showHistory ? '닫기' : '기록 ' + history.length }}
      </button>
    </header>
    <HistoryList
      v-if="showHistory && !result"
      :history="history"
      @view="viewHistory"
      @delete="deleteHistory"
    />
    <HeroSection v-if="!result && !showHistory" />
    <SajuForm v-if="!result && !showHistory" @submit="onSubmit" />
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
  --card-bg: #FFFFFF;
  --bar-bg: #F0EDE9;
  --missing-bg: #FFF9F0;
  --missing-text: #A37B45;
  --compat-bg: #F0F7FF;
  --compat-text: #3B82F6;
  --tip-border: #F8F7F5;
  --toast-bg: #2C2C2C;
  --placeholder: #CCC6C0;
}

html.dark {
  --primary: #C4A882;
  --primary-light: #2A2420;
  --text-main: #E8E2DC;
  --text-sub: #A89E96;
  --border-light: #3A3430;
  --bg-main: #1A1714;
  --white: #242018;
  --card-bg: #242018;
  --bar-bg: #3A3430;
  --missing-bg: #2E2518;
  --missing-text: #C4A882;
  --compat-bg: #1E2A3A;
  --compat-text: #6BA3F7;
  --tip-border: #3A3430;
  --toast-bg: #E8E2DC;
  --placeholder: #5A524A;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--bg-main);
  color: var(--text-main);
  line-height: 1.6;
  letter-spacing: -0.01em;
  transition: background-color 0.3s ease, color 0.3s ease;
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

.dark-toggle {
  margin-left: auto;
  background: var(--primary-light);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}
.dark-toggle:hover {
  transform: scale(1.1);
}

.logo {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: -0.02em;
}

.lang-toggle {
  margin-left: 6px;
  background: var(--primary-light);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  color: var(--primary);
}
.lang-toggle:hover {
  transform: scale(1.1);
}

.history-toggle {
  margin-left: 8px;
  background: var(--primary-light);
  color: var(--primary);
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.footer {
  text-align: center;
  padding: 60px 0 20px;
  font-size: 0.85rem;
  color: var(--text-sub);
  opacity: 0.5;
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

/* 인쇄 스타일 */
@media print {
  body {
    background: white !important;
    color: #2C2C2C !important;
  }
  .header, .footer, .btn-group, .share-toast, .dark-toggle, .history-toggle {
    display: none !important;
  }
  .app {
    max-width: 100% !important;
    padding: 0 !important;
  }
  .pillar-card, .personality-card, .element-card, .detail-card, .luck-card, .tips-card {
    break-inside: avoid;
    border-color: #ddd !important;
    background: white !important;
  }
  .result-title {
    font-size: 1.5rem !important;
  }
  .personality-title {
    color: #7B5E4D !important;
  }
  .pillar-value {
    color: #7B5E4D !important;
  }
  .trait-tag {
    background: #f5f0eb !important;
    color: #7B5E4D !important;
  }
  .compat-tag {
    background: #f0f5ff !important;
    color: #3B82F6 !important;
  }
  .bar-fill {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}</style>
