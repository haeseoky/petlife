<script setup>
defineProps({
  history: { type: Array, required: true }
})
const emit = defineEmits(['view', 'delete'])

function formatDate(iso) {
  const d = new Date(iso)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>

<template>
  <section class="history">
    <h3 class="history-title">저장된 사주 기록</h3>
    <p class="history-desc">최대 20개까지 자동 저장됩니다</p>
    <div class="history-list">
      <div class="history-item" v-for="item in history" :key="item.id">
        <div class="item-info" @click="emit('view', item)">
          <span class="item-name">{{ item.name }}</span>
          <span class="item-meta">{{ item.breed }} · {{ item.yearPillar }} {{ item.monthPillar }} {{ item.dayPillar }} {{ item.hourPillar }}</span>
          <span class="item-date">{{ formatDate(item.savedAt) }}</span>
        </div>
        <button class="item-delete" @click.stop="emit('delete', item.id)">✕</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.history {
  padding-top: 16px;
}
.history-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 4px;
}
.history-desc {
  font-size: 0.8rem;
  color: var(--text-sub);
  margin-bottom: 20px;
}
.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  padding: 16px;
  transition: border-color 0.2s;
}
.history-item:hover {
  border-color: var(--primary);
}
.item-info {
  flex: 1;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.item-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-main);
}
.item-meta {
  font-size: 0.8rem;
  color: var(--text-sub);
}
.item-date {
  font-size: 0.75rem;
  color: var(--text-sub);
  opacity: 0.5;
}
.item-delete {
  background: none;
  border: none;
  color: var(--placeholder);
  font-size: 0.9rem;
  padding: 4px 8px;
  cursor: pointer;
}
.item-delete:hover {
  color: #ef4444;
}
</style>
