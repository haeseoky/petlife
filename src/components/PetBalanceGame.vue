<script setup>
import { ref, computed, onMounted } from 'vue'
import { t } from '../i18n.js'

const props = defineProps({
  mainElement: { type: String, required: true },
  petType: { type: String, required: true }
})

const gameState = ref('intro') // intro, playing, result
const currentIndex = ref(0)
const selections = ref([])
const questions = ref([])

const ALL_QUESTIONS = [
  { id: 1, a: 'balanceQ1A', b: 'balanceQ1B', weights: { a: 'Wood', b: 'Earth' } },
  { id: 2, a: 'balanceQ2A', b: 'balanceQ2B', weights: { a: 'Fire', b: 'Earth' } },
  { id: 3, a: 'balanceQ3A', b: 'balanceQ3B', weights: { a: 'Fire', b: 'Water' } },
  { id: 4, a: 'balanceQ4A', b: 'balanceQ4B', weights: { a: 'Fire', b: 'Earth' } },
  { id: 5, a: 'balanceQ5A', b: 'balanceQ5B', weights: { a: 'Wood', b: 'Metal' } },
  { id: 6, a: 'balanceQ6A', b: 'balanceQ6B', weights: { a: 'Fire', b: 'Earth' } },
  { id: 7, a: 'balanceQ7A', b: 'balanceQ7B', weights: { a: 'Water', b: 'Metal' } },
  { id: 8, a: 'balanceQ8A', b: 'balanceQ8B', weights: { a: 'Fire', b: 'Earth' } },
  { id: 9, a: 'balanceQ9A', b: 'balanceQ9B', weights: { a: 'Earth', b: 'Metal' } },
  { id: 10, a: 'balanceQ10A', b: 'balanceQ10B', weights: { a: 'Earth', b: 'Metal' } },
  { id: 11, a: 'balanceQ11A', b: 'balanceQ11B', weights: { a: 'Wood', b: 'Earth' } },
  { id: 12, a: 'balanceQ12A', b: 'balanceQ12B', weights: { a: 'Fire', b: 'Water' } },
  { id: 13, a: 'balanceQ13A', b: 'balanceQ13B', weights: { a: 'Metal', b: 'Water' } },
  { id: 14, a: 'balanceQ14A', b: 'balanceQ14B', weights: { a: 'Wood', b: 'Water' } },
  { id: 15, a: 'balanceQ15A', b: 'balanceQ15B', weights: { a: 'Water', b: 'Earth' } },
  { id: 16, a: 'balanceQ16A', b: 'balanceQ16B', weights: { a: 'Wood', b: 'Water' } },
  { id: 17, a: 'balanceQ17A', b: 'balanceQ17B', weights: { a: 'Wood', b: 'Earth' } },
  { id: 18, a: 'balanceQ18A', b: 'balanceQ18B', weights: { a: 'Fire', b: 'Earth' } },
  { id: 19, a: 'balanceQ19A', b: 'balanceQ19B', weights: { a: 'Fire', b: 'Metal' } },
  { id: 20, a: 'balanceQ20A', b: 'balanceQ20B', weights: { a: 'Fire', b: 'Water' } }
]

const elementMap = {
  'Wood': '木', 'Fire': '火', 'Earth': '土', 'Metal': '金', 'Water': '水'
}

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function shuffleQuestions() {
  const today = new Date().toISOString().slice(0, 10)
  let seed = parseInt(today.replace(/-/g, ''))
  const shuffled = [...ALL_QUESTIONS]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed) * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    seed++
  }
  questions.value = shuffled.slice(0, 5)
}

function startGame() {
  shuffleQuestions()
  gameState.value = 'playing'
  currentIndex.value = 0
  selections.value = []
}

function selectOption(option) {
  selections.value.push(option)
  if (currentIndex.value < 4) {
    currentIndex.value++
  } else {
    gameState.value = 'result'
  }
}

const finalTrait = computed(() => {
  const counts = { traitActive: 0, traitRelaxed: 0, traitSocial: 0, traitIndependent: 0, traitSensitive: 0 }
  
  selections.value.forEach((sel, idx) => {
    const q = questions.value[idx]
    const el = elementMap[q.weights[sel]]
    
    // Each element contributes to primary + secondary traits
    if (el === '木') { counts.traitActive += 1.2; counts.traitIndependent += 0.8 }
    if (el === '火') { counts.traitActive += 1.2; counts.traitSocial += 0.8 }
    if (el === '土') { counts.traitRelaxed += 1.0; counts.traitSocial += 0.5; counts.traitSensitive += 0.5 }
    if (el === '金') { counts.traitIndependent += 1.2; counts.traitSensitive += 0.8 }
    if (el === '水') { counts.traitRelaxed += 1.0; counts.traitSensitive += 0.5; counts.traitIndependent += 0.5 }
  })

  // Add weight from mainElement
  if (props.mainElement === '木') { counts.traitActive += 1; counts.traitIndependent += 0.5 }
  if (props.mainElement === '火') { counts.traitActive += 1; counts.traitSocial += 0.5 }
  if (props.mainElement === '土') { counts.traitRelaxed += 0.8; counts.traitSensitive += 0.3 }
  if (props.mainElement === '金') { counts.traitIndependent += 1; counts.traitSensitive += 0.5 }
  if (props.mainElement === '水') { counts.traitRelaxed += 0.8; counts.traitSensitive += 0.3 }

  // Deterministic tie-breaking: defined priority order
  const tieOrder = ['traitActive', 'traitRelaxed', 'traitSocial', 'traitIndependent', 'traitSensitive']
  let maxKey = tieOrder[0]
  let maxVal = counts[tieOrder[0]]
  for (let i = 1; i < tieOrder.length; i++) {
    if (counts[tieOrder[i]] > maxVal) {
      maxVal = counts[tieOrder[i]]
      maxKey = tieOrder[i]
    }
  }
  return maxKey
})

const stats = computed(() => {
  const aCount = selections.value.filter(s => s === 'a').length
  const bCount = 5 - aCount
  return { a: Math.round(aCount/5*100), b: Math.round(bCount/5*100) }
})

function shareGame() {
  const text = `🐾 ${t('balanceTitle')}\n${t('balanceTraitPrefix')}${t(finalTrait.value)}${t('balanceTraitSuffix')}\n\n결과 보기: https://petlife-pe7.pages.dev`
  if (navigator.share) {
    navigator.share({ title: t('balanceTitle'), text }).catch(() => {})
  } else {
    navigator.clipboard.writeText(text)
    alert(t('copied'))
  }
}

onMounted(() => {
  shuffleQuestions()
})
</script>

<template>
  <div class="balance-game-card">
    <div class="game-header">
      <h3>{{ t('balanceTitle') }}</h3>
      <p v-if="gameState !== 'playing'" class="game-desc">{{ t('balanceDesc') }}</p>
    </div>

    <!-- Intro -->
    <div v-if="gameState === 'intro'" class="intro-view">
      <div class="intro-icon">🎮</div>
      <button class="start-btn" @click="startGame">{{ t('balanceStart') }}</button>
    </div>

    <!-- Playing -->
    <div v-if="gameState === 'playing'" class="playing-view">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: ((currentIndex + 1) / 5) * 100 + '%' }"></div>
      </div>
      <div class="question-counter">{{ currentIndex + 1 }} / 5</div>
      
      <transition name="slide-fade" mode="out-in">
        <div :key="currentIndex" class="question-container">
          <button class="option-btn option-a" @click="selectOption('a')">
            <span class="option-label">A</span>
            <span class="option-text">{{ t(questions[currentIndex].a) }}</span>
          </button>
          <div class="vs">VS</div>
          <button class="option-btn option-b" @click="selectOption('b')">
            <span class="option-label">B</span>
            <span class="option-text">{{ t(questions[currentIndex].b) }}</span>
          </button>
        </div>
      </transition>
    </div>

    <!-- Result -->
    <div v-if="gameState === 'result'" class="result-view">
      <div class="result-highlight">
        <p class="trait-line">{{ t('balanceTraitPrefix') }}<strong>{{ t(finalTrait) }}</strong>{{ t('balanceTraitSuffix') }}</p>
      </div>

      <div class="stats-container">
        <div class="stat-header">{{ t('balanceStat') }}</div>
        <div class="stat-bars">
          <div class="stat-row">
            <span class="stat-label">A</span>
            <div class="stat-bar-bg">
              <div class="stat-bar-fill a" :style="{ width: stats.a + '%' }"></div>
            </div>
            <span class="stat-pct">{{ stats.a }}%</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">B</span>
            <div class="stat-bar-bg">
              <div class="stat-bar-fill b" :style="{ width: stats.b + '%' }"></div>
            </div>
            <span class="stat-pct">{{ stats.b }}%</span>
          </div>
        </div>
      </div>

      <div class="result-btns">
        <button class="retry-btn" @click="startGame">{{ t('balanceRetry') }}</button>
        <button class="share-btn-game" @click="shareGame">{{ t('balanceShare') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.balance-game-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 32px 24px;
  margin-bottom: 24px;
  text-align: center;
}
.game-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-main);
}
.game-desc {
  font-size: 0.9rem;
  color: var(--text-sub);
  margin-bottom: 24px;
}
.intro-icon {
  font-size: 3rem;
  margin-bottom: 24px;
}
.start-btn {
  width: 100%;
  padding: 16px;
  background: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}
.playing-view {
  margin-top: 10px;
}
.progress-bar {
  height: 6px;
  background: var(--bar-bg);
  border-radius: 3px;
  margin-bottom: 12px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--primary);
  transition: width 0.3s ease;
}
.question-counter {
  font-size: 0.8rem;
  color: var(--text-sub);
  margin-bottom: 24px;
}
.question-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}
.option-btn {
  width: 100%;
  padding: 24px 20px;
  border: 2px solid var(--border-light);
  border-radius: 12px;
  background: var(--bg-main);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}
.option-btn:hover {
  border-color: var(--primary);
  background: var(--primary-light);
}
.option-label {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--primary);
  opacity: 0.6;
}
.option-text {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--text-main);
}
.vs {
  font-size: 0.9rem;
  font-weight: 900;
  color: var(--placeholder);
  font-style: italic;
}
.result-highlight {
  background: var(--primary-light);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
}
.trait-line {
  font-size: 1.1rem;
  color: var(--text-main);
}
.trait-line strong {
  color: var(--primary);
  font-size: 1.25rem;
  display: block;
  margin: 4px 0;
}
.stats-container {
  margin-bottom: 24px;
  text-align: left;
}
.stat-header {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-sub);
  margin-bottom: 12px;
}
.stat-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.stat-label {
  width: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-sub);
}
.stat-bar-bg {
  flex: 1;
  height: 10px;
  background: var(--bar-bg);
  border-radius: 5px;
  overflow: hidden;
}
.stat-bar-fill {
  height: 100%;
}
.stat-bar-fill.a { background: var(--primary); }
.stat-bar-fill.b { background: var(--compat-text); }
.stat-pct {
  width: 40px;
  font-size: 0.85rem;
  text-align: right;
  color: var(--text-sub);
}
.result-btns {
  display: flex;
  gap: 12px;
}
.retry-btn, .share-btn-game {
  flex: 1;
  padding: 14px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}
.retry-btn {
  background: transparent;
  border: 1px solid var(--border-light);
  color: var(--text-sub);
}
.share-btn-game {
  background: var(--primary);
  color: var(--white);
  border: none;
}

/* Animations */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
