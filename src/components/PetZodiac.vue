<script setup>
import { computed } from 'vue'

const props = defineProps({
  month: { type: Number, required: true },
  day: { type: Number, required: true },
  petType: { type: String, required: true }, // 'dog' | 'cat'
  mainElement: { type: String, required: true } // '木', '火', '土', '金', '水'
})

const ZODIAC_DATA = [
  {
    name: '양자리',
    symbol: '♈',
    date: '3.21 - 4.19',
    dog: '매우 활동적이고 에너지가 넘쳐요. 새로운 장소를 탐험하는 것을 좋아하며 무리의 우두머리가 되려는 경향이 있습니다.',
    cat: '호기심이 많고 용감해요. 높은 곳에 올라가 집안 전체를 관찰하는 것을 즐기며 자기 주관이 매우 뚜렷합니다.',
    activity: '장거리 산책이나 새로운 장난감 탐색',
    luckyDay: '화요일',
    compatTip: '에너지를 발산할 수 있는 활동을 함께하면 유대감이 깊어집니다.'
  },
  {
    name: '황소자리',
    symbol: '♉',
    date: '4.20 - 5.20',
    dog: '온순하고 참을성이 많지만 한번 고집을 피우면 꺾기 어려워요. 맛있는 간식과 편안한 잠자리를 가장 중요하게 생각합니다.',
    cat: '느긋하고 평화로운 성격이에요. 부드러운 쿠션이나 담요 위에서 낮잠 자는 것을 좋아하며 변화를 싫어하는 편입니다.',
    activity: '안정적인 집안 환경에서의 휴식과 맛있는 특식',
    luckyDay: '금요일',
    compatTip: '아이의 루틴을 존중해주고 서두르지 않는 여유로운 태도가 필요합니다.'
  },
  {
    name: '쌍둥이자리',
    symbol: '♊',
    date: '5.21 - 6.21',
    dog: '눈치가 빠르고 영리해요. 주인의 말을 금방 이해하며, 지루한 것을 참지 못해 항상 새로운 자극을 원합니다.',
    cat: '다양한 울음소리로 의사표현을 잘해요. 호기심이 끝이 없어 집안 구석구석을 탐험하며 장난치는 것을 좋아합니다.',
    activity: '노즈워크나 새로운 명령어를 배우는 지능 놀이',
    luckyDay: '수요일',
    compatTip: '자주 말을 걸어주고 다양한 소통 방식을 시도해보세요.'
  },
  {
    name: '게자리',
    symbol: '♋',
    date: '6.22 - 7.22',
    dog: '가족에 대한 애정이 매우 깊고 섬세해요. 주인의 기분을 예민하게 알아차리며 항상 곁에 머무르고 싶어 하는 다정한 성격입니다.',
    cat: '영역에 대한 애착이 강하고 조심스러워요. 낯선 사람에게는 경계심이 있지만 가족에게는 한없이 어리광을 부리는 내향형 고양이에요.',
    activity: '조용한 분위기에서의 스킨십과 교감 시간',
    luckyDay: '월요일',
    compatTip: '정서적 안정감을 느낄 수 있도록 부드러운 목소리로 칭찬해주세요.'
  },
  {
    name: '사자자리',
    symbol: '♌',
    date: '7.23 - 8.22',
    dog: '당당하고 위풍당당한 매력이 있어요. 주인의 관심을 받는 것을 즐기며 칭찬을 들으면 더욱 열심히 행동하는 스타 기질이 있습니다.',
    cat: '자신감이 넘치고 화려한 자태를 뽐내요. 집안의 주인공이 되고 싶어 하며 주인의 무조건적인 사랑을 당연하게 여기기도 합니다.',
    activity: '멋진 옷을 입고 산책하거나 사람들 많은 곳에서의 외출',
    luckyDay: '일요일',
    compatTip: '아낌없는 칭찬과 관심으로 아이의 자존감을 높여주세요.'
  },
  {
    name: '처녀자리',
    symbol: '♍',
    date: '8.23 - 9.23',
    dog: '깔끔하고 규칙적인 생활을 좋아해요. 학습 능력이 뛰어나며 자기 주변이 지저분한 것을 싫어하는 완벽주의 성격이 있습니다.',
    cat: '청결에 매우 민감하고 섬세해요. 화장실 상태나 사료 그릇의 청결도를 꼼꼼히 따지며 자신만의 정해진 루틴을 철저히 지킵니다.',
    activity: '규칙적인 산책 시간 엄수와 꼼꼼한 빗질 시간',
    luckyDay: '수요일',
    compatTip: '청결한 환경을 유지해주고 안정적인 일과를 선물해주세요.'
  },
  {
    name: '천칭자리',
    symbol: '♎',
    date: '9.24 - 10.22',
    dog: '누구와도 잘 어울리는 평화주의자예요. 사회성이 좋아 다른 친구들과 노는 것을 즐기며 싸움을 피하려는 성향이 강합니다.',
    cat: '우아하고 세련된 매력이 있어요. 다묘 가정에서도 갈등을 조율하는 역할을 하며, 혼자 있는 것보다 조화로운 상태를 선호합니다.',
    activity: '다른 반려동물 친구들과의 만남이나 부드러운 음악 감상',
    luckyDay: '금요일',
    compatTip: '갈등 상황을 피하고 평온하고 아름다운 환경을 만들어주세요.'
  },
  {
    name: '전갈자리',
    symbol: '♏',
    date: '10.23 - 11.22',
    dog: '충성심이 매우 강력하고 일편단심이에요. 주인에 대한 소유욕이 강하며 한 번 믿음을 주면 끝까지 지키는 듬직한 동반자입니다.',
    cat: '신비롭고 집중력이 뛰어난 사냥꾼이에요. 감정 표현이 뚜렷하진 않지만 주인과의 깊은 영적 교감을 중요하게 생각합니다.',
    activity: '집중력이 필요한 사냥 놀이나 깊은 밤의 조용한 교감',
    luckyDay: '화요일',
    compatTip: '거짓 없는 진실한 태도로 아이와 깊은 신뢰를 쌓아주세요.'
  },
  {
    name: '궁수자리',
    symbol: '♐',
    date: '11.23 - 12.21',
    dog: '자유로운 영혼의 소유자예요. 묶여 있는 것을 싫어하며 새로운 냄새와 넓은 들판을 뛰어다니는 모험을 가장 즐거워합니다.',
    cat: '낙천적이고 호기심이 왕성해요. 집안의 안 보이는 곳까지 탐험하고 싶어 하며 구속받지 않는 자유로운 활동을 선호합니다.',
    activity: '새로운 산책로 탐방이나 넓은 공간에서의 자유로운 놀이',
    luckyDay: '목요일',
    compatTip: '아이의 모험심을 존중해주고 다양한 세상을 보여주세요.'
  },
  {
    name: '염소자리',
    symbol: '♑',
    date: '12.22 - 1.19',
    dog: '진중하고 책임감이 강해요. 어린 나이에도 어른스러운 면모를 보이며, 인내심이 강해 어려운 훈련도 끈기 있게 해내곤 합니다.',
    cat: '침착하고 독립적인 성격이에요. 장난을 치기보다는 높은 곳에서 세상을 관찰하며 사색에 잠기는 진지한 면모가 있습니다.',
    activity: '체계적인 훈련 습득이나 인내심이 필요한 노즈워크',
    luckyDay: '토요일',
    compatTip: '아이의 노력을 알아봐 주고 성취감을 느낄 수 있는 과제를 주세요.'
  },
  {
    name: '물병자리',
    symbol: '♒',
    date: '1.20 - 2.18',
    dog: '독특하고 개성이 넘치는 아이예요. 평범한 놀이보다는 엉뚱한 행동으로 웃음을 주며, 다른 강아지들과는 조금 다른 자신만의 세계가 있습니다.',
    cat: '예측 불가능한 매력이 있어요. 가끔은 혼자만의 시간을 즐기다가도 갑자기 엉뚱한 행동을 하는 창의적인 고양이에요.',
    activity: '창의적인 새 장난감이나 예측 불가능한 놀이 방식',
    luckyDay: '토요일',
    compatTip: '아이의 독특한 개성을 편견 없이 받아들여 주세요.'
  },
  {
    name: '물고기자리',
    symbol: '♓',
    date: '2.19 - 3.20',
    dog: '꿈이 많고 감수성이 풍부해요. 주인의 감정에 매우 민감하게 반응하며, 가끔은 혼자만의 생각에 잠긴 듯 멍하니 있을 때가 있습니다.',
    cat: '직관력이 뛰어나고 신비로워요. 보이지 않는 대상을 쫓거나 주인의 마음을 위로해주는 듯한 행동을 하는 영적인 아이예요.',
    activity: '부드러운 스킨십과 잔잔한 음악이 있는 명상 시간',
    luckyDay: '목요일',
    compatTip: '섬세한 감정을 다치지 않게 따뜻하고 부드럽게 대해주세요.'
  }
]

const zodiac = computed(() => {
  const m = props.month
  const d = props.day
  
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return ZODIAC_DATA[0]
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return ZODIAC_DATA[1]
  if ((m === 5 && d >= 21) || (m === 6 && d <= 21)) return ZODIAC_DATA[2]
  if ((m === 6 && d >= 22) || (m === 7 && d <= 22)) return ZODIAC_DATA[3]
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return ZODIAC_DATA[4]
  if ((m === 8 && d >= 23) || (m === 9 && d <= 23)) return ZODIAC_DATA[5]
  if ((m === 9 && d >= 24) || (m === 10 && d <= 22)) return ZODIAC_DATA[6]
  if ((m === 10 && d >= 23) || (m === 11 && d <= 22)) return ZODIAC_DATA[7]
  if ((m === 11 && d >= 23) || (m === 12 && d <= 21)) return ZODIAC_DATA[8]
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return ZODIAC_DATA[9]
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return ZODIAC_DATA[10]
  if ((m === 2 && d >= 19) || (m === 3 && d <= 20)) return ZODIAC_DATA[11]
  
  return ZODIAC_DATA[0] // 기본값
})

const personality = computed(() => {
  return props.petType === 'cat' ? zodiac.value.cat : zodiac.value.dog
})
</script>

<template>
  <div class="pet-zodiac-card">
    <div class="zodiac-header">
      <div class="title-wrap">
        <h3>반려동물 서양 별자리</h3>
        <p class="subtitle">별들의 기운으로 본 우리 아이 성향</p>
      </div>
      <div class="zodiac-symbol">{{ zodiac.symbol }}</div>
    </div>

    <div class="zodiac-main">
      <div class="zodiac-info">
        <span class="zodiac-name">{{ zodiac.name }}</span>
        <span class="zodiac-date">{{ zodiac.date }}</span>
      </div>

      <p class="zodiac-desc">{{ personality }}</p>

      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">✨ 추천 활동</span>
          <span class="info-value">{{ zodiac.activity }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">📅 럭키 데이</span>
          <span class="info-value">{{ zodiac.luckyDay }}</span>
        </div>
      </div>

      <div class="compat-section">
        <div class="section-label">🤝 보호자와의 궁합 팁</div>
        <div class="tip-box">
          <p>{{ zodiac.compatTip }}</p>
        </div>
      </div>
    </div>

    <div class="zodiac-footer">
      <p class="disclaimer">* 생월/생일을 기반으로 한 서양 점성술 분석 결과입니다.</p>
    </div>
  </div>
</template>

<style scoped>
.pet-zodiac-card {
  background: var(--card-bg);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 32px 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(123, 94, 77, 0.05);
  position: relative;
  overflow: hidden;
}

.pet-zodiac-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, #6B8E23, #DAA520, #4682B4);
  opacity: 0.7;
}

.zodiac-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.zodiac-header h3 {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 4px;
}

.subtitle {
  font-size: 0.85rem;
  color: var(--text-sub);
}

.zodiac-symbol {
  font-size: 2.8rem;
  line-height: 1;
  background: linear-gradient(135deg, var(--primary), #8B4513);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.zodiac-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.zodiac-info {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-light);
}

.zodiac-name {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-main);
}

.zodiac-date {
  font-size: 0.9rem;
  color: var(--text-sub);
}

.zodiac-desc {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-main);
  word-break: keep-all;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-item {
  background: var(--bg-main);
  padding: 14px;
  border-radius: 12px;
  border: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-sub);
}

.info-value {
  font-size: 0.85rem;
  color: var(--text-main);
  font-weight: 500;
  line-height: 1.4;
}

.compat-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-sub);
}

.tip-box {
  background: var(--primary-light);
  padding: 16px;
  border-radius: 12px;
  border: 1px dashed var(--primary);
}

.tip-box p {
  font-size: 0.9rem;
  color: var(--primary);
  line-height: 1.6;
  margin: 0 !important;
  font-weight: 500;
}

.zodiac-footer {
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
html.dark .info-item {
  background: rgba(255, 255, 255, 0.03);
}

html.dark .tip-box {
  background: rgba(196, 168, 130, 0.1);
}

@media (max-width: 600px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
