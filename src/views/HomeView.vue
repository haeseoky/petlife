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
          <svg class="game-hub-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="6"/></svg>
          <div class="game-hub-info">
            <div class="game-hub-title">반려동물 미니게임</div>
            <div class="game-hub-desc">모양 따라그리기, 짝 맞추기, 색깔 맞추기, 반응속도 테스트!</div>
          </div>
          <div class="game-hub-arrow">→</div>
        </a>
      </section>
      <SajuForm v-if="!result && !showHistory" @submit="onSubmit" />

      <!-- 가을철 반려동물 건강관리 팁 카드 -->
      <section v-if="!result && !showHistory" class="seasonal-tip-card">
        <div class="seasonal-header">
          <span class="seasonal-icon">🍂</span>
          <div>
            <h3>가을철 반려동물 건강 관리</h3>
            <p>환절기 건강하게 우리 아이 지키는 필수 수칙!</p>
          </div>
        </div>
        <div class="seasonal-tips-grid">
          <div class="tip-item">
            <span class="tip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z"/></svg></span>
            <span class="tip-text">아침저녁 한낮 10℃ 이상 차이, 산책 시간 신축 조정</span>
          </div>
          <div class="tip-item">
            <span class="tip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="6" width="8" height="14" rx="4"/><path d="M12 6v-3"/><path d="M19 7l-2 2"/><circle cx="5" cy="9" r="2"/><circle cx="7" cy="13" r="2"/></svg></span>
            <span class="tip-text">진드기·벼룩 제어약 1개월마다 정기 투여</span>
          </div>
          <div class="tip-item">
            <span class="tip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.7s6 6.3 6 11.3a6 6 0 0 1-12 0c0-5 6-11.3 6-11.3z"/></svg></span>
            <span class="tip-text">반려묘는 음수량 부족이 신장병 지름길 — 습식 사료·급수기로 수분 섭취 늘리기</span>
          </div>
          <div class="tip-item">
            <span class="tip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span>
            <span class="tip-text">매일 5분 브러싱, 털갈이 돕고 피부 건강 유지</span>
          </div>
          <div class="tip-item">
            <span class="tip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 2v7c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/></svg></span>
            <span class="tip-text">활동량 줄어들면 체중 감시, 사료 양 조절</span>
          </div>
          <div class="tip-item">
            <span class="tip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2v6.5L4.5 19a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 8.5V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg></span>
            <span class="tip-text">물 마시는 양 갑자기 늘거나 줄면 신장질환 의심 — 노령묘는 조기 검진 필수</span>
          </div>
          <div class="tip-item">
            <span class="tip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/><path d="M8 12H4"/><path d="M20 12h-4"/></svg></span>
            <span class="tip-text">노령견은 환절기 관절염 악화 주의 — 미끄럼 매트 깔고 산책 후 온찜질</span>
          </div>
          <div class="tip-item">
            <span class="tip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9 9.5h.01"/><path d="M15 9.5h.01"/><path d="M9 15c1 1 5 1 6 0"/></svg></span>
            <span class="tip-text">고양이는 아픔을 숨기는 생존본능 — 연 1회 정기건강검진 권장</span>
          </div>
          <div class="tip-item emergency-tip">
            <span class="tip-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg></span>
            <span class="tip-text">기침·무기력·식욕감퇴 2일 이상 지속 시 병원 진료</span>
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
  background: var(--primary);
  border-radius: 16px;
  padding: 18px 20px;
  text-decoration: none;
  color: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
}
.game-hub-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(123, 94, 77, 0.35);
  background: #6A4F3F;
}
.game-hub-icon {
  width: 36px;
  height: 36px;
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
  background: var(--primary-light);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 24px 20px;
  position: relative;
}

html.dark .seasonal-tip-card {
  background: #262019;
  border-color: #3A3028;
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
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 2px;
}

html.dark .seasonal-header h3 {
  color: #C9A98F;
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

.tip-icon {
  display: inline-flex;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: var(--primary);
}
.tip-icon svg {
  width: 100%;
  height: 100%;
}
.emergency-tip .tip-icon {
  color: #D32F2F;
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
