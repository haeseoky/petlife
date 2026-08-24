<script setup>
import { computed } from 'vue'
import { t } from '../i18n.js'

const props = defineProps({
  petType: { type: String, default: 'dog' },
  ilju: { type: String, required: true }, // e.g., '갑자'
  mainElement: { type: String, required: true }, // e.g., '木'
  missing: { type: Array, default: () => [] },
  hourPillar: { type: String, default: '' }
})

// MBTI 매핑 로직
const mbtiCode = computed(() => {
  // 1. E/I: 일주의 음양 (갑병무경임=양→E, 을정기신계=음→I)
  const yang = ['갑', '병', '무', '경', '임']
  const ei = yang.includes(props.ilju[0]) ? 'E' : 'I'

  // 2. S/N: 주요 오행 (목화→N 직관적, 금수→S 현실적, 토→S)
  let sn = 'S'
  if (['木', '火'].includes(props.mainElement)) sn = 'N'

  // 3. T/F: 결핍 오행 (금수 부족→F 감성적, 목화 부족→T 이성적, 기타→F)
  let tf = 'F'
  if (props.missing.includes('金') || props.missing.includes('水')) tf = 'F'
  else if (props.missing.includes('木') || props.missing.includes('火')) tf = 'T'

  // 4. J/P: 시주 유무 (있으면 J, 없으면 P / 토 부족→P)
  let jp = props.hourPillar ? 'J' : 'P'
  if (props.missing.includes('土')) jp = 'P'

  return ei + sn + tf + jp
})

const MBTI_DATA = {
  dog: {
    '갑': { title: '당당한 리더 대장님', emoji: '🦁', desc: '한 그루 큰 나무처럼 곧고 당당한 성격이에요. 무리에서 자연스럽게 리더 역할을 맡으며, 가족을 지키려는 책임감이 매우 강합니다.', strengths: ['강한 책임감', '자신감', '리더십'], growth: ['고집 줄이기', '유연한 태도'] },
    '을': { title: '다정한 평화주의자', emoji: '🌿', desc: '부드러운 풀잎처럼 유연하고 다정한 성격이에요. 주변의 감정을 잘 살피며 가족에게 지극한 사랑을 표현하는 애교쟁이랍니다.', strengths: ['공감 능력', '친화력', '적응력'], growth: ['분리불안 주의', '자신감 키우기'] },
    '병': { title: '열정적인 에너자이저', emoji: '☀️', desc: '태양처럼 밝고 활동적인 기운이 넘쳐요. 처음 보는 사람과도 금방 친해지는 사교왕이며, 지치지 않는 체력의 소유자입니다.', strengths: ['긍정 에너지', '활발함', '친화성'], growth: ['흥분 조절', '기본 복종 훈련'] },
    '정': { title: '섬세한 감성 예술가', emoji: '🕯️', desc: '등불처럼 섬세하고 깊은 내면을 가졌어요. 주인의 기분을 누구보다 빨리 알아채고 조용히 곁을 지키는 다정한 아이예요.', strengths: ['섬세한 관찰력', '깊은 유대감', '차분함'], growth: ['소심함 극복', '낯선 환경 적응'] },
    '무': { title: '든든한 수호신 산맥', emoji: '⛰️', desc: '거대한 산처럼 묵직하고 믿음직한 성격이에요. 어떤 상황에서도 당황하지 않고 가족을 든든하게 지켜주는 듬직한 동반자입니다.', strengths: ['높은 인내심', '신뢰도', '차분함'], growth: ['활동량 늘리기', '식단 관리'] },
    '기': { title: '포근한 대지의 품', emoji: '🌾', desc: '넉넉하고 비옥한 대지 같은 아이예요. 성실하고 온화하며 누구와도 다투지 않는 평화로운 성품을 지녔습니다.', strengths: ['포용력', '성실함', '조화로움'], growth: ['자기 의사 표현', '스트레스 해소'] },
    '경': { title: '강인한 투사 전사', emoji: '🛡️', desc: '강철 같은 의지와 용맹함을 가진 전사 타입이에요. 겁이 없고 자기 주관이 뚜렷하며, 주인을 향한 충성심이 매우 강력합니다.', strengths: ['용기', '확실한 충성심', '독립성'], growth: ['공격성 제어', '사회화 훈련'] },
    '신': { title: '세련된 영리한 보석', emoji: '💎', desc: '보석처럼 영리하고 깔끔한 성격을 가졌어요. 지능이 매우 높고 눈치가 빠르며, 자신만의 루틴을 지키는 완벽주의 기질이 있습니다.', strengths: ['뛰어난 지능', '깔끔함', '세심함'], growth: ['예민함 완화', '다양한 경험'] },
    '임': { title: '자유로운 바다 모험가', emoji: '🌊', desc: '넓은 바다처럼 자유롭고 호기심이 왕성해요. 새로운 장소와 냄새를 탐험하는 것을 즐기며 구속받는 것을 싫어하는 자유 영혼입니다.', strengths: ['강한 호기심', '적응력', '활동성'], growth: ['콜 훈련 강화', '규칙 준수'] },
    '계': { title: '지혜로운 관찰자', emoji: '💧', desc: '맑은 이슬처럼 조용히 세상을 관찰하는 지혜로운 아이예요. 상황 판단이 빠르고 영리하며, 조용히 주인의 마음을 위로해줍니다.', strengths: ['빠른 상황 판단', '직관력', '차분함'], growth: ['체력 보충', '활동적인 놀이'] }
  },
  cat: {
    '갑': { title: '위엄 있는 제왕', emoji: '👑', desc: '집안의 모든 공간을 통치하는 당당한 카리스마의 소유자예요. 자존심이 높고 독립적이며, 자신이 인정한 주인에게만 마음을 엽니다.', strengths: ['높은 자존감', '독립성', '위엄'], growth: ['사회성 기르기', '스킨십 연습'] },
    '을': { title: '은밀한 감성 아티스트', emoji: '🎨', desc: '섬세하고 유연한 감각으로 자신만의 세계를 즐겨요. 가끔은 엉뚱한 행동으로 웃음을 주기도 하는 낭만적인 고양이에요.', strengths: ['풍부한 표현력', '유연성', '창의적 장난'], growth: ['예민함 조절', '안정적 환경'] },
    '병': { title: '화려한 주인공 스타', emoji: '🎭', desc: '어디서나 시선을 끄는 매력과 당당함을 가졌어요. 활동적이고 사교적이며 주인의 관심을 받는 것을 무척 즐기는 타입입니다.', strengths: ['사교성', '활동량', '매력 발산'], growth: ['질투심 관리', '휴식 시간 보장'] },
    '정': { title: '따뜻한 난로 츤데레', emoji: '🔥', desc: '겉으론 시크해 보이지만 내면은 누구보다 따뜻해요. 조용히 다가와 곁에 머무는 것으로 사랑을 표현하는 깊은 감성의 소유자입니다.', strengths: ['은근한 다정함', '충실함', '조용함'], growth: ['낯가림 극복', '적극적 표현'] },
    '무': { title: '느긋한 선비 철학자', emoji: '🧘', desc: '세상의 이치를 깨달은 듯 늘 여유로운 모습이에요. 높은 곳에서 평화롭게 낮잠을 즐기며 사색에 잠기는 것을 좋아하는 철학자입니다.', strengths: ['높은 안정감', '인내심', '평온함'], growth: ['활동 유도', '비만 주의'] },
    '기': { title: '포근한 무릎 냥이', emoji: '🧸', desc: '주인의 온기를 가장 좋아하는 순둥이예요. 한결같은 사랑과 신뢰를 보내며, 다동물 가정에서도 조화롭게 잘 지내는 아이입니다.', strengths: ['친화력', '안정감', '애교'], growth: ['독립심 키우기', '체중 관리'] },
    '경': { title: '용맹한 사냥꾼 전사', emoji: '🏹', desc: '민첩하고 강인한 신체 능력과 사냥 본능을 가졌어요. 목표를 정하면 끝까지 추적하는 끈기와 용맹함을 보여주는 멋진 고양이에요.', strengths: ['민첩함', '집중력', '용기'], growth: ['공격적 놀이 제어', '에너지 발산'] },
    '신': { title: '고귀한 귀족 영애/영식', emoji: '💍', desc: '우아한 자태와 까다로운 취향을 가진 품격 있는 아이예요. 영리하고 섬세하며, 자신의 영역이 깨끗하게 유지되는 것을 중요하게 여깁니다.', strengths: ['영리함', '우아함', '깔끔함'], growth: ['까다로움 완화', '새로운 자극'] },
    '임': { title: '신비로운 모험가', emoji: '🔮', desc: '알 수 없는 속마음과 끝없는 호기심으로 가득해요. 집안 구석구석을 탐험하고 새로운 물건에 먼저 다가가는 용감한 탐험가입니다.', strengths: ['호기심', '모험심', '강한 적응력'], growth: ['안전 사고 주의', '규칙 훈련'] },
    '계': { title: '영험한 예언자', emoji: '🌙', desc: '앞날을 내다보는 듯한 신비로운 눈빛과 지혜를 가졌어요. 직관력이 매우 뛰어나 주인의 마음 상태를 귀신같이 알아맞히는 예언자 타입입니다.', strengths: ['직관력', '지혜', '깊은 감성'], growth: ['스트레스 관리', '교감 시간'] }
  }
}

const typeInfo = computed(() => {
  const gan = props.ilju[0]
  const data = MBTI_DATA[props.petType] || MBTI_DATA.dog
  return data[gan] || data['갑']
})
</script>

<template>
  <div class="pet-mbti-card">
    <div class="mbti-header">
      <div class="title-wrap">
        <h3>{{ t('petMBTITitle') || '반려동물 MBTI 성격 유형' }}</h3>
        <p class="subtitle">{{ t('petMBTISubtitle') || '사주 오행으로 분석한 우리 아이 성격' }}</p>
      </div>
      <div class="mbti-emoji">{{ typeInfo.emoji }}</div>
    </div>

    <div class="mbti-main">
      <div class="code-display">
        <span class="mbti-code">{{ mbtiCode }}</span>
        <span class="type-title">{{ typeInfo.title }}</span>
      </div>
      
      <p class="type-desc">{{ typeInfo.desc }}</p>

      <div class="tags-section">
        <div class="section-label">{{ t('petMBTIStrengths') || '주요 강점' }}</div>
        <div class="tags">
          <span v-for="s in typeInfo.strengths" :key="s" class="strength-tag"># {{ s }}</span>
        </div>
      </div>

      <div class="tags-section">
        <div class="section-label">{{ t('petMBTIGrowth') || '성장 포인트' }}</div>
        <div class="tags">
          <span v-for="g in typeInfo.growth" :key="g" class="growth-tag">🌱 {{ g }}</span>
        </div>
      </div>
    </div>

    <div class="mbti-footer">
      <p class="disclaimer">* {{ t('petMBTIDisclaimer') || '본 결과는 반려동물의 사주 기운을 기반으로 한 재미로 보는 성격 유형입니다.' }}</p>
    </div>
  </div>
</template>

<style scoped>
.pet-mbti-card {
  background: var(--card-bg);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 32px 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(123, 94, 77, 0.05);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.pet-mbti-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: linear-gradient(90deg, var(--primary), #C4A882);
}

.mbti-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.mbti-header h3 {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 4px;
}

.subtitle {
  font-size: 0.85rem;
  color: var(--text-sub);
}

.mbti-emoji {
  font-size: 2.5rem;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}

.mbti-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.code-display {
  text-align: center;
  padding: 24px;
  background: var(--primary-light);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mbti-code {
  font-size: 3.5rem;
  font-weight: 900;
  color: var(--primary);
  letter-spacing: 0.1em;
  line-height: 1;
}

.type-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
}

.type-desc {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-main);
  word-break: keep-all;
  padding: 0 4px;
}

.tags-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.section-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-sub);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.strength-tag {
  background: var(--missing-bg);
  color: var(--missing-text);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid rgba(163, 123, 69, 0.1);
}

.growth-tag {
  background: var(--bg-main);
  color: var(--text-main);
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid var(--border-light);
}

.mbti-footer {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px dashed var(--border-light);
}

.disclaimer {
  font-size: 0.75rem;
  color: var(--text-sub);
  opacity: 0.7;
  text-align: center;
}

/* Dark Mode Overrides */
html.dark .pet-mbti-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

html.dark .strength-tag {
  background: rgba(196, 168, 130, 0.1);
}

@media (max-width: 600px) {
  .mbti-code {
    font-size: 2.8rem;
  }
  .type-title {
    font-size: 1.1rem;
  }
}
</style>
