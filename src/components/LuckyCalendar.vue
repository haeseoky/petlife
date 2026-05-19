<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  result: { type: Object, required: true }
})

const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth()) // 0-indexed

// 오행 상생/상극 매핑
const ELEMENT_CYCLE = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' }
const ELEMENT_OVERCOME = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' }

// 천간 → 오행 매핑
const GAN_ELEMENT = ['木','木','火','火','土','土','金','金','水','水']
const GAN_NAMES = ['갑','을','병','정','무','기','경','신','임','계']

// 기준일: 1900-01-01 = 갑자일 (갑 = index 0)
const BASE_DATE = new Date(1900, 0, 1)

function getGanIndex(date) {
  const diff = Math.floor((date - BASE_DATE) / 86400000)
  return ((diff % 10) + 10) % 10
}

function getDayElement(date) {
  return GAN_ELEMENT[getGanIndex(date)]
}

function getLuckyLevel(dayElement, myElement) {
  if (dayElement === myElement) return 'same' // 비화
  if (ELEMENT_CYCLE[myElement] === dayElement) return 'create' // 내가 생하는 오행 (상생 - 기운이 흘러감)
  if (ELEMENT_CYCLE[dayElement] === myElement) return 'receive' // 나를 생하는 오행 (상생 - 기운을 받음)
  if (ELEMENT_OVERCOME[myElement] === dayElement) return 'overcome' // 내가 극하는 오행
  if (ELEMENT_OVERCOME[dayElement] === myElement) return 'clash' // 나를 극하는 오행 (상극)
  return 'neutral'
}

const myElement = computed(() => props.result.mainElement)

const calendarDays = computed(() => {
  const y = viewYear.value
  const m = viewMonth.value
  const firstDay = new Date(y, m, 1).getDay() // 0=Sun
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(y, m, d)
    const dayEl = getDayElement(date)
    const level = getLuckyLevel(dayEl, myElement.value)
    const ganIdx = getGanIndex(date)
    const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear()
    days.push({ day: d, level, gan: GAN_NAMES[ganIdx], element: dayEl, isToday })
  }
  return days
})

const monthLabel = computed(() => {
  return `${viewYear.value}년 ${viewMonth.value + 1}월`
})

const todayLevel = computed(() => {
  const dayEl = getDayElement(today)
  return getLuckyLevel(dayEl, myElement.value)
})

const todayActivity = computed(() => {
  const level = todayLevel.value
  if (level === 'create' || level === 'receive' || level === 'same') {
    return { text: '오늘은 좋은 날! 산책이나 새로운 놀이를 시도해보세요 🌟', type: 'good' }
  }
  if (level === 'clash') {
    return { text: '오늘은 조심! 편안한 실내에서 휴식하기 좋은 날이에요 💤', type: 'bad' }
  }
  return { text: '무난한 하루! 평소처럼 일상 루틴을 지켜주세요 🐾', type: 'normal' }
})

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value--
  } else {
    viewMonth.value--
  }
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value++
  } else {
    viewMonth.value++
  }
}

const levelColors = {
  create: { bg: '#dcfce7', text: '#16a34a', label: '★★★', labelKo: '최고' },
  receive: { bg: '#dcfce7', text: '#16a34a', label: '★★★', labelKo: '최고' },
  same: { bg: '#d1fae5', text: '#059669', label: '★★', labelKo: '좋음' },
  overcome: { bg: '#f3f4f6', text: '#6b7280', label: '★', labelKo: '보통' },
  neutral: { bg: '#f3f4f6', text: '#9ca3af', label: '—', labelKo: '보통' },
  clash: { bg: '#fee2e2', text: '#dc2626', label: '✕', labelKo: '주의' }
}
</script>

<template>
  <div class="lucky-calendar-card">
    <h3>🗓️ 럭키 데이 캘린더</h3>
    <p class="calendar-sub">{{ result.name }}의 오행({{ myElement }}) 기준 운이 좋은 날</p>

    <div class="calendar-nav">
      <button class="nav-btn" @click="prevMonth">‹</button>
      <span class="month-label">{{ monthLabel }}</span>
      <button class="nav-btn" @click="nextMonth">›</button>
    </div>

    <div class="calendar-grid">
      <div class="weekday" v-for="w in ['일','월','화','수','목','금','토']" :key="w">{{ w }}</div>
      <div
        v-for="(d, i) in calendarDays"
        :key="i"
        :class="['day-cell', { empty: !d, today: d?.isToday, [d?.level]: d }]"
      >
        <template v-if="d">
          <span class="day-num">{{ d.day }}</span>
          <span class="day-level" :style="{ background: levelColors[d.level].bg, color: levelColors[d.level].text }">
            {{ levelColors[d.level].label }}
          </span>
        </template>
      </div>
    </div>

    <div class="legend">
      <span class="legend-item"><span class="legend-dot" style="background:#dcfce7;border-color:#16a34a"></span> 최고 (상생)</span>
      <span class="legend-item"><span class="legend-dot" style="background:#d1fae5;border-color:#059669"></span> 좋음 (비화)</span>
      <span class="legend-item"><span class="legend-dot" style="background:#f3f4f6;border-color:#9ca3af"></span> 보통</span>
      <span class="legend-item"><span class="legend-dot" style="background:#fee2e2;border-color:#dc2626"></span> 주의 (상극)</span>
    </div>

    <div :class="['today-activity', todayActivity.type]">
      {{ todayActivity.text }}
    </div>
  </div>
</template>

<style scoped>
.lucky-calendar-card {
  background: var(--card-bg);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 32px 24px;
  margin-bottom: 24px;
}
.lucky-calendar-card h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--text-main);
}
.calendar-sub {
  font-size: 0.8rem;
  color: var(--text-sub);
  margin-bottom: 20px;
}
.calendar-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}
.nav-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border-light);
  background: var(--primary-light);
  color: var(--primary);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease;
}
.nav-btn:hover {
  transform: scale(1.1);
}
.month-label {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
  min-width: 100px;
  text-align: center;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 16px;
}
.weekday {
  text-align: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-sub);
  padding: 4px 0 8px;
}
.day-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  border-radius: 8px;
  transition: transform 0.15s ease;
  cursor: default;
}
.day-cell:not(.empty):hover {
  transform: scale(1.12);
  z-index: 1;
}
.day-cell.empty {
  min-height: auto;
}
.day-cell.today {
  background: var(--primary-light);
  box-shadow: 0 0 0 2px var(--primary);
}
.day-num {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-main);
  line-height: 1;
}
.day-level {
  font-size: 0.55rem;
  font-weight: 700;
  padding: 1px 4px;
  border-radius: 4px;
  margin-top: 3px;
  line-height: 1.2;
}
.legend {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  color: var(--text-sub);
}
.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  border: 1px solid;
}
.today-activity {
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.6;
}
.today-activity.good {
  background: #dcfce7;
  color: #16a34a;
}
.today-activity.normal {
  background: #f3f4f6;
  color: #6b7280;
}
.today-activity.bad {
  background: #fee2e2;
  color: #dc2626;
}
html.dark .today-activity.good {
  background: #14361e;
  color: #4ade80;
}
html.dark .today-activity.normal {
  background: #2a2a2a;
  color: #9ca3af;
}
html.dark .today-activity.bad {
  background: #3b1111;
  color: #f87171;
}
</style>
