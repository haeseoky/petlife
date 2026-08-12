<script setup>
import { ref, computed } from 'vue'
import { t, currentLang } from '../i18n.js'

const props = defineProps({
  petType: { type: String, default: 'dog' }
})

const isKorean = computed(() => currentLang.value === 'ko')

const tips = computed(() => {
  if (isKorean.value) {
    return {
      title: '☀️ 여름철 반려동물 건강 관리',
      subtitle: '폭염 속 우리 아이를 지키는 필수 수칙',
      sections: [
        {
          icon: '🌡️',
          title: '열사병 예방',
          items: [
            '한낮 산책 금지! 이른 아침이나 해 진 저녁에 산책하세요',
            '산책 전 손등을 바닥에 5초간 대어보세요. 뜨겁다면 산책을 자제하세요',
            '단두종(불독, 퍼그 등), 노령견, 비만견은 특히 더위에 취약해요',
            '차 안에 혼자 두지 마세요. 단 몇 분도 위험합니다',
            '과도한 헐떡임, 침 흘림, 잇몸 붉어짐, 비틀거림이 보이면 즉시 시원한 곳으로!'
          ]
        },
        {
          icon: '💧',
          title: '수분 및 체온 관리',
          items: [
            '깨끗한 물을 여러 곳에 비치하고 자주 교체해주세요',
            '쿨 매트나 시원한 타월을 제공해 체온을 낮춰주세요',
            '쿨 티셔츠(젖은 옷)를 입히면 수분 증발로 체온 상승을 지연시킬 수 있어요',
            '실내 적정 온도(24~26°C)를 유지하고 급격한 온도 변화를 피하세요',
            '털을 너무 짧게 깎으면 자외선에 노출되므로 적당한 길이를 유지하세요'
          ]
        },
        {
          icon: '🦟',
          title: '참진드기 · 기생충 예방',
          items: [
            '야외 활동 후 발, 귀, 겨드랑이 사이를 꼼꼼히 확인하세요',
            '월 1회 구충제, 진드기 예약약을 놓치지 마세요',
            '풀이 많은 곳 산책 후에는 샤워나 물수건 닦기가 필수예요',
            'SFTS(중증열성혈소판감소증후군) 예방을 위해 야외 활동 시 기피제를 사용하세요'
          ]
        },
        {
          icon: '🍖',
          title: '식중독 예방 & 사료 보관',
          items: [
            '건사료는 서늘하고 건조한 곳에 밀폐 보관 (냉장보관 금지 - 습기로 인해 변질)',
            '개봉한 건사료는 한 달 이내, 늦어도 5주 이내에 급여 완료',
            '습식사료는 개봉 후 1시간 이내 급여, 남은 것은 밀폐하여 냉장 보관 후 48시간 이내 소비',
            '여름철에는 밥그릇을 매일 세척하고 물그릇도 자주 씻어주세요',
            '상한 사료를 먹으면 구토, 설사, 식욕 부진 등 식중독 증상이 나타날 수 있어요'
          ]
        },
        {
          icon: props.petType === 'cat' ? '🐱' : '🐶',
          title: props.petType === 'cat' ? '고양이 특별 관리' : '강아지 특별 관리',
          items: props.petType === 'cat' ? [
            '고양이는 더위를 잘 견디는 편이지만 통풍이 잘되는 곳이 필수예요',
            '털뭉치(헤어볼)가 많아지는 시기니 빗질을 자주 해주세요',
            '슬라이스 창문에 올라타다 낙사 사고가 많으니 창문 안전망을 설치하세요',
            '시원한 타일이나 대리석 바닥을 좋아하니 휴식 공간으로 마련해주세요'
          ] : [
            '산책 후 발바닥 화상을 입을 수 있으니 야간 산책을 권장해요',
            '물놀이 후에는 귀 안쪽을 반드시 말려 귀염증을 예방하세요',
            '아스팔트 열로 인한 화상을 주의하고 잔디나 흙길을 선택하세요',
            '여름은 피부염, 핫스팟이 잘 생기는 계절이니 피부 상태를 자주 확인하세요'
          ]
        }
      ],
      emergencyTitle: '🚨 응급 상황 대처법',
      emergencyDesc: '열사병이 의심되면 즉시 시원한 곳으로 옮기고, 미지근한 물로 몸을 적신 뒤 가까운 동물병원으로 이동하세요. 얼음을 직접 몸에 대는 것은 오히려 위험할 수 있습니다.'
    }
  } else {
    return {
      title: '☀️ Summer Pet Health Care',
      subtitle: 'Essential tips to protect your pet during heat waves',
      sections: [
        {
          icon: '🌡️',
          title: 'Heatstroke Prevention',
          items: [
            'No midday walks! Walk early morning or after sunset',
            'Test the pavement with your hand for 5 seconds before walking',
            'Brachycephalic breeds (Bulldogs, Pugs), seniors, and overweight pets are especially vulnerable',
            'Never leave your pet alone in a car — even for a minute',
            'Watch for excessive panting, drooling, red gums, staggering — move to a cool area immediately!'
          ]
        },
        {
          icon: '💧',
          title: 'Hydration & Temperature',
          items: [
            'Place clean water in multiple locations and refresh frequently',
            'Provide cooling mats or damp towels',
            'Cooling shirts (dampened) can help lower body temperature',
            'Maintain indoor temperature at 24-26°C, avoid sudden changes',
            'Don\'t shave too short — fur protects against UV rays'
          ]
        },
        {
          icon: '🦟',
          title: 'Tick & Parasite Prevention',
          items: [
            'Check paws, ears, and armpits after outdoor activities',
            'Keep up with monthly parasite prevention',
            'Shower or wipe down after walks in grassy areas',
            'Use tick repellent for outdoor adventures'
          ]
        },
        {
          icon: '🍖',
          title: 'Food Safety & Storage',
          items: [
            'Store dry food in a cool, dry place in an airtight container (not the fridge)',
            'Use opened dry food within 4-5 weeks',
            'Wet food should be consumed within 1 hour; refrigerate leftovers for up to 48 hours',
            'Wash food and water bowls daily',
            'Watch for vomiting, diarrhea, or loss of appetite as signs of food poisoning'
          ]
        },
        {
          icon: props.petType === 'cat' ? '🐱' : '🐶',
          title: props.petType === 'cat' ? 'Cat-Specific Care' : 'Dog-Specific Care',
          items: props.petType === 'cat' ? [
            'Ensure good ventilation even though cats handle heat better',
            'Brush frequently to prevent hairballs',
            'Install window screens to prevent falling accidents',
            'Provide cool tile or marble surfaces for lounging'
          ] : [
            'Avoid paw burns — walk at night when possible',
            'Dry ears thoroughly after water play to prevent infections',
            'Choose grass or dirt paths over hot asphalt',
            'Check skin regularly for hotspots and dermatitis'
          ]
        }
      ],
      emergencyTitle: '🚨 Emergency Response',
      emergencyDesc: 'If heatstroke is suspected, move to a cool area immediately, dampen the body with lukewarm water, and head to the nearest vet. Applying ice directly to the body can be dangerous.'
    }
  }
})
</script>

<template>
  <div class="summer-care-card">
    <div class="care-header">
      <h3>{{ tips.title }}</h3>
      <p class="subtitle">{{ tips.subtitle }}</p>
    </div>

    <div class="care-sections">
      <details v-for="(section, index) in tips.sections" :key="index" class="care-section" :open="index === 0">
        <summary class="care-summary">
          <span class="section-icon">{{ section.icon }}</span>
          <span class="section-title">{{ section.title }}</span>
          <span class="expand-icon">▼</span>
        </summary>
        <ul class="care-items">
          <li v-for="(item, iIndex) in section.items" :key="iIndex">{{ item }}</li>
        </ul>
      </details>
    </div>

    <div class="emergency-box">
      <strong>{{ tips.emergencyTitle }}</strong>
      <p>{{ tips.emergencyDesc }}</p>
    </div>

    <p class="care-disclaimer">* {{ isKorean ? '본 정보는 일반적인 건강 관리 참고용이며, 구체적인 질병은 수의사 진료를 받으세요.' : 'This information is for general reference only. Consult a veterinarian for specific health concerns.' }}</p>
  </div>
</template>

<style scoped>
.summer-care-card {
  background: linear-gradient(135deg, #FFF8F0, #FFF5F5);
  border: 1px solid #FFE0D0;
  border-radius: 16px;
  padding: 28px 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(255, 100, 50, 0.06);
  overflow: hidden;
  position: relative;
}

.summer-care-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #FF6B35, #FFA500, #FFD700);
}

html.dark .summer-care-card {
  background: linear-gradient(135deg, #2A1810, #2A1A14);
  border-color: #3A2820;
}

.care-header {
  margin-bottom: 20px;
}

.care-header h3 {
  font-size: 1.15rem;
  font-weight: 800;
  color: #E85D2C;
  margin-bottom: 4px;
}

html.dark .care-header h3 {
  color: #FF8855;
}

.subtitle {
  font-size: 0.85rem;
  color: var(--text-sub);
}

.care-sections {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.care-section {
  background: var(--card-bg);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.care-section[open] {
  border-color: #FFCC99;
}

html.dark .care-section[open] {
  border-color: #4A3020;
}

.care-summary {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  list-style: none;
  user-select: none;
  font-weight: 600;
  font-size: 0.95rem;
}

.care-summary::-webkit-details-marker {
  display: none;
}

.section-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.section-title {
  flex: 1;
  color: var(--text-main);
}

.expand-icon {
  font-size: 0.7rem;
  color: var(--text-sub);
  transition: transform 0.2s ease;
}

.care-section[open] .expand-icon {
  transform: rotate(180deg);
}

.care-items {
  padding: 0 16px 16px 52px;
  list-style: none;
}

.care-items li {
  font-size: 0.88rem;
  color: var(--text-main);
  line-height: 1.6;
  padding: 4px 0;
  position: relative;
}

.care-items li::before {
  content: '•';
  position: absolute;
  left: -14px;
  color: #FF8855;
  font-weight: bold;
}

.emergency-box {
  margin-top: 16px;
  padding: 14px 16px;
  background: #FFF0EC;
  border-radius: 10px;
  border-left: 3px solid #FF4444;
}

html.dark .emergency-box {
  background: rgba(255, 68, 68, 0.1);
}

.emergency-box strong {
  display: block;
  font-size: 0.9rem;
  color: #D32F2F;
  margin-bottom: 6px;
}

html.dark .emergency-box strong {
  color: #FF6666;
}

.emergency-box p {
  font-size: 0.82rem;
  color: var(--text-main);
  line-height: 1.5;
}

.care-disclaimer {
  margin-top: 14px;
  font-size: 0.72rem;
  color: var(--text-sub);
  opacity: 0.7;
  text-align: center;
}

@media (max-width: 600px) {
  .care-items {
    padding-left: 44px;
  }
  .care-summary {
    padding: 12px 14px;
    font-size: 0.9rem;
  }
}
</style>
