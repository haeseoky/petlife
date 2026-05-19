<script setup>
import { computed } from 'vue'
import { computeWeeklyFortune } from '../saju.js'
import { t } from '../i18n.js'

const props = defineProps({
  result: { type: Object, required: true }
})

const weeklyData = computed(() => {
  const { ilju, mainElement, missing, petType } = props.result
  return computeWeeklyFortune(ilju, mainElement, missing, petType)
})
</script>

<template>
  <div class="weekly-horoscope">
    <div class="card-header">
      <h3>{{ t('weeklyHoroscope') }}</h3>
    </div>
    <p class="section-desc">{{ t('weeklyHoroscopeDesc') }}</p>

    <div class="weekly-list">
      <div 
        v-for="(day, index) in weeklyData.days" 
        :key="index" 
        class="weekly-item"
        :class="{ 'is-today': day.isToday }"
      >
        <div class="day-info">
          <span class="day-name">{{ day.dayName }}</span>
          <span class="day-date">{{ day.date }}</span>
          <span v-if="day.isToday" class="today-tag">{{ t('todayHighlight') }}</span>
        </div>
        
        <div class="fortune-content">
          <div class="score-stars">
            <span v-for="star in 5" :key="star" class="star" :class="{ 'filled': star <= day.score }">⭐</span>
          </div>
          <p class="fortune-msg">{{ day.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weekly-horoscope {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 32px 24px;
  margin-bottom: 24px;
}
.card-header h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-main);
}
.section-desc {
  font-size: 0.85rem;
  color: var(--text-sub);
  margin-bottom: 24px;
}
.weekly-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.weekly-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--bg-main);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  transition: all 0.2s;
}
.weekly-item.is-today {
  border-color: var(--primary);
  background: var(--primary-light);
  box-shadow: 0 4px 12px rgba(123, 94, 77, 0.1);
}
.day-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;
  justify-content: center;
}
.day-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-main);
}
.day-date {
  font-size: 0.75rem;
  color: var(--text-sub);
}
.today-tag {
  margin-top: 4px;
  font-size: 0.65rem;
  font-weight: 700;
  background: var(--primary);
  color: var(--white);
  padding: 2px 6px;
  border-radius: 4px;
}
.fortune-content {
  flex: 1;
}
.score-stars {
  display: flex;
  gap: 2px;
  margin-bottom: 6px;
}
.star {
  font-size: 0.8rem;
  filter: grayscale(1);
  opacity: 0.3;
}
.star.filled {
  filter: grayscale(0);
  opacity: 1;
}
.fortune-msg {
  font-size: 0.9rem;
  color: var(--text-main);
  line-height: 1.5;
  word-break: keep-all;
}
</style>
