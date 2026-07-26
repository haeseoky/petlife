<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { t, currentLang } from '../i18n.js'

const props = defineProps({
  result: { type: Object, required: true }
})

const now = ref(new Date())
let timer = null

onMounted(() => {
  timer = setInterval(() => { now.value = new Date() }, 60000)
})
onUnmounted(() => { clearInterval(timer) })

const birthdayInfo = computed(() => {
  const { year, month, day } = props.result
  const today = now.value
  const y = today.getFullYear()
  const m = today.getMonth() + 1
  const d = today.getDate()

  // 오늘 날짜를 자정 기준으로
  const todayMid = new Date(y, m - 1, d)
  let nextBd = new Date(y, month - 1, day)

  if (nextBd < todayMid) {
    nextBd = new Date(y + 1, month - 1, day)
  }

  const diffMs = nextBd - todayMid
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  const isBirthday = diffDays === 0
  const isSoon = !isBirthday && diffDays <= 7

  // 다음 생일 나이
  const nextAge = nextBd.getFullYear() - year

  // 올해 진행률 (생일 기준)
  const prevBd = new Date(y, month - 1, day)
  if (prevBd > todayMid) {
    // 아직 올해 생일 안 지남 → 작년 생일부터
    const lastBd = new Date(y - 1, month - 1, day)
    const total = prevBd - lastBd
    const elapsed = todayMid - lastBd
    var yearProgress = Math.min(100, Math.round((elapsed / total) * 100))
  } else {
    const nextBdNext = new Date(y + 1, month - 1, day)
    const total = nextBdNext - prevBd
    const elapsed = todayMid - prevBd
    var yearProgress = Math.min(100, Math.round((elapsed / total) * 100))
  }

  return { diffDays, isBirthday, isSoon, nextAge, yearProgress, nextBd }
})

// 오행 기반 생일 메시지
const elementMessages = {
  木: { ko: '새싹처럼 성장하는 한 해가 될 거예요! 🌱', en: 'A year of growth like a fresh sprout! 🌱' },
  火: { ko: '열정과 에너지가 넘치는 한 해가 될 거예요! 🔥', en: 'A year full of passion and energy! 🔥' },
  土: { ko: '든든하고 안정적인 한 해가 될 거예요! 🏔️', en: 'A steady and stable year ahead! 🏔️' },
  金: { ko: '반짝이며 빛나는 한 해가 될 거예요! ✨', en: 'A sparkling and shining year ahead! ✨' },
  水: { ko: '지혜롭게 흐르는 한 해가 될 거예요! 🌊', en: 'A year of wisdom flowing like water! 🌊' }
}

const elementMsg = computed(() => {
  const el = props.result.mainElement
  const msgs = elementMessages[el] || elementMessages['土']
  return msgs[currentLang.value] || msgs.ko
})

// Confetti 파티클
const confettiParticles = computed(() => {
  if (!birthdayInfo.value.isBirthday) return []
  const emojis = ['🎂', '🎈', '🎁', '⭐', '💕', '🐾', '🎉', '🦴']
  return Array.from({ length: 12 }, (_, i) => ({
    id: i,
    emoji: emojis[i % emojis.length],
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 2,
    size: 0.8 + Math.random() * 0.8
  }))
})

const progressLabel = computed(() => `${props.result.name} birthday progress`)
</script>

<template>
  <div class="birthday-card" :class="{ 'is-birthday': birthdayInfo.isBirthday, 'is-soon': birthdayInfo.isSoon }">
    <!-- Confetti 효과 (생일 당일만) -->
    <div v-if="birthdayInfo.isBirthday" class="confetti-container">
      <span
        v-for="p in confettiParticles"
        :key="p.id"
        class="confetti"
        :style="{
          left: p.left + '%',
          animationDelay: p.delay + 's',
          animationDuration: p.duration + 's',
          fontSize: p.size + 'rem'
        }"
      >{{ p.emoji }}</span>
    </div>

    <div class="card-header">
      <h3>{{ currentLang === 'ko' ? '🎂 생일 카운트다운' : '🎂 Birthday Countdown' }}</h3>
      <span v-if="birthdayInfo.isBirthday" class="badge birthday-badge">🎂 BIRTHDAY</span>
      <span v-else-if="birthdayInfo.isSoon" class="badge soon-badge">D-{{ birthdayInfo.diffDays }}</span>
    </div>

    <!-- 생일 당일 -->
    <div v-if="birthdayInfo.isBirthday" class="celebration-box">
      <div class="celebration-emoji">🎁🎂🎉</div>
      <p class="main-msg">{{ currentLang === 'ko' ? `${result.name}의 ${birthdayInfo.nextAge}번째 생일이에요!` : `${result.name}'s ${birthdayInfo.nextAge}th birthday!` }}</p>
      <p class="sub-msg">{{ currentLang === 'ko' ? `세상에서 가장 소중한 ${result.name}, 생일 축하해요! 💕` : `Happy Birthday to precious ${result.name}! 💕` }}</p>
      <p class="element-bday-msg">{{ elementMsg }}</p>
    </div>

    <!-- 생일 아닌 날 -->
    <div v-else class="countdown-box">
      <p class="countdown-label">
        {{ currentLang === 'ko'
          ? `${result.name}의 ${birthdayInfo.nextAge}번째 생일까지`
          : `Until ${result.name}'s ${birthdayInfo.nextAge}th birthday` }}
      </p>
      <div class="days-display">
        <span class="days-value">{{ birthdayInfo.diffDays }}</span>
        <span class="days-unit">{{ currentLang === 'ko' ? '일' : 'days' }}</span>
      </div>
      <div class="progress-section">
        <div class="progress-bar-bg" role="progressbar" :aria-valuenow="birthdayInfo.yearProgress" aria-valuemin="0" aria-valuemax="100" :aria-label="progressLabel">
          <div class="progress-bar-fill" :style="{ width: birthdayInfo.yearProgress + '%' }"></div>
        </div>
        <span class="progress-label">{{ birthdayInfo.yearProgress }}%</span>
      </div>
      <p v-if="birthdayInfo.isSoon" class="soon-alert">
        {{ currentLang === 'ko'
          ? `🎁 ${result.name}의 생일이 ${birthdayInfo.diffDays}일 남았어요!`
          : `🎁 ${result.name}'s birthday is in ${birthdayInfo.diffDays} days!` }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.birthday-card {
  background: var(--card-bg);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 28px 24px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.birthday-card.is-birthday {
  border-color: #FFD700;
  box-shadow: 0 4px 24px rgba(255, 215, 0, 0.2);
  background: linear-gradient(135deg, var(--card-bg), var(--missing-bg));
}

.birthday-card.is-soon {
  border-color: var(--compat-text);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
}

/* Confetti */
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.confetti {
  position: absolute;
  top: -10%;
  animation: confetti-fall linear infinite;
  opacity: 0.7;
}

@keyframes confetti-fall {
  0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
  100% { transform: translateY(120%) rotate(720deg); opacity: 0; }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.card-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.birthday-badge {
  background: #FFD700;
  color: #856404;
}

.soon-badge {
  background: var(--compat-text);
  color: white;
}

/* Celebration (생일 당일) */
.celebration-box {
  text-align: center;
  position: relative;
  z-index: 1;
}

.celebration-emoji {
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.main-msg {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
}

.sub-msg {
  font-size: 0.95rem;
  color: var(--text-sub);
  margin-bottom: 12px;
}

.element-bday-msg {
  font-size: 0.9rem;
  color: var(--primary);
  background: var(--primary-light);
  padding: 10px 16px;
  border-radius: 10px;
  display: inline-block;
}

/* Countdown (일반) */
.countdown-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

.countdown-label {
  font-size: 0.9rem;
  color: var(--text-sub);
  margin-bottom: 16px;
}

.days-display {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 16px;
}

.days-value {
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--primary);
  line-height: 1;
}

.days-unit {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-sub);
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 320px;
  margin-bottom: 16px;
}

.progress-bar-bg {
  flex: 1;
  height: 6px;
  background: var(--bar-bg);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), #FFD700);
  border-radius: 3px;
  transition: width 1s ease;
}

.progress-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-sub);
  min-width: 30px;
  text-align: right;
}

.soon-alert {
  margin-top: 4px;
  padding: 12px 16px;
  background: var(--compat-bg);
  color: var(--compat-text);
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  width: 100%;
  text-align: center;
}
</style>
