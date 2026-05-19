<script setup>
import { ref } from 'vue'

const emit = defineEmits(['submit'])

const name = ref('')
const breed = ref('')
const year = ref(2024)
const month = ref(1)
const day = ref(1)
const hour = ref(12)

const breeds = [
  '말티즈', '푸들', '포메라니안', '치와와', '요크셔테리어',
  '시바견', '골든 리트리버', '래브라도 리트리버', '비숑프리제',
  '닥스훈트', '불독', '진돗개', '시츄', '코커스패니얼', '보더콜리', '기타'
]

function handleSubmit() {
  emit('submit', {
    name: name.value,
    breed: breed.value,
    year: year.value,
    month: month.value,
    day: day.value,
    hour: hour.value
  })
}
</script>

<template>
  <form class="form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label>🐕 강아지 이름</label>
      <input v-model="name" type="text" placeholder="예: 초코" required />
    </div>

    <div class="form-group">
      <label>🐾 품종</label>
      <select v-model="breed" required>
        <option value="" disabled>품종을 선택해주세요</option>
        <option v-for="b in breeds" :key="b" :value="b">{{ b }}</option>
      </select>
    </div>

    <div class="form-group">
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

    <div class="form-group">
      <label>🕐 태어난 시각 (모르면 12시)</label>
      <select v-model.number="hour">
        <option v-for="h in 24" :key="h-1" :value="h-1">{{ String(h-1).padStart(2, '0') }}시</option>
      </select>
    </div>

    <button type="submit" class="submit-btn">🔮 사주 보기</button>
  </form>
</template>

<style scoped>
.form {
  background: var(--white);
  padding: 0;
}
.form-group {
  margin-bottom: 32px;
}
.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: var(--text-main);
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 0;
  border: none;
  border-bottom: 1.5px solid var(--border-light);
  border-radius: 0;
  font-size: 1.05rem;
  font-family: inherit;
  background: transparent;
  transition: border-color 0.3s;
}
.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary);
}
.form-group input::placeholder {
  color: #CCC6C0;
}
.date-row {
  display: flex;
  gap: 20px;
}
.date-row select {
  flex: 1;
}
.submit-btn {
  width: 100%;
  padding: 18px;
  background: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  margin-top: 16px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(123, 94, 77, 0.15);
}
.submit-btn:hover {
  background: #674E40;
  transform: translateY(-1px);
}
</style>
