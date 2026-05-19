<script setup>
const props = defineProps({
  result: { type: Object, required: true }
})
const emit = defineEmits(['reset'])

const { name, breed, yearPillar, monthPillar, dayPillar, hourPillar,
  ilju, personality, distribution, missing, elementNames, elementColors } = props.result

const pillars = [
  { label: '년주(年柱)', value: yearPillar },
  { label: '월주(月柱)', value: monthPillar },
  { label: '일주(日柱)', value: dayPillar },
  { label: '시주(時柱)', value: hourPillar }
]
</script>

<template>
  <section class="result">
    <h2 class="result-title">🐾 {{ name }}의 사주 결과</h2>
    <p class="breed-tag">{{ breed }}</p>

    <div class="pillar-card">
      <h3>📋 사주명식 (四柱)</h3>
      <div class="pillars">
        <div class="pillar" v-for="p in pillars" :key="p.label">
          <span class="pillar-label">{{ p.label }}</span>
          <span class="pillar-value">{{ p.value }}</span>
        </div>
      </div>
      <p class="ilju-text">일주: <strong>{{ ilju }}</strong></p>
    </div>

    <div class="personality-card">
      <h3>💖 {{ name }}의 성격 분석</h3>
      <p>{{ personality }}</p>
    </div>

    <div class="element-card">
      <h3>🔄 오행(五行) 분포</h3>
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
        ⚠️ 부족한 오행: {{ missing.map(e => elementNames[e]).join(', ') }}
      </p>
    </div>

    <div class="tips-card">
      <h3>🌸 맞춤 팁</h3>
      <ul>
        <li v-if="missing.includes('木')">🌿 산책과 자연 접촉이 좋아요! 공원 산책을 자주 시켜주세요.</li>
        <li v-if="missing.includes('火')">☀️ 따뜻한 햇살을 좋아해요. 일광욕 시간을 충분히 주세요.</li>
        <li v-if="missing.includes('土')">🏔️ 안정적인 환경이 중요해요. 집을 편안하게 꾸며주세요.</li>
        <li v-if="missing.includes('金')">🪙 깔끔한 그루밍이 중요해요. 정기적으로 미용해주세요.</li>
        <li v-if="missing.includes('水')">💧 물과 관련된 활동을 좋아할 수 있어요. 수영을 시도해보세요!</li>
        <li v-if="!missing.length">✨ 오행이 골고루 갖춰져 있어 아주 균형 잡힌 강아지예요!</li>
      </ul>
    </div>

    <button class="reset-btn" @click="emit('reset')">🔄 다시 보기</button>
  </section>
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
.pillar-card, .personality-card, .element-card, .tips-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 32px 24px;
  margin-bottom: 24px;
}
.pillar-card h3, .personality-card h3, .element-card h3, .tips-card h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 24px;
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
.personality-card p {
  line-height: 1.8;
  color: var(--text-main);
  word-break: keep-all;
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
.reset-btn {
  display: block;
  width: 100%;
  padding: 18px;
  background: transparent;
  color: var(--text-sub);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 32px;
  cursor: pointer;
}
.reset-btn:hover {
  background: var(--primary-light);
  color: var(--primary);
  border-color: var(--primary);
}
</style>
