<script setup>
import { ref, onMounted } from 'vue'
import HeroSection from '../components/HeroSection.vue'
import SajuForm from '../components/SajuForm.vue'
import SajuResult from '../components/SajuResult.vue'
import HistoryList from '../components/HistoryList.vue'
import { computeSaju } from '../saju'
import { currentLang, toggleLang, t } from '../i18n.js'
import { useRouter } from 'vue-router'

const router = useRouter()

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

if (typeof localStorage !== 'undefined') loadHistory()

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
    <a href="#main-content" class="skip-link">본문으로 바로가기</a>
    <header class="header" role="banner">
      <span class="logo" @click="reset" style="cursor:pointer" role="button" tabindex="0" @keydown.enter="reset" @keydown.space.prevent="reset" aria-label="PetLife 홈">🐾 PetLife</span>
      <button class="dark-toggle" @click="toggleDark" :title="isDark ? '라이트 모드' : '다크 모드'" :aria-label="isDark ? '라이트 모드로 전환' : '다크 모드로 전환'">{{ isDark ? '☀️' : '🌙' }}</button>
      <button class="lang-toggle" @click="toggleLang" :aria-label="currentLang === 'ko' ? 'Switch to English' : '한국어로 변경'">{{ currentLang === 'ko' ? 'EN' : '한' }}</button>
      <button v-if="history.length && !result" class="history-toggle" @click="showHistory = !showHistory" :aria-expanded="showHistory" aria-controls="history-panel">
        {{ showHistory ? '닫기' : '기록 ' + history.length }}
      </button>
    </header>
    <HistoryList
      v-if="showHistory && !result"
      id="history-panel"
      role="region"
      aria-label="사주 기록 목록"
      :history="history"
      @view="viewHistory"
      @delete="deleteHistory"
    />
    <main id="main-content" role="main">
      <HeroSection v-if="!result && !showHistory" />
      <!-- 게임 섹션 -->
      <section v-if="!result && !showHistory" class="game-section">
        <a href="https://game.nutalk.co.kr" target="_blank" rel="noopener" class="game-hub-card" aria-label="반려동물 미니게임 센터 열기 (새 창)">
          <div class="game-hub-icon">🎮</div>
          <div class="game-hub-info">
            <div class="game-hub-title">반려동물 미니게임</div>
            <div class="game-hub-desc">모양 따라그리기, 짝 맞추기, 색깔 맞추기, 반응속도 테스트!</div>
          </div>
          <div class="game-hub-arrow">→</div>
        </a>
      </section>
      <SajuForm v-if="!result && !showHistory" @submit="onSubmit" />

      <!-- 여름철 반려동물 건강관리 팁 카드 -->
      <section v-if="!result && !showHistory" class="seasonal-tip-card">
        <div class="seasonal-header">
          <span class="seasonal-icon">☀️</span>
          <div>
            <h3>여름철 반려동물 건강 관리</h3>
            <p>폭염 속 우리 아이를 지키는 필수 수칙을 확인하세요!</p>
          </div>
        </div>
        <div class="seasonal-tips-grid">
          <div class="tip-item">
            <span class="tip-emoji">🌡️</span>
            <span class="tip-text">손등 바닥에 5초 대고 뜨겁다면 산책 자제</span>
          </div>
          <div class="tip-item">
            <span class="tip-emoji">💧</span>
            <span class="tip-text">항상 신선한 물 여러 곳에 배치</span>
          </div>
          <div class="tip-item">
            <span class="tip-emoji">🕷️</span>
            <span class="tip-text">진드기 예방약 정기 사용</span>
          </div>
          <div class="tip-item">
            <span class="tip-emoji">🦠</span>
            <span class="tip-text">SFTS 진드기 매개 바이러스 주의</span>
          </div>
          <div class="tip-item">
            <span class="tip-emoji">🍽️</span>
            <span class="tip-text">남은 사료 바로 치우기</span>
          </div>
          <div class="tip-item emergency-tip">
            <span class="tip-emoji">🚨</span>
            <span class="tip-text">헐떡임·구토 시 즉시 병원</span>
          </div>
        </div>
      </section>
      <SajuResult v-if="result" :result="result" @reset="reset" />
    </main>
    <footer class="footer" role="contentinfo">
      <nav class="footer-nav" aria-label="하단 내비게이션">
        <a href="/about.html">서비스 소개</a>
        <a href="/privacy.html">개인정보처리방침</a>
        <a href="/terms.html">이용약관</a>
        <a href="/contact.html">문의하기</a>
      </nav>
      <p class="footer-copy">© 2026 PetLife — 반려동물과 함께하는 행복한 삶 🐶</p>
    </footer>
  </div>
</template>

<style>
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
.footer-nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px 16px;
  margin-bottom: 8px;
}
.footer-nav a {
  color: var(--text-sub);
  text-decoration: none;
  font-size: 0.8rem;
  opacity: 0.7;
}
.footer-nav a:hover {
  opacity: 1;
  text-decoration: underline;
}
.footer-copy {
  margin-top: 4px;
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

/* 스킵 링크 */
.skip-link {
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary);
  color: white;
  padding: 8px 16px;
  z-index: 1000;
  font-size: 0.85rem;
  border-radius: 0 0 8px 8px;
  text-decoration: none;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: top 0.2s ease;
}
.skip-link:focus {
  top: 0;
  outline: 2px solid white;
  outline-offset: 2px;
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
}

/* 게임 섹션 */
.game-section {
  margin: 20px 0;
}
.game-hub-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: linear-gradient(135deg, #1B355A, #4D9BC6);
  border-radius: 16px;
  padding: 18px 20px;
  text-decoration: none;
  color: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
}
.game-hub-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(77, 155, 198, 0.3);
}
.game-hub-icon {
  font-size: 36px;
  flex-shrink: 0;
}
.game-hub-info { flex: 1; }
.game-hub-title {
  font-size: 1rem;
  font-weight: 700;
}
.game-hub-desc {
  font-size: 0.75rem;
  opacity: 0.8;
  margin-top: 2px;
}
.game-hub-arrow {
  font-size: 1.2rem;
  opacity: 0.7;
}

/* 여름철 건강관리 팁 카드 */
.seasonal-tip-card {
  margin: 20px 0;
  background: linear-gradient(135deg, #FFF8E6, #FFF0E6);
  border: 1px solid #FFB347;
  border-radius: 16px;
  padding: 24px 20px;
  position: relative;
  overflow: hidden;
}

html.dark .seasonal-tip-card {
  background: linear-gradient(135deg, #2A2214, #2A1A18);
  border-color: #3A2A18;
}

.seasonal-tip-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #FF6B35, #FFB347, #FF8C42);
}

.emergency-tip {
  background: rgba(255, 59, 48, 0.1);
  border-color: rgba(255, 59, 48, 0.3);
}

html.dark .emergency-tip {
  background: rgba(255, 59, 48, 0.15);
  border-color: rgba(255, 59, 48, 0.4);
}

.seasonal-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 18px;
}

.seasonal-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.seasonal-header h3 {
  font-size: 1.05rem;
  font-weight: 800;
  color: #E65100;
  margin-bottom: 2px;
}

html.dark .seasonal-header h3 {
  color: #FFB74D;
}

.seasonal-header p {
  font-size: 0.82rem;
  color: var(--text-sub);
}

.seasonal-tips-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--card-bg);
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid var(--border-light);
  font-size: 0.8rem;
  color: var(--text-main);
  line-height: 1.4;
}

.tip-emoji {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.tip-text {
  flex: 1;
}

@media (max-width: 400px) {
  .seasonal-tips-grid {
    grid-template-columns: 1fr;
  }
}
</style>
