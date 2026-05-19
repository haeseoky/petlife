<script setup>
import { ref, watchEffect } from 'vue'
import HeroSection from './components/HeroSection.vue'
import SajuForm from './components/SajuForm.vue'
import SajuResult from './components/SajuResult.vue'
import HistoryList from './components/HistoryList.vue'
import { computeSaju } from './saju'

const STORAGE_KEY = 'petlife_history'
const result = ref(null)
const showHistory = ref(false)
const history = ref([])

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

.history-toggle {
  margin-left: auto;
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
