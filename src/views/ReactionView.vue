<template>
  <div class="game-page">
    <nav class="game-nav">
      <button class="btn-back" @click="$router.push('/')">← 홈</button>
      <span class="game-title">⚡ 반응속도 테스트</span>
      <span></span>
    </nav>
    <ReactionGame @score="onScore" @share="onShare" />
    <ShareModal :visible="showShare" game-name="반응속도" :score="lastScore" @close="showShare = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ReactionGame from '../components/ReactionGame.vue'
import ShareModal from '../components/ShareModal.vue'

const showShare = ref(false)
const lastScore = ref(0)

function onScore(result) {
  lastScore.value = result.score
}
function onShare() {
  showShare.value = true
}
</script>

<style scoped>
.game-page { height: 100dvh; display: flex; flex-direction: column; }
.game-nav { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: #fff; border-bottom: 1px solid #eee; flex-shrink: 0; }
.btn-back { background: none; border: none; font-size: 14px; color: #4D9BC6; cursor: pointer; font-weight: 600; padding: 6px 12px; }
.game-title { font-size: 15px; font-weight: 700; color: #1B355A; }
</style>
