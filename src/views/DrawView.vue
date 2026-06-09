<template>
  <div class="game-page">
    <nav class="game-nav">
      <button class="btn-back" @click="$router.push('/')">← 홈</button>
      <span class="game-title">✏️ 모양 따라그리기</span>
      <span></span>
    </nav>
    <DrawGame @score="onScore" @share="onShare" />
    <Leaderboard v-if="showLeaderboard" game-id="draw" />
    <ShareModal :visible="showShare" game-name="모양 따라그리기" :score="lastScore" @close="showShare = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DrawGame from '../components/DrawGame.vue'
import ShareModal from '../components/ShareModal.vue'
import Leaderboard from '../components/Leaderboard.vue'

const showShare = ref(false)
const showLeaderboard = ref(false)
const lastScore = ref(0)

function onScore(result) {
  lastScore.value = result.score
  showLeaderboard.value = true
}
function onShare() {
  showShare.value = true
}
</script>

<style scoped>
.game-page { height: 100dvh; display: flex; flex-direction: column; overflow-y: auto; }
.game-nav { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; background: #fff; border-bottom: 1px solid #eee; flex-shrink: 0; }
.btn-back { background: none; border: none; font-size: 14px; color: #4D9BC6; cursor: pointer; font-weight: 600; padding: 6px 12px; }
.game-title { font-size: 15px; font-weight: 700; color: #1B355A; }
</style>
