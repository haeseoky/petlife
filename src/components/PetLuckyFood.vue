<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  petType: { type: String, required: true }, // 'dog' | 'cat'
  mainElement: { type: String, required: true }, // '木', '火', '土', '金', '水'
  missing: { type: Array, default: () => [] }
})

const RECIPE_DATA = {
  dog: {
    '木': [
      {
        name: '시금치 닭가슴살 칩',
        emoji: '🥬',
        ingredients: ['닭가슴살 100g', '시금치 한 줌', '쌀가루 1큰술'],
        instructions: [
          '시금치를 살짝 데쳐서 잘게 다집니다.',
          '닭가슴살과 시금치, 쌀가루를 섞어 반죽합니다.',
          '건조기나 오븐(160도)에서 15~20분간 바삭하게 굽습니다.'
        ],
        elementDesc: '목(木)의 푸른 기운을 담은 시금치는 간 건강을 돕고 활동량을 높여줍니다.'
      },
      {
        name: '브로콜리 연어 큐브',
        emoji: '🥦',
        ingredients: ['연어 80g', '브로콜리 20g', '한천가루 약간'],
        instructions: [
          '연어와 브로콜리를 스팀으로 익힙니다.',
          '잘게 다진 재료를 한천가루 푼 물에 섞습니다.',
          '틀에 부어 굳힌 뒤 한입 크기로 자릅니다.'
        ],
        elementDesc: '신선한 채소의 기운이 성장을 돕고 피로 회복을 지원합니다.'
      }
    ],
    '火': [
      {
        name: '토마토 소고기 육포',
        emoji: '🍅',
        ingredients: ['소고기 홍두깨살 100g', '방울토마토 3-4알'],
        instructions: [
          '소고기를 얇게 저며 핏물을 제거합니다.',
          '토마토를 다져 소고기 표면에 살짝 바릅니다.',
          '건조기에서 70도로 10시간 이상 건조합니다.'
        ],
        elementDesc: '화(火)의 붉은 에너지는 심장 건강을 돕고 혈액 순환을 활발하게 합니다.'
      },
      {
        name: '파프리카 오리 스테이크',
        emoji: '🫑',
        ingredients: ['오리가슴살 100g', '빨간 파프리카 1/4개'],
        instructions: [
          '오리고기를 다지고 파프리카를 잘게 썹니다.',
          '두 재료를 섞어 패티 모양으로 만듭니다.',
          '프라이팬에 기름 없이 노릇하게 굽습니다.'
        ],
        elementDesc: '따뜻한 성질의 오리와 파프리카가 활력을 불어넣어 줍니다.'
      }
    ],
    '土': [
      {
        name: '단호박 고구마 매쉬',
        emoji: '🎃',
        ingredients: ['단호박 50g', '고구마 50g', '무염 치즈 약간'],
        instructions: [
          '단호박과 고구마를 푹 삶아 껍질을 벗깁니다.',
          '부드럽게 으깬 뒤 무염 치즈를 올립니다.',
          '동그란 경단 모양으로 빚어 급여합니다.'
        ],
        elementDesc: '토(土)의 노란 기운은 위장 건강을 지켜주고 안정감을 줍니다.'
      },
      {
        name: '노른자 황태 쿠키',
        emoji: '🍪',
        ingredients: ['황태채(염분제거) 30g', '달걀노른자 1개', '쌀가루 2큰술'],
        instructions: [
          '염분을 제거한 황태를 잘게 다집니다.',
          '노른자와 쌀가루를 섞어 반죽을 만듭니다.',
          '오븐 170도에서 12분간 구워줍니다.'
        ],
        elementDesc: '단단한 대지의 기운처럼 뼈와 근육을 튼튼하게 해줍니다.'
      }
    ],
    '金': [
      {
        name: '배 돼지고기 찜',
        emoji: '🍐',
        ingredients: ['돼지고기 안심 80g', '배 1/4개', '무 약간'],
        instructions: [
          '돼지고기와 배, 무를 작게 깍둑썰기 합니다.',
          '찜기에 넣고 고기가 완전히 익을 때까지 찝니다.',
          '식힌 후 국물과 함께 급여합니다.'
        ],
        elementDesc: '금(金)의 하얀 기운은 폐와 호흡기를 튼튼하게 하고 피부를 맑게 합니다.'
      },
      {
        name: '무 북어국',
        emoji: '🥣',
        ingredients: ['북어(염분제거) 한 줌', '무 20g', '달걀 1/2개'],
        instructions: [
          '무를 얇게 썰고 북어는 물에 불려 가시를 제거합니다.',
          '냄비에 물과 재료를 넣고 푹 끓입니다.',
          '마지막에 달걀을 풀어 가볍게 익힙니다.'
        ],
        elementDesc: '맑고 깨끗한 기운이 몸안의 독소를 배출하는 데 도움을 줍니다.'
      }
    ],
    '水': [
      {
        name: '검은콩 두부 스틱',
        emoji: '🫘',
        ingredients: ['두부 1/2모', '검은콩가루 1큰술'],
        instructions: [
          '두부를 끓는 물에 데쳐 염분을 제거합니다.',
          '길쭉하게 썰어 검은콩가루를 골고루 묻힙니다.',
          '에어프라이어 160도에서 10분간 돌립니다.'
        ],
        elementDesc: '수(水)의 검은 기운은 신장 건강을 돕고 모질을 윤기 있게 합니다.'
      },
      {
        name: '블루베리 요거트 팝',
        emoji: '🫐',
        ingredients: ['블루베리 5-6알', '플레인 요거트(무설탕) 50g'],
        instructions: [
          '요거트에 블루베리를 섞습니다.',
          '얼음틀에 조금씩 나누어 담습니다.',
          '냉동실에서 3시간 이상 얼려 시원하게 줍니다.'
        ],
        elementDesc: '깊은 물의 기운처럼 차분함을 주고 눈 건강을 지원합니다.'
      }
    ]
  },
  cat: {
    '木': [
      {
        name: '캣닢 치킨 무스',
        emoji: '🌿',
        ingredients: ['닭안심 50g', '건조 캣닢 약간', '물 1큰술'],
        instructions: [
          '닭안심을 삶아서 곱게 다지거나 믹서에 갑니다.',
          '삶은 물과 캣닢을 섞어 무스 형태로 만듭니다.',
          '접시에 평평하게 담아 급여합니다.'
        ],
        elementDesc: '목(木)의 생명력 넘치는 기운이 스트레스를 해소하고 활력을 줍니다.'
      },
      {
        name: '시금치 연어 트릿',
        emoji: '🐟',
        ingredients: ['연어 50g', '시금치 약간', '쌀가루 1작은술'],
        instructions: [
          '연어와 시금치를 익혀서 함께 다집니다.',
          '쌀가루를 섞어 작은 완자 모양으로 만듭니다.',
          '오븐 160도에서 8분간 살짝 굽습니다.'
        ],
        elementDesc: '푸른 채소의 기운이 눈을 맑게 하고 면역력을 높여줍니다.'
      }
    ],
    '火': [
      {
        name: '참치 타타르',
        emoji: '🥩',
        ingredients: ['참치(생물 또는 물기 뺀 캔) 50g', '당근 10g'],
        instructions: [
          '참치를 아주 잘게 다집니다.',
          '당근을 강판에 갈아 참치와 섞습니다.',
          '하트 모양으로 빚어 특별하게 급여합니다.'
        ],
        elementDesc: '화(火)의 뜨거운 열정이 식욕을 돋우고 기운을 북돋워 줍니다.'
      },
      {
        name: '당근 소고기 볼',
        emoji: '🥕',
        ingredients: ['소고기 다짐육 50g', '당근 10g'],
        instructions: [
          '소고기와 다진 당근을 섞습니다.',
          '아주 작은 크기로 경단을 빚습니다.',
          '팬에 굴려가며 육즙이 빠지지 않게 익힙니다.'
        ],
        elementDesc: '붉은색 재료들이 심장의 기운을 보강하고 혈행을 돕습니다.'
      }
    ],
    '土': [
      {
        name: '단호박 닭안심 퓨레',
        emoji: '🥣',
        ingredients: ['단호박 30g', '닭안심 30g', '물 약간'],
        instructions: [
          '단호박과 닭안심을 푹 삶습니다.',
          '물을 조금씩 추가하며 아주 부드럽게 갑니다.',
          '따뜻할 때 급여하여 소화를 돕습니다.'
        ],
        elementDesc: '토(土)의 포근한 기운이 소화기를 편안하게 하고 영양 흡수를 돕습니다.'
      },
      {
        name: '고구마 치즈 볼',
        emoji: '🍠',
        ingredients: ['고구마 30g', '코티지 치즈(반려동물용) 10g'],
        instructions: [
          '고구마를 쪄서 껍질을 제거하고 으깹니다.',
          '코티지 치즈를 넣고 잘 버무립니다.',
          '고양이가 먹기 편한 크기로 둥글게 만듭니다.'
        ],
        elementDesc: '대지의 달콤한 기운이 기분을 좋게 하고 기력을 보충합니다.'
      }
    ],
    '金': [
      {
        name: '산양유 생선 스프',
        emoji: '🥛',
        ingredients: ['흰살생선 40g', '산양유 20ml'],
        instructions: [
          '가시를 제거한 생선을 삶아 결대로 찢습니다.',
          '산양유를 미지근하게 데웁니다.',
          '그릇에 생선을 담고 산양유를 부어줍니다.'
        ],
        elementDesc: '금(金)의 정갈한 기운이 털 결을 부드럽게 하고 기관지를 보호합니다.'
      },
      {
        name: '배 대구 찜',
        emoji: '🐟',
        ingredients: ['대구살 50g', '배 간 것 1작은술'],
        instructions: [
          '대구살을 찜기에 넣어 익힙니다.',
          '익은 생선 위에 배 간 것을 올립니다.',
          '촉촉한 상태로 급여합니다.'
        ],
        elementDesc: '하얀색 식재료들이 건조한 계절에 호흡기 건강을 지켜줍니다.'
      }
    ],
    '水': [
      {
        name: '흑임자 참치 큐브',
        emoji: '🖤',
        ingredients: ['참치 50g', '흑임자가루 약간'],
        instructions: [
          '참치를 깍둑썰기하여 익힙니다.',
          '익은 참치 표면에 흑임자가루를 살짝 묻힙니다.',
          '한 김 식힌 후 급여합니다.'
        ],
        elementDesc: '수(水)의 깊은 지혜를 담은 검은 식재료가 신장과 뼈 건강을 돕습니다.'
      },
      {
        name: '미역 연어 스프',
        emoji: '🌊',
        ingredients: ['연어 40g', '미역(염분제거) 약간'],
        instructions: [
          '미역을 충분히 불려 염분을 빼고 잘게 다집니다.',
          '연어와 미역을 물에 넣고 끓입니다.',
          '국물이 자작해지면 식혀서 급여합니다.'
        ],
        elementDesc: '바다의 기운이 몸안의 노폐물을 씻어내고 수분 보충을 돕습니다.'
      }
    ]
  }
}

const selectedRecipes = ref([])

function getRandomRecipes() {
  const typeData = RECIPE_DATA[props.petType] || RECIPE_DATA.dog
  const elements = [props.mainElement, ...props.missing]
  // 중복 제거
  const uniqueElements = [...new Set(elements)]
  
  let pool = []
  uniqueElements.forEach(el => {
    if (typeData[el]) {
      pool = pool.concat(typeData[el])
    }
  })

  // 만약 후보가 부족하면 전체에서 추가
  if (pool.length < 3) {
    Object.keys(typeData).forEach(el => {
      if (!uniqueElements.includes(el)) {
        pool = pool.concat(typeData[el])
      }
    })
  }

  // 랜덤하게 2~3개 선택
  const shuffled = [...pool].sort(() => 0.5 - Math.random())
  selectedRecipes.value = shuffled.slice(0, 3)
}

onMounted(() => {
  getRandomRecipes()
})
</script>

<template>
  <div class="lucky-food-card">
    <div class="food-header">
      <div class="title-wrap">
        <h3>반려동물 럭키 푸드 레시피</h3>
        <p class="subtitle">우리 아이 오행에 꼭 맞는 수제 간식</p>
      </div>
      <button class="refresh-btn" @click="getRandomRecipes">
        <span class="refresh-icon">🔄</span> 새로운 추천
      </button>
    </div>

    <div class="recipe-list">
      <div v-for="(recipe, index) in selectedRecipes" :key="index" class="recipe-item">
        <div class="recipe-main-info">
          <div class="recipe-emoji">{{ recipe.emoji }}</div>
          <div class="recipe-text-info">
            <h4 class="recipe-name">{{ recipe.name }}</h4>
            <div class="recipe-ingredients">
              <span class="label">재료:</span> {{ recipe.ingredients.join(', ') }}
            </div>
          </div>
        </div>

        <div class="recipe-detail">
          <div class="instruction-box">
            <p v-for="(step, sIndex) in recipe.instructions" :key="sIndex">
              {{ sIndex + 1 }}. {{ step }}
            </p>
          </div>
          <div class="element-tag-box">
            <span class="element-explanation">✨ {{ recipe.elementDesc }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="food-footer">
      <p class="disclaimer">* 모든 간식은 아이의 알레르기 유무를 먼저 확인 후 급여해 주세요.</p>
    </div>
  </div>
</template>

<style scoped>
.lucky-food-card {
  background: var(--card-bg);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 32px 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(123, 94, 77, 0.05);
}

.food-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.food-header h3 {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 4px;
}

.subtitle {
  font-size: 0.85rem;
  color: var(--text-sub);
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-main);
  border: 1px solid var(--border-light);
  color: var(--text-sub);
  font-size: 0.8rem;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
}

.refresh-btn:hover {
  background: var(--primary-light);
  color: var(--primary);
  border-color: var(--primary);
}

.recipe-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.recipe-item {
  background: var(--bg-main);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--border-light);
  transition: transform 0.2s ease;
}

.recipe-item:hover {
  transform: translateY(-2px);
}

.recipe-main-info {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px dashed var(--border-light);
}

.recipe-emoji {
  font-size: 2.2rem;
  background: var(--white);
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.recipe-text-info {
  flex: 1;
}

.recipe-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 6px;
}

.recipe-ingredients {
  font-size: 0.85rem;
  color: var(--text-sub);
  line-height: 1.4;
}

.recipe-ingredients .label {
  font-weight: 700;
  color: var(--primary);
}

.recipe-detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.instruction-box {
  font-size: 0.9rem;
  color: var(--text-main);
  line-height: 1.6;
}

.instruction-box p {
  margin-bottom: 4px;
}

.element-tag-box {
  background: var(--primary-light);
  padding: 10px 14px;
  border-radius: 8px;
}

.element-explanation {
  font-size: 0.85rem;
  color: var(--primary);
  font-weight: 500;
  line-height: 1.5;
  display: block;
}

.food-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

.disclaimer {
  font-size: 0.75rem;
  color: var(--text-sub);
  opacity: 0.7;
  text-align: center;
}

/* Dark Mode */
html.dark .recipe-item {
  background: rgba(255, 255, 255, 0.03);
}

html.dark .recipe-emoji {
  background: rgba(255, 255, 255, 0.05);
}

html.dark .element-tag-box {
  background: rgba(196, 168, 130, 0.1);
}

@media (max-width: 600px) {
  .food-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .refresh-btn {
    align-self: flex-start;
  }
  
  .recipe-main-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .recipe-emoji {
    width: 50px;
    height: 50px;
    font-size: 1.8rem;
  }
}
</style>
