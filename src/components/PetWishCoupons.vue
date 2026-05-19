<script setup>
import { ref, onMounted, computed } from 'vue'
import { t, currentLang } from '../i18n.js'

const props = defineProps({
  result: { type: Object, required: true }
})

const { mainElement, missing, petType } = props.result

const coupons = ref([])

const COUPON_DATA = {
  ko: {
    dog: {
      '木': [
        { emoji: '🌳', title: '숲속 산책 패스', desc: '나무가 많은 숲길에서 마음껏 냄새를 맡아요' },
        { emoji: '🧸', title: '새 장난감 구매권', desc: '새로운 장난감을 선물받을 수 있는 기회!' },
        { emoji: '🌿', title: '잔디밭 뒹굴뒹굴권', desc: '폭신한 잔디밭에서 마음껏 등 대고 비벼요' },
        { emoji: '⛰️', title: '등산 원정대권', desc: '평소보다 더 높은 곳으로 모험을 떠나요' },
        { emoji: '🪵', title: '나뭇가지 무제한권', desc: '세상의 모든 나뭇가지를 물어올 수 있어요' }
      ],
      '火': [
        { emoji: '🏃', title: '30분 더 뛰어놀기권', desc: '에너지가 넘칠 때 산책 시간을 연장해요' },
        { emoji: '🍖', title: '바비큐 간식권', desc: '불향 가득한 맛있는 고기 간식을 먹어요' },
        { emoji: '☀️', title: '햇살 일광욕권', desc: '가장 따뜻한 곳에서 푹 자는 시간을 가져요' },
        { emoji: '🔥', title: '우다다 전용 타임', desc: '집 안에서 마음껏 뛰어놀아도 이해해줘요' },
        { emoji: '🎾', title: '공놀이 무한제공권', desc: '집사가 지칠 때까지 공을 던져줍니다' }
      ],
      '土': [
        { emoji: '🛌', title: '이불 뒹굴뒹굴권', desc: '포근한 이불 속에서 주인과 함께 쉬어요' },
        { emoji: '🏠', title: '집 근처 탐험권', desc: '안정적인 우리 동네 구석구석을 살펴봐요' },
        { emoji: '👃', title: '노즈워크 파티권', desc: '맛있는 간식을 숨겨놓은 보물찾기를 해요' },
        { emoji: '🥾', title: '흙길 산책권', desc: '발바닥에 닿는 폭신한 흙의 촉감을 느껴요' },
        { emoji: '🦴', title: '옆자리 껌 씹기권', desc: '주인 옆에서 세상 제일 편하게 껌을 씹어요' }
      ],
      '金': [
        { emoji: '✂️', title: '미용실 예약권', desc: '멋진 스타일로 변신하는 뷰티 데이예요' },
        { emoji: '🍱', title: '프리미엄 시식권', desc: '최고급 간식을 맛볼 수 있는 특별한 기회' },
        { emoji: '🎓', title: '개인기 마스터권', desc: '똑똑한 나를 위해 새로운 훈련을 배워요' },
        { emoji: '🧣', title: '멋쟁이 스카프권', desc: '나의 미모를 돋보이게 할 새 액세서리!' },
        { emoji: '🖌️', title: '명품 빗질 서비스', desc: '죽은 털을 골라내고 털결을 비단처럼 가꿔요' }
      ],
      '水': [
        { emoji: '💦', title: '물놀이 놀이권', desc: '시원한 물에서 신나게 첨벙첨벙 놀아요' },
        { emoji: '🏖️', title: '그늘 낮잠권', desc: '시원한 그늘 아래서 꿀맛 같은 낮잠을 자요' },
        { emoji: '🚰', title: '특급 수분 보충권', desc: '신선하고 시원한 물을 마음껏 마셔요' },
        { emoji: '🌊', title: '호숫가 산책권', desc: '탁 트인 물가에서 시원한 바람을 느껴요' },
        { emoji: '🐾', title: '시원한 발 마사지', desc: '산책 후 피로를 풀어주는 특급 발 마사지' }
      ]
    },
    cat: {
      '木': [
        { emoji: '🌱', title: '캣그라스 뷔페권', desc: '싱싱한 캣그라스를 마음껏 뜯어먹어요' },
        { emoji: '🐦', title: '새 구경 1시간권', desc: '창가에서 새들을 조용히 관찰하는 시간' },
        { emoji: '🏰', title: '캣타워 정복권', desc: '제일 높은 곳에서 집안을 내려다봐요' },
        { emoji: '📦', title: '상자 요새권', desc: '새로운 택배 상자로 나만의 아지트를 만들어요' },
        { emoji: '🍃', title: '풀 냄새 맡기권', desc: '자연의 향기를 담은 새로운 캣닢 타임' }
      ],
      '火': [
        { emoji: '🎣', title: '강렬한 사냥권', desc: '낚시대 장난감으로 본능을 일깨워요' },
        { emoji: '🔴', title: '레이저 추격권', desc: '잡힐 듯 잡히지 않는 붉은 점을 쫓아요' },
        { emoji: '♨️', title: '따끈한 온열 매트', desc: '뜨끈뜨끈한 곳에서 몸을 지지는 힐링 타임' },
        { emoji: '👋', title: '손가락 사냥 허가', desc: '오늘은 집사 손가락을 살짝 깨물어도 무죄!' },
        { emoji: '💨', title: '거실 우다다권', desc: '새벽에 마음껏 뛰어다닐 수 있는 자유' }
      ],
      '土': [
        { emoji: '🛋️', title: '무릎 침대권', desc: '집사의 따뜻한 무릎을 독점하는 시간' },
        { emoji: '🙈', title: '숨바꼭질 대결권', desc: '집사가 찾지 못할 곳에 숨어봐요' },
        { emoji: '🌤️', title: '창가 명상권', desc: '따뜻한 햇살을 받으며 여유를 즐겨요' },
        { emoji: '⛺', title: '비밀 기지권', desc: '구석진 곳에 나만의 포근한 자리를 마련해요' },
        { emoji: '👕', title: '집사 냄새권', desc: '집사가 아끼는 옷 위에서 잠잘 수 있어요' }
      ],
      '金': [
        { emoji: '✨', title: '고급 빗질권', desc: '우아한 코트를 위해 꼼꼼히 빗겨드려요' },
        { emoji: '🍭', title: '츄르 파티권', desc: '좋아하는 간식을 배불리 먹는 날!' },
        { emoji: '🏅', title: '발톱 깎기 보상', desc: '발톱 깎기를 잘 견뎌낸 나를 위한 특급 보상' },
        { emoji: '🎀', title: '실크 패션쇼권', desc: '새로운 리본이나 스카프로 멋을 내봐요' },
        { emoji: '🥣', title: '세련된 새 그릇', desc: '수염이 닿지 않는 편안하고 예쁜 새 식기' }
      ],
      '水': [
        { emoji: '💧', title: '흐르는 물 관찰권', desc: '수도꼭지에서 떨어지는 물을 구경해요' },
        { emoji: '❄️', title: '대리석 낮잠권', desc: '시원한 바닥에서 열을 식히며 자요' },
        { emoji: '🥘', title: '촉촉한 습식 파티', desc: '수분 가득 맛있는 캔 사료를 먹어요' },
        { emoji: '🧊', title: '얼음물 낚시권', desc: '물 위의 얼음을 잡으려고 노력해봐요' },
        { emoji: '⛲', title: '분수 이용권', desc: '퐁퐁 솟아오르는 신선한 물을 마셔요' }
      ]
    }
  },
  en: {
    dog: {
      '木': [
        { emoji: '🌳', title: 'Forest Walk Pass', desc: 'Sniff to your heart\'s content in the woods' },
        { emoji: '🧸', title: 'New Toy Coupon', desc: 'A chance to get a brand new toy gift!' },
        { emoji: '🌿', title: 'Grass Roll Pass', desc: 'Roll around on the soft grass as much as you want' },
        { emoji: '⛰️', title: 'Mountain Hike Pass', desc: 'Go on an adventure to higher places than usual' },
        { emoji: '🪵', title: 'Unlimited Stick Pass', desc: 'Fetch all the sticks in the world today' }
      ],
      '火': [
        { emoji: '🏃', title: '30m Play Extension', desc: 'Extend your walk when energy is peaking' },
        { emoji: '🍖', title: 'BBQ Treat Coupon', desc: 'Enjoy delicious treats with a smoky aroma' },
        { emoji: '☀️', title: 'Sunny Nap Pass', desc: 'Time to sleep in the warmest spot of the house' },
        { emoji: '🔥', title: 'Zoomie Permit', desc: 'Run around the house without any complaints' },
        { emoji: '🎾', title: 'Infinite Fetch Pass', desc: 'The human will throw the ball until you are done' }
      ],
      '土': [
        { emoji: '🛌', title: 'Blanket Snuggle Pass', desc: 'Rest with your owner under cozy blankets' },
        { emoji: '🏠', title: 'Neighborhood Scout', desc: 'Explore every corner of our stable neighborhood' },
        { emoji: '👃', title: 'Nosework Party Pass', desc: 'A treasure hunt with hidden delicious treats' },
        { emoji: '🥾', title: 'Dirt Path Walk Pass', desc: 'Feel the soft texture of soil under your paws' },
        { emoji: '🦴', title: 'Cozy Chew Pass', desc: 'Chew your bone comfortably right next to your human' }
      ],
      '金': [
        { emoji: '✂️', title: 'Grooming Day Pass', desc: 'A beauty day to transform into a cool style' },
        { emoji: '🍱', title: 'Premium Tasting Pass', desc: 'Special chance to taste high-end treats' },
        { emoji: '🎓', title: 'New Trick Lesson', desc: 'Learn a new trick for the smart version of you' },
        { emoji: '🧣', title: 'Fancy Scarf Coupon', desc: 'A new accessory to highlight your beauty!' },
        { emoji: '🖌️', title: 'Luxury Brushing', desc: 'Get rid of loose fur and make your coat like silk' }
      ],
      '水': [
        { emoji: '💦', title: 'Water Play Pass', desc: 'Splash around and play in the cool water' },
        { emoji: '🏖️', title: 'Shady Nap Pass', desc: 'A sweet nap under the cool shade' },
        { emoji: '🚰', title: 'Premium Hydration', desc: 'Drink fresh and cool water as much as you want' },
        { emoji: '🌊', title: 'Lakeside Walk Pass', desc: 'Feel the cool breeze by the open water' },
        { emoji: '🐾', title: 'Cool Paw Massage', desc: 'Special massage to relieve fatigue after walks' }
      ]
    },
    cat: {
      '木': [
        { emoji: '🌱', title: 'Catgrass Buffet', desc: 'Eat fresh catgrass to your heart\'s content' },
        { emoji: '🐦', title: '1-Hour Bird Watch', desc: 'Quiet time observing birds from the window' },
        { emoji: '🏰', title: 'Cat Tower Peak Pass', desc: 'Look down at the house from the highest point' },
        { emoji: '📦', title: 'Box Fortress Coupon', desc: 'Build your own hideout with a new delivery box' },
        { emoji: '🍃', title: 'Nature Sniff Pass', desc: 'New catnip time with the scent of nature' }
      ],
      '火': [
        { emoji: '🎣', title: 'Intense Hunting Pass', desc: 'Awaken your instincts with a wand toy' },
        { emoji: '🔴', title: 'Laser Chase Pass', desc: 'Chase the elusive red dot around the room' },
        { emoji: '♨️', title: 'Heating Pad Session', desc: 'Healing time warming up your body on a mat' },
        { emoji: '👋', title: 'Finger Hunt Permit', desc: 'Innocent even if you nip the human\'s finger today!' },
        { emoji: '💨', title: 'Living Room Zoomie', desc: 'Freedom to run around at dawn as much as you like' }
      ],
      '土': [
        { emoji: '🛋️', title: 'Lap Bed Pass', desc: 'Exclusive time on the human\'s warm lap' },
        { emoji: '🙈', title: 'Hide & Seek Battle', desc: 'Hide where the human will never find you' },
        { emoji: '🌤️', title: 'Window Meditation', desc: 'Enjoy leisure time under the warm sunshine' },
        { emoji: '⛺', title: 'Secret Base Coupon', desc: 'Set up your own cozy spot in a quiet corner' },
        { emoji: '👕', title: 'Human Scent Pass', desc: 'Permission to sleep on the human\'s favorite clothes' }
      ],
      '金': [
        { emoji: '✨', title: 'Luxury Brushing', desc: 'Thorough grooming for your elegant coat' },
        { emoji: '🍭', title: 'Churu Party Pass', desc: 'A day to eat your favorite treats until full!' },
        { emoji: '🏅', title: 'Nail Clip Reward', desc: 'Special reward for enduring the nail clipping' },
        { emoji: '🎀', title: 'Silk Fashion Show', desc: 'Dress up with a new ribbon or scarf' },
        { emoji: '🥣', title: 'Fancy New Bowl', desc: 'A comfortable and pretty bowl that fits your whiskers' }
      ],
      '水': [
        { emoji: '💧', title: 'Running Water Watch', desc: 'Observe the water dripping from the tap' },
        { emoji: '❄️', title: 'Marble Nap Pass', desc: 'Cool down and sleep on the chilly floor' },
        { emoji: '🥘', title: 'Moist Wet Food Party', desc: 'Enjoy delicious canned food full of hydration' },
        { emoji: '🧊', title: 'Ice Water Fishing', desc: 'Try to catch the ice cubes floating on water' },
        { emoji: '⛲', title: 'Fountain Access Pass', desc: 'Drink fresh water popping up from the fountain' }
      ]
    }
  }
}

function generateCoupons() {
  const lang = currentLang.value
  const type = petType === 'cat' ? 'cat' : 'dog'
  const pool = []

  // mainElement 기반 (2개)
  const mainPool = COUPON_DATA[lang][type][mainElement] || COUPON_DATA[lang][type]['土']
  const shuffledMain = [...mainPool].sort(() => 0.5 - Math.random())
  pool.push({ ...shuffledMain[0], used: false, date: '' })
  pool.push({ ...shuffledMain[1], used: false, date: '' })

  // missing 기반 (1개) - 없으면 랜덤 오행 중 하나
  let missingEl = missing.length > 0 ? missing[0] : null
  if (!missingEl) {
    const elements = ['木', '火', '土', '金', '水'].filter(e => e !== mainElement)
    missingEl = elements[Math.floor(Math.random() * elements.length)]
  }
  const missingPool = COUPON_DATA[lang][type][missingEl] || COUPON_DATA[lang][type]['土']
  const shuffledMissing = [...missingPool].sort(() => 0.5 - Math.random())
  pool.push({ ...shuffledMissing[0], used: false, date: '' })

  coupons.value = pool.sort(() => 0.5 - Math.random())
}

function toggleUsed(index) {
  coupons.value[index].used = !coupons.value[index].used
  if (coupons.value[index].used) {
    const now = new Date()
    coupons.value[index].date = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`
  } else {
    coupons.value[index].date = ''
  }
}

onMounted(() => {
  generateCoupons()
})
</script>

<template>
  <div class="coupon-section">
    <div class="header">
      <h3>{{ t('wishCouponTitle') }}</h3>
      <button class="refresh-btn" @click="generateCoupons">
        <span class="refresh-icon">🔄</span> {{ t('wishCouponRegenerate') }}
      </button>
    </div>
    <p class="section-desc">{{ t('wishCouponDesc') }}</p>

    <div class="coupons-grid">
      <div 
        v-for="(coupon, idx) in coupons" 
        :key="idx" 
        class="coupon-card"
        :class="{ 'is-used': coupon.used }"
        @click="toggleUsed(idx)"
      >
        <div class="coupon-inner">
          <div class="coupon-front">
            <div class="coupon-emoji">{{ coupon.emoji }}</div>
            <div class="coupon-content">
              <h4 class="coupon-title">{{ coupon.title }}</h4>
              <p class="coupon-desc">{{ coupon.desc }}</p>
            </div>
            <div class="coupon-footer">
              <span class="status-badge">{{ coupon.used ? t('wishCouponUsed') : t('wishCouponUnused') }}</span>
              <span v-if="coupon.used" class="used-date">{{ coupon.date }}</span>
              <span v-else class="placeholder-date">{{ t('wishCouponPlaceholder') }}</span>
            </div>
          </div>
        </div>
        <div class="stamp" v-if="coupon.used">USED</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.coupon-section {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 32px 24px;
  margin-bottom: 24px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.header h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: 1px solid var(--border-light);
  color: var(--text-sub);
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: var(--primary-light);
  color: var(--primary);
  border-color: var(--primary);
}

.section-desc {
  font-size: 0.85rem;
  color: var(--text-sub);
  margin-bottom: 24px;
}

.coupons-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 640px) {
  .coupons-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .coupons-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.coupon-card {
  position: relative;
  height: 160px;
  cursor: pointer;
  perspective: 1000px;
  transition: transform 0.3s ease;
}

.coupon-card:hover {
  transform: translateY(-4px);
}

.coupon-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: left;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.coupon-front {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: var(--bg-main);
  border: 2px dashed var(--primary-light);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.coupon-front::before, .coupon-front::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: var(--white);
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  border: 1px solid var(--border-light);
}

.coupon-front::before { left: -11px; }
.coupon-front::after { right: -11px; }

.coupon-emoji {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.coupon-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.coupon-desc {
  font-size: 0.75rem;
  color: var(--text-sub);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.coupon-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.status-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--primary-light);
  color: var(--primary);
}

.is-used .status-badge {
  background: #e5e7eb;
  color: #6b7280;
}

.used-date, .placeholder-date {
  font-size: 0.7rem;
  color: var(--text-sub);
  font-family: monospace;
}

.is-used .coupon-front {
  opacity: 0.6;
  filter: grayscale(0.5);
  background: #f9fafb;
}

.stamp {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-15deg);
  border: 4px solid #ef4444;
  color: #ef4444;
  font-size: 1.5rem;
  font-weight: 900;
  padding: 4px 12px;
  border-radius: 8px;
  opacity: 0.8;
  pointer-events: none;
  z-index: 10;
  letter-spacing: 2px;
}

/* Dark Mode support */
:global(.dark-mode) .coupon-section {
  background: #1f1f1f;
  border-color: #333;
}

:global(.dark-mode) .coupon-front {
  background: #2a2a2a;
  border-color: #444;
}

:global(.dark-mode) .coupon-front::before,
:global(.dark-mode) .coupon-front::after {
  background: #1f1f1f;
  border-color: #333;
}

:global(.dark-mode) .is-used .coupon-front {
  background: #1a1a1a;
  opacity: 0.4;
}
</style>
