<script setup>
import { ref, computed, onMounted } from 'vue'
import { t, currentLang } from '../i18n.js'

const props = defineProps({
  name: { type: String, required: true },
  mainElement: { type: String, required: true }
})

const isDrawing = ref(false)
const showResult = ref(false)
const fortune = ref(null)
const stats = ref({})

// Fortune Data
const fortunes = {
  '木': [
    { emoji: '🌿', title: { ko: '성장의 하루', en: 'Day of Growth' }, msg: { ko: '새로운 호기심이 생겨나는 날이에요. 평소보다 더 활기차게 주변을 탐색할 거예요. 나무처럼 쑥쑥 자라나는 기운이 넘칩니다.', en: 'A day of growing curiosity. Your pet will explore more actively than usual. Energy like a growing tree is overflowing.' } },
    { emoji: '🌳', title: { ko: '든든한 기운', en: 'Sturdy Energy' }, msg: { ko: '뿌리 깊은 나무처럼 안정감이 느껴지는 날입니다. 보호자와의 신뢰가 더욱 두터워질 거예요. 평온한 휴식을 즐기기 좋습니다.', en: 'A day of stability like a deep-rooted tree. Trust with the owner will deepen. Good for enjoying peaceful rest.' } },
    { emoji: '🍃', title: { ko: '싱그러운 산책', en: 'Fresh Walk' }, msg: { ko: '풀냄새 가득한 날이니 산책 나들이하기 좋아요. 풀 냄새를 맡으며 아이가 기분 좋게 걸을 수 있을 거예요.', en: 'A great day for a walk smelling the grass. Nature\'s energy will give your pet great vitality. Have a fun time with light steps.' } }
  ],
  '火': [
    { emoji: '☀️', title: { ko: '태양의 열정', en: 'Solar Passion' }, msg: { ko: '에너지가 최고조에 달하는 날입니다! 신나게 뛰어놀며 스트레스를 해소하기 딱 좋아요. 밝은 미소가 끊이지 않는 하루가 될 거예요.', en: 'Energy is at its peak! Perfect for running around and relieving stress. It will be a day full of bright smiles.' } },
    { emoji: '🔥', title: { ko: '뜨거운 우다다', en: 'Fiery Zoomies' }, msg: { ko: '사냥 본능이 깨어나는 활발한 날입니다. 낚시대나 공놀이로 넘치는 힘을 발산하게 해주세요. 밤에는 꿀잠을 자게 될 거예요.', en: 'A lively day when hunting instincts awaken. Let them release their power with wand toys or ball games. They will sleep soundly at night.' } },
    { emoji: '🕯️', title: { ko: '따뜻한 온기', en: 'Warm Glow' }, msg: { ko: '촛불처럼 부드러운 기운이 감도는 날이에요. 스킨십을 나누면 아이도 마음이 편안해질 거예요.', en: 'A day full of soft and warm love like a candle. Share each other\'s warmth through physical contact. A heart-warming day.' } }
  ],
  '土': [
    { emoji: '⛰️', title: { ko: '태산 같은 편안함', en: 'Mountainous Comfort' }, msg: { ko: '느긋하고 평화로운 하루가 예상됩니다. 서두르지 않고 자신만의 속도로 시간을 보낼 거예요. 안정적인 환경이 큰 위로가 됩니다.', en: 'A relaxed and peaceful day is expected. They will spend time at their own pace without rushing. A stable environment is a great comfort.' } },
    { emoji: '🌏', title: { ko: '대지의 포용', en: 'Earth\'s Embrace' }, msg: { ko: '모두와 잘 어울리는 화합의 기운이 있어요. 다른 친구들이나 가족들과 다정하게 지낼 수 있는 날입니다. 넓은 마음을 보여줄 거예요.', en: 'There is a spirit of harmony that gets along with everyone. A day to be affectionate with friends or family. They will show a broad mind.' } },
    { emoji: '🧱', title: { ko: '믿음직한 하루', en: 'Reliable Day' }, msg: { ko: '묵묵히 주인의 곁을 지키는 듬직한 모습을 보여줍니다. 말하지 않아도 서로의 마음을 느낄 수 있어요. 깊은 유대감을 만끽하세요.', en: 'They show a reliable appearance, silently staying by the owner\'s side. You can feel each other\'s hearts without words. Enjoy the deep bond.' } }
  ],
  '金': [
    { emoji: '💎', title: { ko: '반짝이는 지혜', en: 'Sparkling Wisdom' }, msg: { ko: '오늘따라 눈치가 빠르고 영리하게 행동할 거예요. 새로운 개인기를 가르치기에 아주 좋은 날입니다. 명석한 두뇌 회전에 깜짝 놀랄지도 몰라요.', en: 'They will act particularly quick-witted and smart today. A great day to teach new tricks. You might be surprised by their sharp mind.' } },
    { emoji: '⚔️', title: { ko: '당당한 카리스마', en: 'Bold Charisma' }, msg: { ko: '자신감이 넘치고 당당한 매력을 발산하는 날입니다. 산책길에서도 위풍당당하게 걷는 모습이 돋보일 거예요. 멋진 아이의 모습을 지켜봐 주세요.', en: 'A day of overflowing confidence and bold charm. Their dignified walk on the path will stand out. Watch your cool pet.' } },
    { emoji: '🔔', title: { ko: '깔끔한 기분', en: 'Crisp Mood' }, msg: { ko: '그루밍을 정성껏 하며 단장하는 세심한 하루예요. 깨끗한 환경에서 기분이 더 좋아질 것입니다. 빗질로 사랑을 표현해보세요.', en: 'A meticulous day of careful grooming. They will feel better in a clean environment. Express your love through brushing.' } }
  ],
  '水': [
    { emoji: '🌊', title: { ko: '바다 같은 모험', en: 'Oceanic Adventure' }, msg: { ko: '호기심이 왕성해져 새로운 것을 찾아 나서는 날이에요. 물 흐르듯 자연스럽게 환경에 적응하며 즐거움을 찾습니다. 모험심을 응원해주세요.', en: 'Curiosity grows, and they set out to find something new today. They find joy by adapting to the environment naturally like flowing water. Cheer for their adventurous spirit.' } },
    { emoji: '💧', title: { ko: '맑은 감수성', en: 'Clear Sensitivity' }, msg: { ko: '섬세한 감각이 돋보이는 차분한 하루입니다. 조용히 창밖을 구경하거나 사색에 잠기는 시간을 가질 거예요. 풍부한 내면을 존중해주세요.', en: 'A calm day where delicate senses stand out. They will spend time quietly watching outside or being lost in thought. Respect their rich inner self.' } },
    { emoji: '☔', title: { ko: '촉촉한 교감', en: 'Moist Communion' }, msg: { ko: '주인의 마음을 깊이 헤아리는 영특한 날이에요. 눈빛만으로도 많은 이야기를 나눌 수 있습니다. 촉촉한 감성이 묻어나는 하루를 보내세요.', en: 'A clever day where they deeply understand the owner\'s heart. You can share many stories just through eye contact. Have a day full of moist emotions.' } }
  ]
}

// Seeded Random
function getSeed(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generateFortune() {
  const dateStr = new Date().toISOString().split('T')[0]
  const seedBase = getSeed(props.name + dateStr)
  
  const elementFortunes = fortunes[props.mainElement] || fortunes['土']
  const fortuneIdx = Math.floor(seededRandom(seedBase) * elementFortunes.length)
  fortune.value = elementFortunes[fortuneIdx]
  
  stats.value = {
    affection: Math.floor(seededRandom(seedBase + 1) * 41) + 60, // 60-100
    health: Math.floor(seededRandom(seedBase + 2) * 41) + 60,
    play: Math.floor(seededRandom(seedBase + 3) * 41) + 60,
    appetite: Math.floor(seededRandom(seedBase + 4) * 41) + 60
  }
}

function drawCapsule() {
  if (isDrawing.value) return
  isDrawing.value = true
  showResult.value = false
  
  setTimeout(() => {
    generateFortune()
    isDrawing.value = false
    showResult.value = true
  }, 2000)
}

onMounted(() => {
  // Optional: Auto-load if already drawn today? 
  // Requirement says "Can draw once a day". Seed-based ensures same result.
  // We can just leave it for the user to click.
})

const currentFortune = computed(() => {
  if (!fortune.value) return null
  const lang = currentLang.value === 'ko' ? 'ko' : 'en'
  return {
    emoji: fortune.value.emoji,
    title: fortune.value.title[lang],
    msg: fortune.value.msg[lang]
  }
})
</script>

<template>
  <div class="gacha-card">
    <div class="gacha-header">
      <h3>{{ t('gachaTitle') }}</h3>
      <p>{{ t('gachaDesc') }}</p>
    </div>

    <div class="gacha-container">
      <!-- Machine UI -->
      <div class="machine" :class="{ 'is-shaking': isDrawing }">
        <div class="machine-dome">
          <div class="capsules">
            <div class="capsule-item c1"></div>
            <div class="capsule-item c2"></div>
            <div class="capsule-item c3"></div>
            <div class="capsule-item c4"></div>
            <div class="capsule-item c5"></div>
          </div>
        </div>
        <div class="machine-body">
          <div class="knob-area">
            <div class="knob" :class="{ 'is-turning': isDrawing }"></div>
          </div>
          <div class="exit-port">
            <div v-if="isDrawing" class="dropping-capsule"></div>
          </div>
        </div>
      </div>

      <!-- Draw Button -->
      <button class="draw-btn" @click="drawCapsule" :disabled="isDrawing">
        {{ isDrawing ? t('gachaDrawing') : t('gachaBtn') }}
      </button>

      <p class="daily-limit">{{ t('gachaDailyLimit') }}</p>

      <!-- Result Result -->
      <transition name="pop-in">
        <div v-if="showResult && currentFortune" class="result-overlay">
          <div class="fortune-card">
            <div class="card-sparkle"></div>
            <div class="fortune-emoji">{{ currentFortune.emoji }}</div>
            <h4 class="fortune-title">{{ currentFortune.title }}</h4>
            <p class="fortune-msg">{{ currentFortune.msg }}</p>
            
            <div class="fortune-stats">
              <div class="stat-item">
                <span class="stat-label">{{ t('gachaAffection') }}</span>
                <div class="stat-bar"><div class="stat-fill" :style="{ width: stats.affection + '%' }"></div></div>
                <span class="stat-val">{{ stats.affection }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">{{ t('gachaHealth') }}</span>
                <div class="stat-bar"><div class="stat-fill" :style="{ width: stats.health + '%' }"></div></div>
                <span class="stat-val">{{ stats.health }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">{{ t('gachaPlay') }}</span>
                <div class="stat-bar"><div class="stat-fill" :style="{ width: stats.play + '%' }"></div></div>
                <span class="stat-val">{{ stats.play }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">{{ t('gachaAppetite') }}</span>
                <div class="stat-bar"><div class="stat-fill" :style="{ width: stats.appetite + '%' }"></div></div>
                <span class="stat-val">{{ stats.appetite }}</span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.gacha-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 32px 24px;
  margin-bottom: 24px;
  text-align: center;
}

.gacha-header h3 {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-main);
}

.gacha-header p {
  font-size: 0.9rem;
  color: var(--text-sub);
  margin-bottom: 32px;
}

.gacha-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Machine Styling */
.machine {
  width: 160px;
  margin-bottom: 24px;
  position: relative;
}

.machine-dome {
  height: 120px;
  background: rgba(255, 255, 255, 0.2);
  border: 4px solid var(--primary);
  border-radius: 80px 80px 10px 10px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
  backdrop-filter: blur(2px);
  z-index: 2;
}

.machine-body {
  height: 100px;
  background: var(--primary);
  border-radius: 10px 10px 20px 20px;
  position: relative;
  z-index: 1;
  box-shadow: 0 6px 0 rgba(0,0,0,0.1);
}

.capsules {
  position: absolute;
  width: 100%;
  height: 100%;
}

.capsule-item {
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid rgba(0,0,0,0.1);
}

.c1 { background: #FF6B6B; top: 70px; left: 30px; }
.c2 { background: #4D96FF; top: 80px; left: 70px; }
.c3 { background: #6BCB77; top: 65px; left: 100px; }
.c4 { background: #FFD93D; top: 40px; left: 50px; }
.c5 { background: #F8F5F2; top: 50px; left: 85px; }

.knob-area {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  background: rgba(0,0,0,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.knob {
  width: 30px;
  height: 8px;
  background: #F8F5F2;
  border-radius: 4px;
  position: relative;
}
.knob::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 30px;
  background: #F8F5F2;
  border-radius: 4px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.exit-port {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 30px;
  background: rgba(0,0,0,0.2);
  border-radius: 5px;
}

/* Animations */
@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-2deg); }
  75% { transform: rotate(2deg); }
}
.is-shaking {
  animation: shake 0.2s infinite;
}

@keyframes turn {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.is-turning {
  animation: turn 0.5s linear 3;
}

.dropping-capsule {
  width: 26px;
  height: 26px;
  background: #FFD93D;
  border-radius: 50%;
  position: absolute;
  top: -20px;
  left: 7px;
  animation: drop 1s ease-in forwards;
  z-index: 5;
  border: 2px solid rgba(0,0,0,0.1);
}

@keyframes drop {
  0% { transform: translateY(-30px); opacity: 0; }
  20% { opacity: 1; }
  80% { transform: translateY(10px); opacity: 1; }
  100% { transform: translateY(15px) scale(1.2); opacity: 0; }
}

/* Button Styling */
.draw-btn {
  width: 100%;
  max-width: 200px;
  padding: 14px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 30px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(123, 94, 77, 0.2);
  transition: all 0.2s ease;
}

.draw-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(123, 94, 77, 0.3);
}

.draw-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.daily-limit {
  margin-top: 12px;
  font-size: 0.75rem;
  color: var(--text-sub);
}

/* Result Overlay */
.result-overlay {
  margin-top: 32px;
  width: 100%;
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fortune-card {
  background: var(--primary-light);
  border: 2px solid var(--primary);
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.card-sparkle {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.4) 50%, transparent 55%);
  background-size: 200% 200%;
  animation: sparkle 3s infinite;
  pointer-events: none;
}

@keyframes sparkle {
  0% { background-position: -100% -100%; }
  100% { background-position: 200% 200%; }
}

.fortune-emoji {
  font-size: 3rem;
  margin-bottom: 12px;
}

.fortune-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 12px;
}

.fortune-msg {
  font-size: 0.95rem;
  color: var(--text-main);
  line-height: 1.6;
  margin-bottom: 24px;
  word-break: keep-all;
}

.fortune-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-label {
  width: 60px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-sub);
}

.stat-bar {
  flex: 1;
  height: 6px;
  background: var(--bar-bg);
  border-radius: 3px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 3px;
  transition: width 1s ease-out;
}

.stat-val {
  width: 25px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary);
  text-align: right;
}

/* Transitions */
@keyframes popIn {
  from { opacity: 0; transform: scale(0.8) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.pop-in-enter-active {
  animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>
