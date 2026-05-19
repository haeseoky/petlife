<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['submit'])

const petType = ref('dog')
const name = ref('')
const breed = ref('')
const year = ref(2024)
const month = ref(1)
const day = ref(1)
const hour = ref(12)
const loading = ref(false)

const dogBreeds = [
  '말티즈', '푸들', '포메라니안', '치와와', '요크셔테리어',
  '시바견', '골든 리트리버', '래브라도 리트리버', '비숑프리제',
  '닥스훈트', '불독', '진돗개', '시츄', '코커스패니얼', '보더콜리',
  '프렌치불독', '포인터', '저먼셰퍼드', '로트와일러', '허스키',
  '사모예드', '도베르만', '웰시코기', '미니핀', '파피용',
  '퍼그', '스피츠', '미니어처슈나우저', '말티푸', '골든두들',
  '삽살개', '풍산개', '알래스칸 맬러뮤트', '버니즈 마운틴 독', '보스턴 테리어',
  '쉽독', '달마시안', '비글', '차우차우', '아키타', '기타'
]

const catBreeds = [
  '코리안 쇼트헤어', '페르시안', '러시안 블루', '샴', '아메리칸 쇼트헤어',
  '브리티시 쇼트헤어', '랙돌', '스코티시 폴드', '먼치킨', '노르웨이전 숲 고양이',
  '메인쿤', '벵갈', '시암', '아비시니안', '스핑크스',
  '터키쉬 앙고라', '버미즈', '히말라얀', '엑조틱 쇼트헤어', '아메리칸 컬',
  '재패니즈 밥테일', '맨x', '코니시 렉스', '소말리', '버만',
  '토티쉬 쇼트헤어', '오시캣', '샤트룩스', '싱가푸라', '기타'
]

const breeds = computed(() => petType.value === 'dog' ? dogBreeds : catBreeds)

function handleSubmit() {
  loading.value = true
  setTimeout(() => {
    emit('submit', {
      petType: petType.value,
      name: name.value,
      breed: breed.value,
      year: year.value,
      month: month.value,
      day: day.value,
      hour: hour.value
    })
    loading.value = false
  }, 600)
}

watch(petType, () => { breed.value = '' })
</script>

<template>
  <form class="form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label>반려동물 종류</label>
      <div class="type-toggle">
        <button type="button" :class="['type-btn', { active: petType === 'dog' }]" @click="petType = 'dog'">강아지</button>
        <button type="button" :class="['type-btn', { active: petType === 'cat' }]" @click="petType = 'cat'">고양이</button>
      </div>
    </div>

    <div class="form-group">
      <label>{{ petType === 'dog' ? '강아지' : '고양이' }} 이름</label>
      <input v-model="name" type="text" :placeholder="petType === 'dog' ? '예: 초코' : '예: 나비'" required />
    </div>

    <div class="form-group">
      <label>품종</label>
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

    <button type="submit" class="submit-btn" :disabled="loading">
      <span v-if="loading" class="spinner"></span>
      <span v-else>사주 보기</span>
    </button>
  </form>
</template>

<style scoped>
.form {
  background: var(--white);
  padding: 0;
}
.type-toggle {
  display: flex;
  gap: 8px;
}
.type-btn {
  flex: 1;
  padding: 12px;
  background: var(--primary-light);
  color: var(--text-sub);
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
}
.type-btn.active {
  background: var(--white);
  color: var(--primary);
  border-color: var(--primary);
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
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
}
.submit-btn:hover:not(:disabled) {
  background: #674E40;
  transform: translateY(-1px);
}
.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.spinner {
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
