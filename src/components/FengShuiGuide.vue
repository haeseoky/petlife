<script setup>
import { computed } from 'vue'
import { t } from '../i18n.js'

const props = defineProps({
  result: { type: Object, required: true }
})

const { mainElement, missing, petType, elementNames } = props.result

// 오행별 풍수 데이터
const fengShuiData = {
  木: {
    direction: { ko: '동쪽', en: 'East', degree: 90 },
    color: '#4CAF50',
    colorName: { ko: '초록·청록', en: 'Green / Teal' },
    accentColors: [{ hex: '#66BB6A', name: { ko: '연두', en: 'Light Green' } }, { hex: '#2E7D32', name: { ko: '진초록', en: 'Forest Green' } }, { hex: '#00897B', name: { ko: '틸', en: 'Teal' } }],
    interior: { ko: '식물을 배치하면 목(木) 기운이 더해져요. 관엽식물이나 작은 화분을 반려동물 공간 근처에 두면 생기가 돌아요.', en: 'Placing plants boosts Wood energy. Potted plants near your pet\'s space bring vitality.' },
    dogTip: { ko: '산책로에 나무가 많은 공원을 선택해주세요. 나무 그늘 아래 쉬는 시간도 중요해요.', en: 'Choose parks with lots of trees for walks. Resting under tree shade is also beneficial.' },
    catTip: { ko: '캣그라스나 실내 식물을 안전하게 배치해주세요. 창가에 작은 화분을 두면 자연의 기운을 느낄 수 있어요.', en: 'Place cat grass or safe indoor plants. A small pot by the window lets them feel nature.' }
  },
  火: {
    direction: { ko: '남쪽', en: 'South', degree: 180 },
    color: '#F44336',
    colorName: { ko: '빨강·주황', en: 'Red / Orange' },
    accentColors: [{ hex: '#FF7043', name: { ko: '주황', en: 'Orange' } }, { hex: '#FFB74D', name: { ko: '노랑', en: 'Amber' } }, { hex: '#FF5252', name: { ko: '코랄', en: 'Coral' } }],
    interior: { ko: '따뜻한 조명과 붉은 톤의 소품이 화(火) 기운을 더해요. 간접 조명을 반려동물 공간에 배치해보세요.', en: 'Warm lighting and red-toned accessories boost Fire energy. Try ambient lighting near your pet\'s space.' },
    dogTip: { ko: '햇살이 잘 드는 곳에 방석을 깔아주세요. 따뜻한 색상의 장난감이나 목줄이 좋아요.', en: 'Place a mat where sunlight comes in. Warm-colored toys and leashes are recommended.' },
    catTip: { ko: '햇빛이 잘 드는 창가에 고양이 침대를 배치해주세요. 따뜻한 색상의 쿠션을 좋아할 거예요.', en: 'Place the cat bed by a sunny window. They\'ll love warm-colored cushions.' }
  },
  土: {
    direction: { ko: '중앙·남서쪽', en: 'Center / Southwest', degree: 225 },
    color: '#8D6E63',
    colorName: { ko: '베이지·갈색', en: 'Beige / Brown' },
    accentColors: [{ hex: '#D7CCC8', name: { ko: '베이지', en: 'Beige' } }, { hex: '#A1887F', name: { ko: '모카', en: 'Mocha' } }, { hex: '#795548', name: { ko: '초코', en: 'Chocolate' } }],
    interior: { ko: '안정적인 공간 구성이 중요해요. 둥근 형태의 가구와 자연 소재(면, 나무)를 사용하면 토(土) 기운이 강화돼요.', en: 'Stable space layout matters. Round furniture and natural materials (cotton, wood) strengthen Earth energy.' },
    dogTip: { ko: '집 중앙에 편안한 방석을 두어 안식처를 만들어주세요. 규칙적인 생활 리듬이 중요해요.', en: 'Create a resting spot in the center of your home. A regular routine is important.' },
    catTip: { ko: '높이가 낮고 넓은 캣타워나 박스를 제공해주세요. 흙이나 모래 느낌의 소재를 좋아해요.', en: 'Provide low, wide cat towers or boxes. They enjoy earthy, sandy textures.' }
  },
  金: {
    direction: { ko: '서쪽·북서쪽', en: 'West / Northwest', degree: 315 },
    color: '#B0BEC5',
    colorName: { ko: '흰색·금색', en: 'White / Gold' },
    accentColors: [{ hex: '#ECEFF1', name: { ko: '아이보리', en: 'Ivory' } }, { hex: '#CFD8DC', name: { ko: '실버', en: 'Silver' } }, { hex: '#FFD700', name: { ko: '골드', en: 'Gold' } }],
    interior: { ko: '깔끔하고 정돈된 공간이 금(金) 기운에 좋아요. 금속 소재의 장식이나 흰색 식기가 도움이 돼요.', en: 'Clean, organized spaces boost Metal energy. Metallic decor or white dishes help.' },
    dogTip: { ko: '깔끔한 그루밍 도구와 정돈된 공간을 유지해주세요. 흰색이나 밝은 색상의 액세서리가 좋아요.', en: 'Maintain clean grooming tools and tidy spaces. White or light-colored accessories are ideal.' },
    catTip: { ko: '깨끗한 화장실 환경이 매우 중요해요. 금속 재질의 그릇이나 흰색 소품을 추천해요.', en: 'A clean litter area is crucial. Metal bowls and white accessories are recommended.' }
  },
  水: {
    direction: { ko: '북쪽', en: 'North', degree: 0 },
    color: '#42A5F5',
    colorName: { ko: '파랑·검정', en: 'Blue / Black' },
    accentColors: [{ hex: '#1E88E5', name: { ko: '로얄블루', en: 'Royal Blue' } }, { hex: '#90CAF9', name: { ko: '스카이블루', en: 'Sky Blue' } }, { hex: '#37474F', name: { ko: '차콜', en: 'Charcoal' } }],
    interior: { ko: '물과 관련된 요소가 수(水) 기운을 높여요. 작은 분수대, 어항, 또는 파란색 소품이 효과적이에요.', en: 'Water-related elements boost Water energy. A small fountain, fish bowl, or blue accessories are effective.' },
    dogTip: { ko: '항상 신선한 물을 여러 곳에 배치해주세요. 파란색 보올이나 수분 보충 간식이 좋아요.', en: 'Always place fresh water in multiple spots. Blue bowls or hydrating treats are great.' },
    catTip: { ko: '음수대(워터펌프)를 사용하면 물 마시기를 더 좋아할 거예요. 어항을 관찰하는 것도 좋아해요.', en: 'A water fountain encourages drinking. They also enjoy watching fish tanks.' }
  }
}

const mainData = computed(() => fengShuiData[mainElement])

// 부족한 오행 보완 팁
const boostTips = computed(() => {
  if (!missing.length) return []
  return missing.map(el => {
    const data = fengShuiData[el]
    return {
      element: el,
      elementName: elementNames[el],
      color: data.color,
      direction: data.direction,
      tip: petType === 'cat' ? data.catTip : data.dogTip
    }
  })
})

// 방위 표시를 위한 각도 변환 (CSS 회전)
const compassRotation = computed(() => {
  return mainData.value.direction.degree
})

function getColorName(colorObj) {
  const lang = document.documentElement.lang || 'ko'
  return colorObj.name[lang] || colorObj.name.ko
}
</script>

<template>
  <div class="fengshui-card">
    <h3>{{ t('fengshuiTitle') }}</h3>
    <p class="fengshui-desc">{{ t('fengshuiDesc') }}</p>

    <!-- 나침반 & 방위 -->
    <div class="direction-section">
      <div class="compass">
        <div class="compass-ring" :style="{ transform: `rotate(${-compassRotation}deg)` }">
          <span class="compass-dir n">N</span>
          <span class="compass-dir e">E</span>
          <span class="compass-dir s">S</span>
          <span class="compass-dir w">W</span>
        </div>
        <div class="compass-needle" :style="{ transform: `rotate(${compassRotation}deg)` }"></div>
        <div class="compass-center"></div>
      </div>
      <div class="direction-info">
        <div class="dir-item">
          <span class="dir-emoji">🛏️</span>
          <div>
            <span class="dir-label">{{ t('fengshuiBedDir') }}</span>
            <span class="dir-value">{{ mainData.direction.ko }}</span>
          </div>
        </div>
        <div class="dir-item">
          <span class="dir-emoji">🍖</span>
          <div>
            <span class="dir-label">{{ t('fengshuiFoodDir') }}</span>
            <span class="dir-value">{{ mainData.direction.ko }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 추천 색상 -->
    <div class="color-section">
      <h4>{{ t('fengshuiColors') }}</h4>
      <div class="color-main">
        <span class="color-circle" :style="{ background: mainData.color }"></span>
        <span class="color-name">{{ mainData.colorName.ko }}</span>
      </div>
      <div class="color-palette">
        <div v-for="c in mainData.accentColors" :key="c.hex" class="palette-item">
          <span class="color-circle-sm" :style="{ background: c.hex }"></span>
          <span class="palette-name">{{ c.name.ko }}</span>
        </div>
      </div>
    </div>

    <!-- 인테리어 포인트 -->
    <div class="interior-section">
      <h4>{{ t('fengshuiInterior') }}</h4>
      <div class="interior-tip">
        <span class="interior-dot" :style="{ background: mainData.color }"></span>
        <p>{{ mainData.interior.ko }}</p>
      </div>
    </div>

    <!-- 반려동물별 맞춤 팁 -->
    <div class="pet-tip-section">
      <h4>{{ t('fengshuiTipsTitle') }}</h4>
      <p class="pet-tip">{{ petType === 'cat' ? mainData.catTip.ko : mainData.dogTip.ko }}</p>
    </div>

    <!-- 부족한 오행 보완 팁 -->
    <div v-if="boostTips.length" class="boost-section">
      <h4>{{ t('fengshuiBoostTitle') }}</h4>
      <p class="boost-desc">{{ t('fengshuiBoostDesc') }}</p>
      <div v-for="tip in boostTips" :key="tip.element" class="boost-item">
        <div class="boost-header">
          <span class="boost-dot" :style="{ background: tip.color }"></span>
          <span class="boost-element">{{ tip.elementName }}</span>
          <span class="boost-dir">{{ tip.direction.ko }}</span>
        </div>
        <p class="boost-tip">{{ tip.tip.ko }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fengshui-card {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 32px 24px;
  margin-bottom: 24px;
  animation: fade-in-up 0.5s ease;
}
.fengshui-card h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-main);
}
.fengshui-desc {
  font-size: 0.85rem;
  color: var(--text-sub);
  margin-bottom: 24px;
  line-height: 1.5;
}

/* 나침반 */
.direction-section {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 28px;
  padding: 20px;
  background: var(--primary-light);
  border-radius: 12px;
}
.compass {
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}
.compass-ring {
  width: 100%;
  height: 100%;
  border: 2px solid var(--border-light);
  border-radius: 50%;
  position: absolute;
  transition: transform 0.6s ease;
}
.compass-dir {
  position: absolute;
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-sub);
}
.compass-dir.n { top: 4px; left: 50%; transform: translateX(-50%); }
.compass-dir.s { bottom: 4px; left: 50%; transform: translateX(-50%); }
.compass-dir.e { right: 6px; top: 50%; transform: translateY(-50%); }
.compass-dir.w { left: 6px; top: 50%; transform: translateY(-50%); }
.compass-needle {
  position: absolute;
  top: 15%;
  left: 50%;
  width: 3px;
  height: 35%;
  margin-left: -1.5px;
  background: var(--primary);
  border-radius: 2px;
  transform-origin: bottom center;
  transition: transform 0.6s ease;
}
.compass-needle::after {
  content: '';
  position: absolute;
  bottom: -35%;
  left: 50%;
  width: 3px;
  height: 100%;
  margin-left: -1.5px;
  background: var(--text-sub);
  opacity: 0.3;
  border-radius: 2px;
}
.compass-center {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  background: var(--primary);
  border-radius: 50%;
  z-index: 2;
}
.direction-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.dir-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
.dir-emoji {
  font-size: 1.2rem;
}
.dir-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-sub);
  font-weight: 500;
}
.dir-value {
  display: block;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--primary);
}

/* 색상 */
.color-section {
  margin-bottom: 24px;
}
.color-section h4 {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-sub);
  margin-bottom: 12px;
}
.color-main {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.color-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-block;
  border: 2px solid var(--border-light);
}
.color-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
}
.color-palette {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.palette-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.color-circle-sm {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-block;
  border: 1px solid var(--border-light);
}
.palette-name {
  font-size: 0.8rem;
  color: var(--text-sub);
}

/* 인테리어 */
.interior-section {
  margin-bottom: 24px;
}
.interior-section h4 {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-sub);
  margin-bottom: 12px;
}
.interior-tip {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.interior-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 7px;
}
.interior-tip p {
  font-size: 0.9rem;
  color: var(--text-main);
  line-height: 1.7;
  word-break: keep-all;
}

/* 반려동물 팁 */
.pet-tip-section {
  margin-bottom: 24px;
}
.pet-tip-section h4 {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-sub);
  margin-bottom: 12px;
}
.pet-tip {
  font-size: 0.9rem;
  color: var(--text-main);
  line-height: 1.7;
  word-break: keep-all;
  padding: 14px;
  background: var(--primary-light);
  border-radius: 8px;
}

/* 부족한 오행 보완 */
.boost-section {
  border-top: 1px solid var(--border-light);
  padding-top: 20px;
}
.boost-section h4 {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-sub);
  margin-bottom: 6px;
}
.boost-desc {
  font-size: 0.8rem;
  color: var(--text-sub);
  margin-bottom: 16px;
}
.boost-item {
  background: var(--bg-main);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 10px;
}
.boost-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.boost-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.boost-element {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
}
.boost-dir {
  font-size: 0.8rem;
  color: var(--primary);
  margin-left: auto;
}
.boost-tip {
  font-size: 0.85rem;
  color: var(--text-sub);
  line-height: 1.6;
  word-break: keep-all;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
