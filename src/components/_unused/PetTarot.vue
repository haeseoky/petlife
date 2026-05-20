<script setup>
import { ref, computed } from 'vue'
import { t, currentLang } from '../i18n.js'

const props = defineProps({
  result: { type: Object, required: true }
})
const emit = defineEmits(['select'])

const TAROT_CARDS = [
  { id: 0, emoji: '🌟', name: '별의 인도', nameEn: 'Guiding Star',
    messages: {
      '木': '새로운 성장의 기운이 가득! 산책로에 새 길을 시도해보세요.',
      '火': '열정적인 에너지가 넘쳐흐를 거예요. 놀이 시간이 특히 즐거울 거예요!',
      '土': '안정적인 하루가 될 거예요. 집에서 편안한 휴식이 좋아요.',
      '金': '날카로운 직감이 빛나는 날! 새로운 트릭을 배우기 좋아요.',
      '水': '깊은 지혜가 솟아나는 날이에요. 조용한 시간이 보배로워요.'
    }
  },
  { id: 1, emoji: '🌙', name: '달의 속삭임', nameEn: 'Moon\'s Whisper',
    messages: {
      '木': '꿈에서 새로운 모험이 기다리고 있어요. 밤산책이 특히 좋아요.',
      '火': '달빛 아래서 특별한 에너지를 느낄 거예요. 야외 놀이가 좋아요!',
      '土': '포근한 밤이 될 거예요. 보금자리를 더욱 아늑하게 꾸며주세요.',
      '金': '달의 은은한 빛이 반려동물의 감각을 예민하게 해줘요.',
      '水': '달빛이 마음을 차분하게 해줘요. 명상 같은 평화로운 시간이 좋아요.'
    }
  },
  { id: 2, emoji: '☀️', name: '태양의 축복', nameEn: 'Sun\'s Blessing',
    messages: {
      '木': '햇살 아래서 무럭무럭 자라날 기운! 야외 활동이 최고예요.',
      '火': '태양의 힘을 듬뿍 받는 날! 가장 활기찬 하루가 될 거예요.',
      '土': '따뜻한 햇살이 안정감을 더해줘요. 베란다 일광욕이 완벽해요.',
      '金': '눈부신 하루! 반려동물의 매력이 가장 빛나는 날이에요.',
      '水': '햇살이 마음을 따뜻하게 데워줘요. 창가에서 여유로운 시간을 보내세요.'
    }
  },
  { id: 3, emoji: '🌈', name: '무지개 다리', nameEn: 'Rainbow Bridge',
    messages: {
      '木': '다채로운 모험이 기다리고 있어요! 새로운 장소를 탐험해보세요.',
      '火': '행운의 무지개가 뜨는 날! 친구들과 즐거운 시간을 보낼 거예요.',
      '土': '안전하고 따뜻한 연결이 있어요. 가족과의 시간이 소중해요.',
      '金': '아름다운 인연이 다가오고 있어요. 다른 반려동물과 친구가 될 수 있어요!',
      '水': '감성이 풍부해지는 날이에요. 주인과 눈맞춤이 더 깊어질 거예요.'
    }
  },
  { id: 4, emoji: '🔥', name: '불꽃의 용기', nameEn: 'Flame of Courage',
    messages: {
      '木': '용기 있게 새로운 도전! 장난감 하나가 새로운 세계를 열어줄 거예요.',
      '火': '불꽃 같은 에너지가 폭발! 오늘은 뭐든 할 수 있는 기분일 거예요.',
      '土': '차분한 용기가 필요해요. 조금씩 새로운 환경에 적응해갈 거예요.',
      '金': '결단력이 빛나는 날! 고민했던 것을 시도하기 좋아요.',
      '水': '내면의 힘이 솟아나요. 어려움도 지혜롭게 넘길 거예요.'
    }
  },
  { id: 5, emoji: '💧', name: '물의 지혜', nameEn: 'Wisdom of Water',
    messages: {
      '木': '흐르는 물처럼 유연하게! 산책 중 예상치 못한 길도 즐거울 거예요.',
      '火': '열정을 차분하게 다스리면 더 큰 기쁨이 찾아와요.',
      '土': '꾸준함이 열매를 맺는 날! 하루 루틴을 지키면 좋은 일이 생겨요.',
      '金': '물처럼 맑은 마음으로 주인의 마음을 읽어낼 거예요.',
      '水': '직감이 가장 뛰어난 날! 반려동물이 주인에게 특별한 메시지를 전해요.'
    }
  },
  { id: 6, emoji: '🌿', name: '숲의 치유', nameEn: 'Forest Healing',
    messages: {
      '木': '자연의 힘을 듬뿍! 풀밭에서 뒹굴면 최고의 힐링이 될 거예요.',
      '火': '풀냄새가 에너지를 충전시켜 줘요. 야외 놀이가 특히 좋아요!',
      '土': '뿌리를 내릴 곳이 필요해요. 안락한 공간을 만들어주세요.',
      '金': '자연 속에서 감각이 또각 또각 깨어나요. 새로운 냄새를 맡게 해주세요.',
      '水': '숲의 고요함이 마음을 치유해줘요. 조용한 공원 산책이 완벽해요.'
    }
  },
  { id: 7, emoji: '⚡', name: '번개의 깨달음', nameEn: 'Lightning Insight',
    messages: {
      '木': '번개같이 빠른 성장의 순간! 훈련하기 가장 좋은 날이에요.',
      '火': '번뜩이는 영감이 찾아와요! 새로운 장난감에 흥미를 느낄 거예요.',
      '土': '갑작스러운 깨달음이 평안함을 가져와요. 새로운 좋아하는 자리를 찾을 거예요.',
      '金': '순간적인 판단력이 뛰어나요. 위험을 피하는 본능이 빛나는 날!',
      '水': '번개처럼 빠른 이해력! 주인의 말을 눈보다 먼저 알아챌 거예요.'
    }
  },
  { id: 8, emoji: '💎', name: '보석의 인연', nameEn: 'Gem Connection',
    messages: {
      '木': '소중한 인연이 자라나는 날! 새로운 사람이나 동물 친구를 만날 수 있어요.',
      '火': '빛나는 매력이 사람들을 끌어들여요! 오늘은 스타가 될 거예요.',
      '土': '깊고 변치 않는 사랑이 있어요. 주인과의 유대가 더욱 단단해져요.',
      '金': '반짝이는 매력이 최고조! 그루밍 후 사진을 찍으면 완벽해요.',
      '水': '영혼의 인연을 느끼는 날. 주인과 더 깊이 연결될 거예요.'
    }
  },
  { id: 9, emoji: '🦋', name: '나비의 변화', nameEn: 'Butterfly Change',
    messages: {
      '木': '아름다운 변화의 시작! 새로운 루틴이 좋은 결과를 가져올 거예요.',
      '火': '활기찬 변화가 찾아와요! 식단에 작은 변화를 주면 좋아할 거예요.',
      '土': '점진적이고 안전한 변화가 좋아요. 천천히 새로운 것을 시도해보세요.',
      '金': '날카로운 변화의 순간! 그루밍 스타일을 바꿔보면 어떨까요?',
      'Water': '부드러운 변화가 마음을 열어줘요. 새로운 장난감이 마법을 부릴 거예요.'
    }
  }
]

// Fix the last Water key
TAROT_CARDS[9].messages['水'] = '부드러운 변화가 마음을 열어줘요. 새로운 장난감이 마법을 부릴 거예요.'

const selectedCard = ref(null)
const revealed = ref(false)

const shuffledCards = computed(() => {
  const seed = new Date().toDateString() + props.result.name
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash |= 0
  }
  const cards = [...TAROT_CARDS]
  for (let i = cards.length - 1; i > 0; i--) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff
    const j = hash % (i + 1);
    [cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return cards.slice(0, 5)
})

function selectCard(card) {
  if (revealed.value) return
  selectedCard.value = card
  revealed.value = true
  const element = props.result.mainElement
  const message = card.messages[element] || card.messages['土']
  emit('select', { cardName: currentLang.value === 'en' ? card.nameEn : card.name, cardEmoji: card.emoji, message })
}

function redraw() {
  // Force re-shuffle by appending a counter
  selectedCard.value = null
  revealed.value = false
  emit('select', null)
}

const redrawCount = ref(0)

const displayCards = computed(() => {
  // Re-compute when redrawCount changes
  const _ = redrawCount.value
  return shuffledCards.value
})

function doRedraw() {
  redrawCount.value++
  selectedCard.value = null
  revealed.value = false
  emit('select', null)
}
</script>

<template>
  <div class="tarot-section">
    <h3>{{ t('tarotTitle') }}</h3>
    <p v-if="!revealed" class="tarot-instruction">{{ t('tarotInstruction') }}</p>

    <div class="tarot-cards" v-if="!revealed">
      <div
        v-for="(card, i) in displayCards"
        :key="card.id + '-' + i"
        class="tarot-card"
        @click="selectCard(card)"
      >
        <div class="card-inner">
          <div class="card-back">
            <span class="card-pattern">🐾</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="revealed && selectedCard" class="tarot-result fade-in">
      <div class="tarot-revealed-card">
        <span class="tarot-revealed-emoji">{{ selectedCard.emoji }}</span>
        <span class="tarot-revealed-name">{{ currentLang === 'en' ? selectedCard.nameEn : selectedCard.name }}</span>
      </div>
      <p class="tarot-message">{{ selectedCard.messages[result.mainElement] || selectedCard.messages['土'] }}</p>
      <button class="tarot-redraw-btn" @click="doRedraw">{{ t('tarotRedraw') }}</button>
    </div>
  </div>
</template>

<style scoped>
.tarot-section {
  background: var(--card-bg);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 24px;
  margin-top: 16px;
}

.tarot-section h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-main);
}

.tarot-instruction {
  font-size: 0.9rem;
  color: var(--text-sub);
  margin-bottom: 20px;
}

.tarot-cards {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.tarot-card {
  width: 60px;
  height: 88px;
  perspective: 600px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.tarot-card:hover {
  transform: translateY(-6px);
}

.card-inner {
  width: 100%;
  height: 100%;
  transition: transform 0.6s ease;
  transform-style: preserve-3d;
}

.card-back {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--primary);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.card-pattern {
  font-size: 1.8rem;
  opacity: 0.6;
}

.tarot-result {
  text-align: center;
}

.tarot-revealed-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, var(--primary-light), var(--card-bg));
  border: 2px solid var(--primary);
  border-radius: 12px;
  padding: 20px 28px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.tarot-revealed-emoji {
  font-size: 3rem;
  display: block;
  margin-bottom: 8px;
}

.tarot-revealed-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary);
}

.tarot-message {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-main);
  margin-bottom: 16px;
  padding: 0 8px;
}

.tarot-redraw-btn {
  background: var(--primary-light);
  color: var(--primary);
  border: 1px solid var(--border-light);
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tarot-redraw-btn:hover {
  background: var(--primary);
  color: white;
}

.fade-in {
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 400px) {
  .tarot-card {
    width: 52px;
    height: 76px;
  }
  .card-pattern {
    font-size: 1.5rem;
  }
}
</style>
