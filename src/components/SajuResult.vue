<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AdBanner from './AdBanner.vue'
import CompatSection from './CompatSection.vue'
import FengShuiGuide from './FengShuiGuide.vue'
import LuckyCalendar from './LuckyCalendar.vue'
import PetMBTI from './PetMBTI.vue'
import WeeklyHoroscope from './WeeklyHoroscope.vue'
import BirthdayCountdown from './BirthdayCountdown.vue'
import PetZodiac from './PetZodiac.vue'
import PetLuckyFood from './PetLuckyFood.vue'
import PetFortuneGacha from './PetFortuneGacha.vue'
import { t } from '../i18n.js'
import { getLuckyNames } from '../saju.js'

const props = defineProps({
  result: { type: Object, required: true }
})
const emit = defineEmits(['reset'])

const petLabel = props.result.petType === 'cat' ? '고양이' : '강아지'

const { name, breed, yearPillar, monthPillar, dayPillar, hourPillar,
  yearPillarHanja, monthPillarHanja, dayPillarHanja, hourPillarHanja,
  yearAnimal, ilju, personality, distribution, missing, mainElement,
  todayLuck, todayLuckMsg, compatibility, monthlyLuck, age, luckyItems,
  luckyNames: initialLuckyNames, elementNames, elementColors, petTypeResult } = props.result

const luckyNames = ref(initialLuckyNames)

function refreshLuckyNames() {
  luckyNames.value = getLuckyNames(mainElement, missing, props.result.petType)
}

const pillars = [
  { label: '년주(年柱)', value: yearPillar, hanja: yearPillarHanja },
  { label: '월주(月柱)', value: monthPillar, hanja: monthPillarHanja },
  { label: '일주(日柱)', value: dayPillar, hanja: dayPillarHanja },
  { label: '시주(時柱)', value: hourPillar, hanja: hourPillarHanja }
]

const tarotData = ref(null)
const shareToast = ref(false)
const savingImage = ref(false)
const resultRef = ref(null)

const scrollProgress = ref(0)
const activeSection = ref('')

const navSections = [
  { id: 'section-personality', label: '성격분석' },
  { id: 'section-today-luck', label: '오늘의운세' },
  { id: 'section-month-luck', label: '이달의운세' },
  { id: 'section-compat', label: '궁합' },
  { id: 'section-mbti', label: 'MBTI' },
  { id: 'section-calendar', label: '캘린더' },
  { id: 'section-balance', label: '밸런스게임' },
  { id: 'section-birthday', label: '생일카운트다운' },
  { id: 'section-zodiac', label: '별자리' },
  { id: 'section-lucky-food', label: '럭키푸드' },
  { id: 'section-fengshui', label: '풍수' },
  { id: 'section-age', label: '나이환산' },
  { id: 'section-lucky-item', label: '럭키아이템' },
  { id: 'section-care-tip', label: '케어팁' }
]

function handleScroll() {
  const winScroll = window.scrollY
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
  scrollProgress.value = (winScroll / height) * 100
}

let observer = null

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, { threshold: 0.2, rootMargin: '-10% 0px -60% 0px' })

  navSections.forEach((s) => {
    const el = document.getElementById(s.id)
    if (el) observer.observe(el)
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (observer) observer.disconnect()
})

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) {
    const offset = 20
    const bodyRect = document.body.getBoundingClientRect().top
    const elementRect = el.getBoundingClientRect().top
    const elementPosition = elementRect - bodyRect
    const offsetPosition = elementPosition - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

function onTarotSelect(data) {
  tarotData.value = data
}

function buildShareText() {
  const elSummary = Object.entries(distribution)
    .map(([el, pct]) => `${elementNames[el]} ${pct}%`)
    .join(' | ')
  const missingText = missing.length
    ? `\n부족한 오행: ${missing.map(e => elementNames[e]).join(', ')}`
    : ''
  
  const tarotText = tarotData.value 
    ? `\n\n🐾 ${t('tarotSharePrefix')}: ${tarotData.value.cardEmoji} ${tarotData.value.cardName}\n"${tarotData.value.message}"`
    : ''

  return [
    `🐾 ${name}(${breed})의 사주 결과`,
    `━━━━━━━━━━━━━━`,
    `띠: ${yearAnimal}띠`,
    `사주: ${yearPillar} ${monthPillar} ${dayPillar} ${hourPillar}`,
    `일주: ${ilju} — ${personality.title}`,
    ``,
    `${personality.desc}`,
    ``,
    `오행 분포: ${elSummary}${missingText}${tarotText}`,
    ``,
    `🐾 PetLife — ${petLabel} 사주`,
    `https://petlife-pe7.pages.dev`
  ].join('\n')
}

async function shareResult() {
  const text = buildShareText()
  if (navigator.share) {
    try {
      await navigator.share({ title: `${name}의 사주 결과`, text })
    } catch (e) {
      if (e.name !== 'AbortError') copyToClipboard(text)
    }
  } else {
    copyToClipboard(text)
  }
}

async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text)
  shareToast.value = true
  setTimeout(() => { shareToast.value = false }, 2000)
}

function printResult() {
  window.print()
}

async function saveAsImage() {
  savingImage.value = true
  try {
    const el = resultRef.value
    if (!el) return
    // 버튼/토스트 임시 숨김
    const btnGroup = el.querySelector('.btn-group')
    const toast = el.querySelector('.share-toast')
    if (btnGroup) btnGroup.style.display = 'none'
    if (toast) toast.style.display = 'none'
    const canvas = await window.html2canvas(el, {
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-main').trim() || '#FDFCFB',
      scale: 2,
      useCORS: true
    })
    if (btnGroup) btnGroup.style.display = ''
    if (toast) toast.style.display = ''
    const link = document.createElement('a')
    link.download = `${name}_saju.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (e) {
    console.error('이미지 저장 실패:', e)
  }
  savingImage.value = false
}
</script>

<template>
  <transition name="fade-up">
  <section class="result" ref="resultRef">
    <!-- 스크롤 프로그레스 바 -->
    <div class="scroll-progress-container">
      <div class="scroll-progress-bar" :style="{ width: scrollProgress + '%' }"></div>
    </div>

    <!-- 퀵 네비게이션 (플로팅 도트) -->
    <nav class="quick-nav">
      <button 
        v-for="section in navSections" 
        :key="section.id"
        class="nav-dot"
        :class="{ active: activeSection === section.id }"
        @click="scrollToSection(section.id)"
        :title="section.label"
      >
        <span class="dot-label">{{ section.label }}</span>
      </button>
    </nav>

    <h2 class="result-title">{{ name }}의 사주</h2>
    <p class="breed-tag">{{ breed }} · {{ yearAnimal }}띠</p>

    <!-- 상단 광고 -->
    <AdBanner slot="" format="auto" />

    <!-- 성격 분석 -->
    <div id="section-personality" class="personality-card">
      <h3>성격 분석</h3>
      <p class="personality-title">{{ personality.title }}</p>
      <p class="personality-desc">{{ personality.desc }}</p>
      <div class="section-subtitle">특징</div>
      <div class="trait-tags">
        <span class="trait-tag" v-for="t in personality.traits" :key="t">{{ t }}</span>
      </div>
    </div>

    <!-- 산책 스타일 -->
    <div class="detail-card">
      <h3>{{ petLabel === '고양이' ? '놀이 & 활동 스타일' : '산책 스타일' }}</h3>
      <p>{{ personality.walkStyle }}</p>
    </div>

    <!-- 식성 -->
    <div class="detail-card">
      <h3>식성 & 추천 식단</h3>
      <p>{{ personality.foodPref }}</p>
    </div>

    <!-- 건강 팁 -->
    <div class="detail-card">
      <h3>건강 관리 팁</h3>
      <p>{{ personality.healthTip }}</p>
    </div>

    <!-- 오늘의 운세 -->
    <div id="section-today-luck" class="luck-card">
      <h3>오늘의 운세</h3>
      <p class="luck-main">오늘 일주: <strong>{{ todayLuck }}</strong></p>
      <p class="luck-compat">{{ compatibility }}</p>
      <p class="luck-msg">{{ todayLuckMsg }}</p>
    </div>

    <!-- 이달의 운세 -->
    <div id="section-month-luck" class="luck-card">
      <h3>이달의 운세</h3>
      <p class="luck-main">이달의 기운: <strong>{{ monthlyLuck.monthGan }}</strong></p>
      <p class="luck-msg">{{ petLabel === '고양이' ? monthlyLuck.catMsg : monthlyLuck.dogMsg }}</p>
    </div>

    <!-- 반려동물 궁합 -->
    <CompatSection id="section-compat" :myResult="result" />

    <!-- 중간 광고 -->
    <AdBanner slot="" format="auto" />

    <!-- 반려동물 MBTI 성격 유형 -->
    <PetMBTI id="section-mbti" :petType="result.petType" :ilju="ilju" :mainElement="mainElement" :missing="missing" :hourPillar="hourPillar" />

    <!-- 오늘의 반려동물 운세 캡슐 -->
    <PetFortuneGacha :name="name" :mainElement="mainElement" />

    <!-- 럭키 데이 캘린더 -->
    <LuckyCalendar id="section-calendar" :result="result" />

    <!-- 반려동물 주간 운세 -->
    <WeeklyHoroscope :result="result" />

    <!-- 반려동물 밸런스 게임 -->
    <PetBalanceGame id="section-balance" :mainElement="mainElement" :petType="result.petType" />

    <!-- 반려동물 생일 카운트다운 -->
    <BirthdayCountdown id="section-birthday" :result="result" />

    <!-- 반려동물 서양 별자리 -->
    <PetZodiac id="section-zodiac" :month="result.month" :day="result.day" :petType="result.petType" :mainElement="mainElement" />

    <!-- 반려동물 럭키 푸드 -->
    <PetLuckyFood id="section-lucky-food" :petType="result.petType" :mainElement="mainElement" :missing="missing" />

    <!-- 행운의 방위 & 인테리어 -->
    <!-- 하단 광고 -->
    <AdBanner slot="" format="auto" />

    <FengShuiGuide id="section-fengshui" :result="result" />

    <!-- 맞춤 팁 -->
    <div id="section-age" class="detail-card">
      <h3>{{ petLabel }} 나이 환산</h3>
      <div class="age-display">
        <div class="age-item">
          <span class="age-label">실제 나이</span>
          <span class="age-value">{{ age.petAge }}살</span>
        </div>
        <span class="age-arrow">→</span>
        <div class="age-item">
          <span class="age-label">사람 나이</span>
          <span class="age-value highlight">약 {{ age.humanAge }}살</span>
        </div>
      </div>
      <p class="age-stage">현재 <strong>{{ age.stage }}</strong>이에요!</p>
    </div>

    <!-- 럭키 아이템 -->
    <div id="section-lucky-item" class="detail-card">
      <h3>오늘의 럭키 아이템</h3>
      <div class="lucky-grid">
        <div class="lucky-item">
          <span class="lucky-emoji">{{ luckyItems.colorEmoji }}</span>
          <span class="lucky-label">럭키 컬러</span>
          <span class="lucky-value">{{ luckyItems.color }}</span>
        </div>
        <div class="lucky-item">
          <span class="lucky-emoji">🧭</span>
          <span class="lucky-label">럭키 방향</span>
          <span class="lucky-value">{{ luckyItems.direction }}</span>
        </div>
        <div class="lucky-item">
          <span class="lucky-emoji">🍖</span>
          <span class="lucky-label">럭키 간식</span>
          <span class="lucky-value">{{ luckyItems.snack }}</span>
        </div>
        <div class="lucky-item">
          <span class="lucky-emoji">⭐</span>
          <span class="lucky-label">럭키 활동</span>
          <span class="lucky-value">{{ luckyItems.activity }}</span>
        </div>
      </div>
    </div>

    <!-- 럭키 네임 추천 -->
    <div class="detail-card">
      <div class="card-header">
        <h3>{{ t('luckyNameTitle') }}</h3>
        <button class="refresh-btn" @click="refreshLuckyNames">
          <span class="refresh-icon">🔄</span> {{ t('refreshBtn') }}
        </button>
      </div>
      <p class="section-desc">{{ t('luckyNameDesc') }}</p>
      <div class="lucky-names">
        <div v-for="item in luckyNames.names" :key="item.name" class="name-item">
          <div class="name-header">
            <span class="name-text">{{ item.name }}</span>
            <span class="element-tag" :style="{ background: elementColors[item.element] + '22', color: elementColors[item.element] }">
              {{ elementNames[item.element] }}
            </span>
          </div>
          <p class="name-meaning"><strong>{{ t('meaningLabel') }}:</strong> {{ item.meaning }}</p>
        </div>
      </div>
      <p class="name-tip">{{ luckyNames.tip }}</p>
    </div>

    <!-- 맞춤 케어 팁 -->
    <div id="section-care-tip" class="tips-card">
      <h3>맞춤 케어 팁</h3>
      <ul>
        <li v-if="missing.includes('木')">산책과 자연 접촉이 좋아요! 공원 산책을 자주 시켜주세요.</li>
        <li v-if="missing.includes('火')">따뜻한 햇살을 좋아해요. 일광욕 시간을 충분히 주세요.</li>
        <li v-if="missing.includes('土')">안정적인 환경이 중요해요. 집을 편안하게 꾸며주세요.</li>
        <li v-if="missing.includes('金')">깔끔한 그루밍이 중요해요. 정기적으로 미용해주세요.</li>
        <li v-if="missing.includes('水')">물과 관련된 활동을 좋아할 수 있어요. 수영을 시도해보세요!</li>
        <li v-if="!missing.length">오행이 골고루 갖춰져 있어 아주 균형 잡힌 강아지예요!</li>
      </ul>
    </div>

    <div class="btn-group">
      <button class="share-btn" @click="shareResult">결과 공유하기</button>
      <button class="print-btn" @click="printResult">저장/인쇄</button>
      <button class="image-btn" @click="saveAsImage" :disabled="savingImage">{{ savingImage ? '저장 중...' : '이미지 저장' }}</button>
      <button class="reset-btn" @click="emit('reset')">다시 보기</button>
    </div>
    <div class="share-toast" v-if="shareToast">클립보드에 복사되었습니다</div>
  </section>
  </transition>
</template>

<style scoped>
.result {
  padding-top: 20px;
  position: relative;
}

/* Scroll Progress Bar */
.scroll-progress-container {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--bg-main);
  z-index: 1000;
  margin-bottom: -3px;
}
.scroll-progress-bar {
  height: 100%;
  background: var(--primary);
  width: 0;
  transition: width 0.1s ease-out;
}

/* Quick Navigation */
.quick-nav {
  position: fixed;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 100;
  background: var(--bg-main);
  padding: 12px 6px;
  border-radius: 24px;
  border: 1px solid var(--border-light);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: opacity 0.3s;
}
.nav-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border-light);
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.nav-dot:hover {
  background: var(--text-sub);
}
.nav-dot.active {
  background: var(--primary);
  transform: scale(1.4);
}
.dot-label {
  position: absolute;
  right: 28px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--primary);
  color: white;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.7rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  font-weight: 600;
}
.nav-dot:hover .dot-label {
  opacity: 1;
}

@media (max-width: 768px) {
  .quick-nav {
    right: 12px;
    opacity: 0.5;
    background: transparent;
    border: none;
    box-shadow: none;
  }
  .quick-nav:active, .quick-nav:focus-within {
    opacity: 1;
  }
  .nav-dot {
    width: 14px;
    height: 14px;
    background: var(--placeholder);
  }
  .dot-label {
    display: none;
  }
}

@media print {
  .scroll-progress-container, .quick-nav {
    display: none !important;
  }
}

.result-title {
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
  color: var(--text-main);
}
.breed-tag {
  text-align: center;
  color: var(--text-sub);
  font-size: 0.95rem;
  margin-bottom: 48px;
}
.pillar-card, .personality-card, .element-card, .detail-card, .luck-card, .tips-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 32px 24px;
  margin-bottom: 24px;
}
.pillar-card h3, .personality-card h3, .element-card h3,
.detail-card h3, .luck-card h3, .tips-card h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text-main);
}
.pillars {
  display: flex;
  gap: 8px;
  justify-content: space-between;
}
.pillar {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--primary-light);
  padding: 16px 8px;
  border-radius: 8px;
  flex: 1;
}
.pillar-label {
  font-size: 0.75rem;
  color: var(--text-sub);
  margin-bottom: 8px;
}
.pillar-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--primary);
}
.pillar-hanja {
  font-size: 0.7rem;
  color: var(--text-sub);
  opacity: 0.6;
  margin-top: 4px;
}
.ilju-text {
  text-align: center;
  margin-top: 24px;
  font-size: 0.95rem;
  color: var(--text-sub);
}
.ilju-text strong {
  color: var(--primary);
  font-weight: 700;
}
.personality-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 12px;
}
.personality-desc {
  line-height: 1.8;
  color: var(--text-main);
  word-break: keep-all;
  margin-bottom: 16px;
}
.section-subtitle {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-sub);
  margin-bottom: 10px;
}
.trait-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.trait-tag {
  background: var(--primary-light);
  color: var(--primary);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}
.element-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.element-name {
  width: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-sub);
}
.bar-bg {
  flex: 1;
  height: 8px;
  background: var(--bar-bg);
  border-radius: 4px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  border-radius: 4px;
}
.element-pct {
  width: 35px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-sub);
  text-align: right;
}
.missing-text {
  margin-top: 20px;
  padding: 12px;
  background: var(--missing-bg);
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--missing-text);
  text-align: center;
}
.detail-card p {
  line-height: 1.8;
  color: var(--text-main);
  word-break: keep-all;
}
.compat-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.compat-tag {
  background: var(--compat-bg);
  color: var(--compat-text);
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
}
.luck-main {
  font-size: 1rem;
  color: var(--text-main);
  margin-bottom: 12px;
}
.luck-main strong {
  color: var(--primary);
}
.luck-compat {
  color: var(--text-sub);
  font-size: 0.9rem;
  margin-bottom: 12px;
  line-height: 1.6;
}
.luck-msg {
  padding: 14px;
  background: var(--primary-light);
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--primary);
  line-height: 1.6;
}
.tips-card ul {
  list-style: none;
}
.tips-card li {
  padding: 12px 0;
  line-height: 1.6;
  color: var(--text-sub);
  font-size: 0.95rem;
  border-bottom: 1px solid var(--tip-border);
}
.tips-card li:last-child {
  border-bottom: none;
}
.btn-group {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}
.share-btn {
  flex: 1;
  padding: 16px;
  background: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(123, 94, 77, 0.15);
}
.share-btn:hover {
  background: #674E40;
}
.print-btn {
  flex: 1;
  padding: 16px;
  background: transparent;
  color: var(--text-sub);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
}
.print-btn:hover {
  background: var(--primary-light);
  color: var(--primary);
  border-color: var(--primary);
}
.image-btn {
  flex: 1;
  padding: 16px;
  background: var(--primary-light);
  color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
}
.image-btn:hover:not(:disabled) {
  background: var(--primary);
  color: var(--white);
}
.image-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.age-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
}
.age-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.age-label {
  font-size: 0.8rem;
  color: var(--text-sub);
}
.age-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-main);
}
.age-value.highlight {
  color: var(--primary);
}
.age-arrow {
  font-size: 1.2rem;
  color: var(--text-sub);
}
.age-stage {
  text-align: center;
  font-size: 0.95rem;
  color: var(--text-sub);
}
.age-stage strong {
  color: var(--primary);
}
.lucky-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.lucky-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: var(--primary-light);
  padding: 16px 8px;
  border-radius: 10px;
}
.lucky-emoji {
  font-size: 1.5rem;
}
.lucky-label {
  font-size: 0.75rem;
  color: var(--text-sub);
  font-weight: 500;
}
.lucky-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--primary);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.card-header h3 {
  margin-bottom: 0 !important;
}
.refresh-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: 1px solid var(--border-light);
  color: var(--text-sub);
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}
.refresh-btn:hover {
  background: var(--primary-light);
  color: var(--primary);
  border-color: var(--primary);
}
.refresh-icon {
  font-size: 0.8rem;
}
.section-desc {
  font-size: 0.85rem;
  color: var(--text-sub);
  margin-bottom: 20px;
}
.lucky-names {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}
.name-item {
  background: var(--bg-main);
  padding: 16px;
  border-radius: 10px;
  border: 1px solid var(--border-light);
}
.name-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.name-text {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-main);
}
.element-tag {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
}
.name-meaning {
  font-size: 0.9rem;
  color: var(--text-main);
  line-height: 1.5;
}
.name-tip {
  font-size: 0.85rem;
  color: var(--primary);
  background: var(--primary-light);
  padding: 12px;
  border-radius: 8px;
  line-height: 1.6;
}
.reset-btn {
  flex: 1;
  padding: 16px;
  background: transparent;
  color: var(--text-sub);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
}
.reset-btn:hover {
  background: var(--primary-light);
  color: var(--primary);
  border-color: var(--primary);
}
.share-toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--toast-bg);
  color: var(--bg-main);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  z-index: 100;
  animation: toast-in 0.3s ease;
}
@keyframes toast-in {
  from { opacity: 0; transform: translateX(-50%) translateY(8px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
/* Pet Personality Type */
.type-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}
.type-code {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: 0.04em;
  min-width: 100px;
  text-align: center;
  background: var(--primary-light);
  padding: 16px 20px;
  border-radius: 12px;
}
.type-info {
  flex: 1;
}
.type-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-main);
  display: block;
  margin-bottom: 4px;
}
.type-desc-short {
  font-size: 0.9rem;
  color: var(--text-sub);
  line-height: 1.5;
}
.type-gauges {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.gauge-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.gauge-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-sub);
}
.gauge-bar-bg {
  height: 8px;
  background: var(--bar-bg);
  border-radius: 4px;
  overflow: hidden;
}
.gauge-bar-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 4px;
  transition: width 0.5s ease;
}
.fade-up-enter-active {
  transition: all 0.5s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>
