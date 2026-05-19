<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { t, currentLang } from '../i18n.js'

const props = defineProps({
  petType: { type: String, required: true },
  mainElement: { type: String, required: true },
  missing: { type: Array, default: () => [] }
})

const elementKeys = { '木': 'wood', '火': 'fire', '土': 'earth', '金': 'metal', '水': 'water' }
const elementIcons = { '木': '🌳', '火': '🔥', '土': '⛰️', '金': '💎', '水': '💧' }
const allElements = ['木', '火', '土', '金', '水']

const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
const storageKey = `petlife_mission_${today}`

const completed = ref([false, false, false])
const missions = ref([])

// Simple LCG random generator
function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

function generateMissions() {
  const seedBase = today.split('-').join('')
  let seed = parseInt(seedBase)

  const selectedMissions = []
  
  // 1. Main Element Mission
  selectedMissions.push({
    element: props.mainElement,
    key: elementKeys[props.mainElement]
  })

  // 2. Missing Element Mission (or random if none)
  let secondElement
  if (props.missing.length > 0) {
    const idx = Math.floor(seededRandom(seed++) * props.missing.length)
    secondElement = props.missing[idx]
  } else {
    const others = allElements.filter(el => el !== props.mainElement)
    const idx = Math.floor(seededRandom(seed++) * others.length)
    secondElement = others[idx]
  }
  selectedMissions.push({
    element: secondElement,
    key: elementKeys[secondElement]
  })

  // 3. Random Element Mission (avoiding duplicates if possible)
  let thirdElement
  const remaining = allElements.filter(el => !selectedMissions.some(m => m.element === el))
  if (remaining.length > 0) {
    const idx = Math.floor(seededRandom(seed++) * remaining.length)
    thirdElement = remaining[idx]
  } else {
    // If somehow all elements are used (not possible with 3 missions and 5 elements), just pick any
    thirdElement = allElements[Math.floor(seededRandom(seed++) * allElements.length)]
  }
  selectedMissions.push({
    element: thirdElement,
    key: elementKeys[thirdElement]
  })

  missions.value = selectedMissions.map(m => {
    const data = t(`dailyMission.missions.${m.key}.${props.petType}`)
    return {
      ...m,
      icon: elementIcons[m.element],
      title: data.title,
      desc: data.desc,
      time: data.time
    }
  })
}

function loadState() {
  const saved = localStorage.getItem(storageKey)
  if (saved) {
    try {
      completed.value = JSON.parse(saved)
    } catch (e) {
      completed.value = [false, false, false]
    }
  }
}

function toggleComplete(index) {
  completed.value[index] = !completed.value[index]
  localStorage.setItem(storageKey, JSON.stringify(completed.value))
}

const progress = computed(() => {
  const count = completed.value.filter(v => v).length
  return (count / 3) * 100
})

const isAllCompleted = computed(() => completed.value.every(v => v))

onMounted(() => {
  generateMissions()
  loadState()
})

// Re-generate if language changes
watch(currentLang, () => {
  generateMissions()
})
</script>

<template>
  <div class="detail-card daily-mission-card">
    <div class="card-header">
      <div class="header-text">
        <h3>{{ t('dailyMission.title') }}</h3>
        <p class="mission-desc">{{ t('dailyMission.desc') }}</p>
      </div>
      <div v-if="isAllCompleted" class="badge">
        <span class="badge-icon">🏆</span>
        <span class="badge-text">{{ t('dailyMission.badge') }}</span>
      </div>
    </div>

    <div class="progress-section">
      <div class="progress-info">
        <span>{{ t('dailyMission.progress') }}</span>
        <span class="progress-text">{{ completed.filter(v => v).length }}/3</span>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <div class="mission-list">
      <div 
        v-for="(mission, index) in missions" 
        :key="index" 
        class="mission-item"
        :class="{ 'is-completed': completed[index] }"
        @click="toggleComplete(index)"
      >
        <div class="mission-checkbox">
          <div class="checkbox-circle">
            <svg v-if="completed[index]" viewBox="0 0 24 24" class="checkmark">
              <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <div class="mission-content">
          <div class="mission-header">
            <span class="mission-icon">{{ mission.icon }}</span>
            <span class="mission-title">{{ mission.title }}</span>
            <span class="mission-time">{{ mission.time }}</span>
          </div>
          <p class="mission-text">{{ mission.desc }}</p>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="isAllCompleted" class="completion-msg">
        <p class="congrats-text">✨ {{ t('dailyMission.congrats') }} ✨</p>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.daily-mission-card {
  border: 1px solid var(--primary-light);
  overflow: hidden;
  position: relative;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.header-text h3 {
  margin-bottom: 4px !important;
}

.mission-desc {
  font-size: 0.85rem;
  color: var(--text-sub);
}

.badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--primary-light);
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid var(--primary);
  animation: bounce 1s infinite alternate;
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-5px); }
}

.badge-icon {
  font-size: 1.2rem;
  margin-bottom: 2px;
}

.badge-text {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--primary);
}

.progress-section {
  margin-bottom: 24px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-sub);
  margin-bottom: 8px;
}

.progress-text {
  color: var(--primary);
}

.progress-bar-bg {
  height: 10px;
  background: var(--bar-bg);
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 5px;
  transition: width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.mission-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mission-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--bg-main);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mission-item:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.mission-item.is-completed {
  background: var(--primary-light);
  border-color: var(--primary);
  opacity: 0.8;
}

.mission-checkbox {
  display: flex;
  align-items: center;
}

.checkbox-circle {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  background: var(--white);
  color: var(--primary);
}

.is-completed .checkbox-circle {
  border-color: var(--primary);
  background: var(--primary);
  color: var(--white);
}

.checkmark {
  width: 16px;
  height: 16px;
}

.mission-content {
  flex: 1;
}

.mission-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.mission-icon {
  font-size: 1.1rem;
}

.mission-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
}

.mission-time {
  font-size: 0.75rem;
  color: var(--text-sub);
  background: var(--border-light);
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: auto;
}

.mission-text {
  font-size: 0.9rem;
  color: var(--text-sub);
  line-height: 1.4;
  margin: 0 !important;
}

.is-completed .mission-title,
.is-completed .mission-text {
  text-decoration: line-through;
  opacity: 0.6;
}

.completion-msg {
  margin-top: 24px;
  text-align: center;
  padding: 16px;
  background: var(--primary-light);
  border-radius: 12px;
  border: 2px dashed var(--primary);
}

.congrats-text {
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0 !important;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Dark mode support - matching existing patterns */
@media (prefers-color-scheme: dark) {
  .mission-item {
    background: rgba(255, 255, 255, 0.03);
  }
}
</style>
