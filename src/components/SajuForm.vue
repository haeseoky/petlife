<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { t, currentLang } from '../i18n.js'

const PROFILE_KEY = 'petlife_profiles'

const emit = defineEmits(['submit'])

const petType = ref('dog')
const name = ref('')
const breed = ref('')
const year = ref(2024)
const month = ref(1)
const day = ref(1)
const hour = ref(12)
const loading = ref(false)
const saveProfile = ref(true)
const profiles = ref([])
const profileToast = ref('')

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

function loadProfiles() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    profiles.value = raw ? JSON.parse(raw) : []
  } catch { profiles.value = [] }
}

function persistProfiles() {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles.value))
}

function savePetProfile() {
  const existing = profiles.value.findIndex(p => p.name === name.value && p.breed === breed.value)
  const entry = {
    id: Date.now(),
    name: name.value,
    petType: petType.value,
    breed: breed.value,
    year: year.value,
    month: month.value,
    day: day.value,
    hour: hour.value,
    savedAt: new Date().toISOString()
  }
  if (existing >= 0) {
    entry.id = profiles.value[existing].id
    profiles.value[existing] = entry
  } else {
    profiles.value.unshift(entry)
    if (profiles.value.length > 10) profiles.value = profiles.value.slice(0, 10)
  }
  persistProfiles()
}

function loadProfile(p) {
  petType.value = p.petType
  name.value = p.name
  breed.value = p.breed
  year.value = p.year
  month.value = p.month
  day.value = p.day
  hour.value = p.hour
  showToast(currentLang.value === 'ko' ? '프로필을 불러왔습니다' : 'Profile loaded')
}

function deleteProfile(id) {
  profiles.value = profiles.value.filter(p => p.id !== id)
  persistProfiles()
}

function showToast(msg) {
  profileToast.value = msg
  setTimeout(() => { profileToast.value = '' }, 2000)
}

onMounted(loadProfiles)

function handleSubmit() {
  loading.value = true
  setTimeout(() => {
    if (saveProfile.value && name.value) {
      savePetProfile()
    }
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
  <!-- 저장된 프로필 -->
  <div v-if="profiles.length" class="profiles-section">
    <div class="profiles-header">
      <span class="profiles-title">📋 {{ t('savedProfiles') }}</span>
    </div>
    <div class="profiles-list">
      <div
        v-for="p in profiles"
        :key="p.id"
        class="profile-card"
        @click="loadProfile(p)"
      >
        <div class="profile-info">
          <span class="profile-emoji">{{ p.petType === 'dog' ? '🐕' : '🐈' }}</span>
          <div class="profile-detail">
            <span class="profile-name">{{ p.name }}</span>
            <span class="profile-meta">{{ p.breed }} · {{ p.year }}.{{ p.month }}.{{ p.day }}</span>
          </div>
        </div>
        <button class="profile-delete" @click.stop="deleteProfile(p.id)" :title="t('deleteProfile')">✕</button>
      </div>
    </div>
  </div>

  <!-- 프로필 로드 토스트 -->
  <transition name="toast">
    <div v-if="profileToast" class="profile-toast">{{ profileToast }}</div>
  </transition>

  <form class="form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label>{{ t('petType') }}</label>
      <div class="type-toggle">
        <button type="button" :class="['type-btn', { active: petType === 'dog' }]" @click="petType = 'dog'">{{ t('dog') }}</button>
        <button type="button" :class="['type-btn', { active: petType === 'cat' }]" @click="petType = 'cat'">{{ t('cat') }}</button>
      </div>
    </div>

    <div class="form-group">
      <label>{{ petType === 'dog' ? t('dog') : t('cat') }} {{ t('nameLabel') }}</label>
      <input v-model="name" type="text" :placeholder="petType === 'dog' ? t('namePlaceholder') : t('catPlaceholder')" required />
    </div>

    <div class="form-group">
      <label>{{ t('breedLabel') }}</label>
      <select v-model="breed" required>
        <option value="" disabled>{{ t('breedDefault') }}</option>
        <option v-for="b in breeds" :key="b" :value="b">{{ b }}</option>
      </select>
    </div>

    <div class="form-group">
      <label>📅 {{ t('birthLabel') }}</label>
      <div class="date-row">
        <select v-model.number="year">
          <option v-for="y in 30" :key="2026-y+1" :value="2026-y+1">{{ 2026-y+1 }}{{ t('yearSuffix') }}</option>
        </select>
        <select v-model.number="month">
          <option v-for="m in 12" :key="m" :value="m">{{ m }}{{ t('monthSuffix') }}</option>
        </select>
        <select v-model.number="day">
          <option v-for="d in 31" :key="d" :value="d">{{ d }}{{ t('daySuffix') }}</option>
        </select>
      </div>
    </div>

    <div class="form-group">
      <label>🕐 {{ t('hourLabel') }}</label>
      <select v-model.number="hour">
        <option v-for="h in 24" :key="h-1" :value="h-1">{{ String(h-1).padStart(2, '0') }}{{ t('hourSuffix') }}</option>
      </select>
    </div>

    <button type="submit" class="submit-btn" :disabled="loading">
      <span v-if="loading" class="spinner"></span>
      <span v-else>{{ t('submitBtn') }}</span>
    </button>

    <label class="save-profile-check">
      <input type="checkbox" v-model="saveProfile" />
      <span>{{ t('saveProfile') }}</span>
    </label>
  </form>
</template>

<style scoped>
/* 프로필 섹션 */
.profiles-section {
  margin-bottom: 24px;
}
.profiles-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.profiles-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-main);
}
.profiles-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.profile-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.profile-card:hover {
  border-color: var(--primary);
  box-shadow: 0 2px 8px rgba(123, 94, 77, 0.1);
  transform: translateY(-1px);
}
.profile-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.profile-emoji {
  font-size: 1.3rem;
}
.profile-detail {
  display: flex;
  flex-direction: column;
}
.profile-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
}
.profile-meta {
  font-size: 0.78rem;
  color: var(--text-sub);
}
.profile-delete {
  background: none;
  border: none;
  color: var(--placeholder);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}
.profile-delete:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
}

/* 프로필 토스트 */
.profile-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--toast-bg);
  color: var(--bg-main);
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

/* 폼 */
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
.save-profile-check {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--text-sub);
}
.save-profile-check input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
  cursor: pointer;
}
</style>
