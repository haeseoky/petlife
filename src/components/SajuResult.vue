<script setup>
import { ref } from 'vue'

const props = defineProps({
  result: { type: Object, required: true }
})
const emit = defineEmits(['reset'])

const petLabel = props.result.petType === 'cat' ? '고양이' : '강아지'

const { name, breed, yearPillar, monthPillar, dayPillar, hourPillar,
  yearAnimal, ilju, personality, distribution, missing, mainElement,
  todayLuck, todayLuckMsg, compatibility, elementNames, elementColors } = props.result

const pillars = [
  { label: '년주(年柱)', value: yearPillar },
  { label: '월주(月柱)', value: monthPillar },
  { label: '일주(日柱)', value: dayPillar },
  { label: '시주(時柱)', value: hourPillar }
]

const shareToast = ref(false)

function buildShareText() {
  const elSummary = Object.entries(distribution)
    .map(([el, pct]) => `${elementNames[el]} ${pct}%`)
    .join(' | ')
  const missingText = missing.length
    ? `\n부족한 오행: ${missing.map(e => elementNames[e]).join(', ')}`
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
    `오행 분포: ${elSummary}${missingText}`,
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
</script>

<template>
  <transition name="fade-up">
  <section class="result">
    <h2 class="result-title">{{ name }}의 사주</h2>
    <p class="breed-tag">{{ breed }} · {{ yearAnimal }}띠</p>

    <!-- 사주 명식 -->
    <div class="pillar-card">
      <h3>사주명식 (四柱)</h3>
      <div class="pillars">
        <div class="pillar" v-for="p in pillars" :key="p.label">
          <span class="pillar-label">{{ p.label }}</span>
          <span class="pillar-value">{{ p.value }}</span>
        </div>
      </div>
      <p class="ilju-text">일주 <strong>{{ ilju }}</strong></p>
    </div>

    <!-- 성격 분석 -->
    <div class="personality-card">
      <h3>성격 분석</h3>
      <p class="personality-title">{{ personality.title }}</p>
      <p class="personality-desc">{{ personality.desc }}</p>
      <div class="section-subtitle">특징</div>
      <div class="trait-tags">
        <span class="trait-tag" v-for="t in personality.traits" :key="t">{{ t }}</span>
      </div>
    </div>

    <!-- 오행 분포 -->
    <div class="element-card">
      <h3>오행(五行) 분포</h3>
      <div class="element-bars">
        <div class="element-row" v-for="(pct, el) in distribution" :key="el">
          <span class="element-name">{{ elementNames[el] }}</span>
          <div class="bar-bg">
            <div class="bar-fill" :style="{ width: pct + '%', background: elementColors[el] }"></div>
          </div>
          <span class="element-pct">{{ pct }}%</span>
        </div>
      </div>
      <p v-if="missing.length" class="missing-text">
        부족한 오행: {{ missing.map(e => elementNames[e]).join(', ') }}
      </p>
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

    <!-- 잘 맞는 일주 -->
    <div class="detail-card">
      <h3>잘 맞는 일주</h3>
      <div class="compat-list">
        <span class="compat-tag" v-for="c in personality.compatible" :key="c">{{ c }}</span>
      </div>
    </div>

    <!-- 오늘의 운세 -->
    <div class="luck-card">
      <h3>오늘의 운세</h3>
      <p class="luck-main">오늘 일주: <strong>{{ todayLuck }}</strong></p>
      <p class="luck-compat">{{ compatibility }}</p>
      <p class="luck-msg">{{ todayLuckMsg }}</p>
    </div>

    <!-- 맞춤 팁 -->
    <div class="tips-card">
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
      <button class="reset-btn" @click="emit('reset')">다시 보기</button>
    </div>
    <div class="share-toast" v-if="shareToast">클립보드에 복사되었습니다</div>
  </section>
  </transition>
</template>

<style scoped>
.result {
  padding-top: 20px;
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
  background: #F0EDE9;
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
  background: #FFF9F0;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #A37B45;
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
  background: #F0F7FF;
  color: #3B82F6;
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
  border-bottom: 1px solid #F8F7F5;
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
  background: var(--text-main);
  color: var(--white);
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
.fade-up-enter-active {
  transition: all 0.5s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>
