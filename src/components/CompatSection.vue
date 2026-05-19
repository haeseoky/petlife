<script setup>
import { ref, computed } from 'vue'
import { computeSaju, computeCompat } from '../saju'

const props = defineProps({
  myResult: { type: Object, required: true }
})

const petType = ref('dog')
const name = ref('')
const year = ref(2024)
const month = ref(1)
const day = ref(1)
const hour = ref(12)
const loading = ref(false)
const compatResult = ref(null)

const petLabel = computed(() => petType.value === 'cat' ? '고양이' : '강아지')

function handleCompat() {
  loading.value = true
  setTimeout(() => {
    const other = computeSaju(year.value, month.value, day.value, hour.value, petType.value)
    other.name = name.value || (petType.value === 'cat' ? '고양이' : '강아지')
    other.petType = petType.value
    compatResult.value = computeCompat(props.myResult, other)
    compatResult.value.otherName = other.name
    compatResult.value.otherBreed = petType.value === 'cat' ? '고양이' : '강아지'
    compatResult.value.otherIlju = other.ilju
    compatResult.value.otherAnimal = other.yearAnimal
    loading.value = false
  }, 500)
}
</script>

<template>
  <div class="compat-section">
    <h3>💞 반려동물 궁합</h3>
    <p class="compat-desc">{{ myResult.name }}와(과) 다른 반려동물의 궁합을 알아보세요!</p>

    <div v-if="!compatResult" class="compat-form">
      <div class="form-row">
        <label>종류</label>
        <div class="type-toggle">
          <button type="button" :class="['type-btn', { active: petType === 'dog' }]" @click="petType = 'dog'">강아지</button>
          <button type="button" :class="['type-btn', { active: petType === 'cat' }]" @click="petType = 'cat'">고양이</button>
        </div>
      </div>
      <div class="form-row">
        <label>{{ petLabel }} 이름</label>
        <input v-model="name" type="text" :placeholder="petType === 'dog' ? '예: 초코' : '예: 나비'" />
      </div>
      <div class="form-row">
        <label>📅 생년월일</label>
        <div class="date-row">
          <select v-model.number="year">
            <option v-for="y in 30" :key="2026-y+1" :value="2026-y+1">{{ 2026-y+1 }}년</option>
          </select>
          <select v-model.number="month">
            <option v-for="m in 12" :key="m" :value="m">{{ m }}월</option>
          </select>
          <select v-model.number="day">
            <option v-for="d in 31" :key="d" :value="d">{{ d }}일</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <label>🕐 태어난 시각</label>
        <select v-model.number="hour">
          <option v-for="h in 24" :key="h-1" :value="h-1">{{ String(h-1).padStart(2, '0') }}시</option>
        </select>
      </div>
      <button class="compat-btn" :disabled="loading" @click="handleCompat">
        <span v-if="loading" class="spinner"></span>
        <span v-else>궁합 보기</span>
      </button>
    </div>

    <div v-else class="compat-result">
      <div class="compat-header">
        <span class="compat-name">{{ myResult.name }}</span>
        <span class="compat-heart">🤝</span>
        <span class="compat-name">{{ compatResult.otherName }}</span>
      </div>

      <div class="score-ring" :class="compatResult.score >= 75 ? 'high' : compatResult.score >= 50 ? 'mid' : 'low'">
        <span class="score-num">{{ compatResult.score }}</span>
        <span class="score-label">{{ compatResult.label }}</span>
      </div>

      <div class="compat-relation">
        <p>{{ myResult.name }}({{ myResult.mainElement }}) ↔ {{ compatResult.otherName }}({{ compatResult.el2 }})</p>
        <p class="relation-text">{{ compatResult.relation }}</p>
      </div>

      <div class="compat-info">
        <div class="info-item">
          <span class="info-label">{{ compatResult.otherName }}의 일주</span>
          <span class="info-value">{{ compatResult.otherIlju }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{ compatResult.otherName }}의 띠</span>
          <span class="info-value">{{ compatResult.otherAnimal }}띠</span>
        </div>
      </div>

      <div class="compat-tips">
        <h4>💡 궁합 팁</h4>
        <ul>
          <li v-for="(tip, i) in compatResult.tips" :key="i">{{ tip }}</li>
        </ul>
      </div>

      <button class="retry-btn" @click="compatResult = null">다시 보기</button>
    </div>
  </div>
</template>

<style scoped>
.compat-section {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 32px 24px;
  margin-bottom: 24px;
}
.compat-section h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-main);
}
.compat-desc {
  font-size: 0.9rem;
  color: var(--text-sub);
  margin-bottom: 20px;
}
.form-row {
  margin-bottom: 16px;
}
.form-row label {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 8px;
  color: var(--text-main);
}
.form-row input,
.form-row select {
  width: 100%;
  padding: 10px 0;
  border: none;
  border-bottom: 1.5px solid var(--border-light);
  border-radius: 0;
  font-size: 0.95rem;
  font-family: inherit;
  background: transparent;
}
.form-row input:focus,
.form-row select:focus {
  outline: none;
  border-color: var(--primary);
}
.form-row input::placeholder {
  color: var(--placeholder);
}
.type-toggle {
  display: flex;
  gap: 6px;
}
.type-btn {
  flex: 1;
  padding: 10px;
  background: var(--primary-light);
  color: var(--text-sub);
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}
.type-btn.active {
  background: var(--white);
  color: var(--primary);
  border-color: var(--primary);
}
.date-row {
  display: flex;
  gap: 12px;
}
.date-row select {
  flex: 1;
}
.compat-btn {
  width: 100%;
  padding: 14px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  margin-top: 8px;
}
.compat-btn:hover:not(:disabled) {
  opacity: 0.9;
}
.compat-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.compat-result {
  text-align: center;
}
.compat-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}
.compat-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-main);
}
.compat-heart {
  font-size: 1.3rem;
}
.score-ring {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 20px;
  border: 4px solid;
}
.score-ring.high {
  border-color: #ef4444;
  background: rgba(239,68,68,0.06);
}
.score-ring.mid {
  border-color: #eab308;
  background: rgba(234,179,8,0.06);
}
.score-ring.low {
  border-color: #3b82f6;
  background: rgba(59,130,246,0.06);
}
.score-num {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1;
}
.score-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-sub);
  margin-top: 4px;
}
.compat-relation {
  margin-bottom: 20px;
}
.compat-relation p {
  font-size: 0.9rem;
  color: var(--text-sub);
}
.relation-text {
  margin-top: 8px;
  font-weight: 600;
  color: var(--primary) !important;
  line-height: 1.6;
}
.compat-info {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 20px;
}
.info-item {
  background: var(--primary-light);
  padding: 10px 16px;
  border-radius: 8px;
  text-align: center;
}
.info-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-sub);
  margin-bottom: 4px;
}
.info-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--primary);
}
.compat-tips {
  text-align: left;
  margin-bottom: 20px;
}
.compat-tips h4 {
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--text-main);
}
.compat-tips ul {
  list-style: none;
}
.compat-tips li {
  padding: 10px 0;
  font-size: 0.9rem;
  color: var(--text-sub);
  border-bottom: 1px solid var(--tip-border);
  line-height: 1.6;
}
.compat-tips li:last-child {
  border-bottom: none;
}
.retry-btn {
  padding: 10px 24px;
  background: transparent;
  color: var(--text-sub);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}
.retry-btn:hover {
  background: var(--primary-light);
  color: var(--primary);
  border-color: var(--primary);
}
</style>
