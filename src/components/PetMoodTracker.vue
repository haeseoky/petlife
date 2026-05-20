<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { t, currentLang } from '../i18n.js'

const props = defineProps({
  name: { type: String, required: true }
})

const moods = [
  { id: 'happy', emoji: '😊', color: '#FFB344', label: 'moodHappy' },
  { id: 'sleepy', emoji: '😴', color: '#9B8EC7', label: 'moodSleepy' },
  { id: 'playful', emoji: '🎮', color: '#4ECDC4', label: 'moodPlayful' },
  { id: 'hungry', emoji: '🍖', color: '#FF6B6B', label: 'moodHungry' },
  { id: 'anxious', emoji: '😰', color: '#A8A8A8', label: 'moodAnxious' }
]

const storageKey = computed(() => `petlife_mood_${props.name}`)
const history = ref([])

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const todayStr = formatDate(new Date())

function loadHistory() {
  const saved = localStorage.getItem(storageKey.value)
  if (saved) {
    try {
      history.value = JSON.parse(saved)
    } catch (e) {
      history.value = []
    }
  } else {
    history.value = []
  }
}

function saveMood(moodId) {
  const existingIndex = history.value.findIndex(item => item.date === todayStr)
  if (existingIndex !== -1) {
    history.value[existingIndex].mood = moodId
  } else {
    history.value.push({ date: todayStr, mood: moodId })
  }
  // Keep only last 30 days
  if (history.value.length > 30) {
    history.value.sort((a, b) => a.date.localeCompare(b.date))
    history.value = history.value.slice(-30)
  }
  localStorage.setItem(storageKey.value, JSON.stringify(history.value))
}

const currentMood = computed(() => {
  const item = history.value.find(item => item.date === todayStr)
  return item ? item.mood : null
})

const last7Days = computed(() => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = formatDate(d)
    const dayName = d.toLocaleDateString(currentLang.value === 'ko' ? 'ko-KR' : 'en-US', { weekday: 'short' })
    const entry = history.value.find(item => item.date === dateStr)
    days.push({
      date: dateStr,
      dayName,
      mood: entry ? moods.find(m => m.id === entry.mood) : null,
      isToday: dateStr === todayStr
    })
  }
  return days
})

const streak = computed(() => {
  if (history.value.length === 0) return 0
  
  const sortedHistory = [...history.value].sort((a, b) => b.date.localeCompare(a.date))
  let count = 0
  let checkDate = new Date()
  
  // If today is not logged, check starting from yesterday
  const todayEntry = sortedHistory.find(item => item.date === todayStr)
  if (!todayEntry) {
    checkDate.setDate(checkDate.getDate() - 1)
  }

  while (true) {
    const checkStr = formatDate(checkDate)
    const found = sortedHistory.find(item => item.date === checkStr)
    if (found) {
      count++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }
  return count
})

onMounted(() => {
  loadHistory()
})

watch(() => props.name, () => {
  loadHistory()
})
</script>

<template>
  <div class="detail-card pet-mood-tracker reveal">
    <div class="card-header">
      <div class="header-text">
        <h3>{{ t('moodTrackerTitle') }}</h3>
        <p class="section-desc">{{ t('moodTrackerDesc') }}</p>
      </div>
      <div v-if="streak > 0" class="streak-badge">
        <span class="streak-icon">🔥</span>
        <span class="streak-text">{{ t('moodStreak').replace('{n}', streak) }}</span>
      </div>
    </div>

    <div class="mood-selector">
      <button 
        v-for="mood in moods" 
        :key="mood.id"
        class="mood-btn"
        :class="{ 'active': currentMood === mood.id }"
        @click="saveMood(mood.id)"
        :style="{ '--mood-color': mood.color }"
      >
        <div class="emoji-circle">
          <span class="mood-emoji">{{ mood.emoji }}</span>
        </div>
        <span class="mood-label">{{ t(mood.label) }}</span>
      </button>
    </div>

    <div class="history-chart">
      <div v-for="day in last7Days" :key="day.date" class="chart-column" :class="{ 'is-today': day.isToday }">
        <div class="chart-bar-container">
          <div 
            class="chart-bar" 
            :style="{ 
              backgroundColor: day.mood ? day.mood.color : 'var(--border-light)',
              height: day.mood ? '60px' : '10px'
            }"
          >
            <span v-if="day.mood" class="bar-emoji">{{ day.mood.emoji }}</span>
          </div>
        </div>
        <span class="day-label">{{ day.dayName }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pet-mood-tracker {
  padding: 24px;
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-text h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: var(--text-main);
}

.section-desc {
  font-size: 0.85rem;
  color: var(--text-sub);
  margin: 0;
}

.streak-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--primary-light);
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid var(--primary);
}

.streak-icon {
  font-size: 1rem;
}

.streak-text {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--primary);
}

.mood-selector {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 32px;
}

.mood-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 4px;
  border: 2px solid transparent;
  background: var(--bg-main);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.mood-btn:hover {
  transform: translateY(-4px);
  background: var(--white);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.mood-btn.active {
  background: var(--white);
  border-color: var(--mood-color);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.mood-emoji {
  font-size: 1.8rem;
  transition: transform 0.2s;
}

.mood-btn.active .mood-emoji {
  transform: scale(1.2);
}

.emoji-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--bg-main);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border: 1px solid var(--border-light);
}

.mood-btn.active .emoji-circle {
  background: var(--white);
  border-color: var(--mood-color);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.mood-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-sub);
}

.mood-btn.active .mood-label {
  color: var(--text-main);
}

.history-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 120px;
  padding: 0 8px;
  background: var(--bg-main);
  border-radius: 12px;
  border: 1px solid var(--border-light);
}

.chart-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-bottom: 12px;
}

.chart-bar-container {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 70px;
}

.chart-bar {
  width: 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}

.bar-emoji {
  font-size: 0.9rem;
  position: absolute;
  top: -24px;
}

.day-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-sub);
}

.is-today .day-label {
  color: var(--primary);
  font-weight: 800;
}

.is-today {
  position: relative;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .mood-btn, .history-chart {
    background: rgba(255, 255, 255, 0.03);
  }
  .mood-btn.active {
    background: rgba(255, 255, 255, 0.08);
  }
}
</style>
