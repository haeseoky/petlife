// 간지 표
const CHEONGAN = ['갑','을','병','정','무','기','경','신','임','계']
const JIJI = ['자','축','인','묘','진','사','오','미','신','유','술','해']
const CHEONGAN_ELEMENT = ['木','木','火','火','土','土','金','金','水','水']
const JIJI_ELEMENT = ['水','土','木','木','土','火','火','土','金','金','土','水']
const ELEMENT_NAMES = { '木': '목(木)', '火': '화(火)', '土': '토(土)', '金': '금(金)', '水': '수(水)' }
const ELEMENT_COLORS = { '木': '#22c55e', '火': '#ef4444', '土': '#eab308', '金': '#9ca3af', '水': '#3b82f6' }
const JIJI_ANIMAL = ['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지']

const DOG_PERSONALITY = {
  '갑': {
    title: '듬직한 리더형',
    desc: '갑목(甲木)은 큰 나무처럼 꿋꿋하고 의지가 강해요. 다른 강아지들을 이끄는 리더 기질이 있으며, 산책할 때도 앞장서는 타입니다.',
    traits: ['의지가 강함', '리더십', '보호본능', '독립적'],
    compatible: ['병·정화(火)일주', '임·계수(水)일주'],
    walkStyle: '앞장서서 걷기 좋아해요. 리드줄을 당기는 편이지만, 기본 훈련만 잘 되면 훌륭한 산책 파트너!',
    foodPref: '단백질이 풍부한 식단을 선호해요. 닭고기, 소고기 위주의 식사가 좋습니다.',
    healthTip: '간과 담낭이 약할 수 있어요. 피로해 보이면 충분한 휴식을 챙겨주세요.'
  },
  '을': {
    title: '따뜻한 친구형',
    desc: '을목(乙木)은 덩굴처럼 유연하고 부드러워요. 가족에게 애착이 강하고 순응력이 뛰어나며, 스킨십을 좋아하는 타입니다.',
    traits: ['애착이 강함', '순응력', '스킨십 좋아함', '감성적'],
    compatible: ['병·정화(火)일주', '무·기토(土)일주'],
    walkStyle: '가족 곁에 바짝 붙어 걷는 걸 좋아해요. 함께 산책하는 시간 자체를 소중히 여깁니다.',
    foodPref: '섬유질이 풍부한 식단이 좋아요. 채소가 섞인 사료나 간식을 좋아할 확률이 높아요.',
    healthTip: '근골격계가 약할 수 있어요. 점프나 높은 곳에서 내려오는 건 관절에 무리가 갈 수 있습니다.'
  },
  '병': {
    title: '밝은 에너지형',
    desc: '병화(丙火)는 태양처럼 밝고 에너지가 넘쳐요! 장난기가 많고 항상 즐거운 표정이며, 모든 사람과 친해지는 사교왕입니다.',
    traits: ['사교성 최고', '에너지 넘침', '장난기 많음', '표정이 풍부'],
    compatible: ['무·기토(土)일주', '갑·을목(木)일주'],
    walkStyle: '산책 중에도 여기저기 냄새 맡고 인사하느라 바빠요! 에너지 소모가 많아 긴 산책이 필요합니다.',
    foodPref: '활동량이 많아 칼로리가 높은 식단이 필요해요. 간식도 듬뿍! 하지만 비만 주의.',
    healthTip: '심장과 소장이 약할 수 있어요. 무더운 여름엔 열사병에 특히 주의해주세요.'
  },
  '정': {
    title: '섬세한 감성형',
    desc: '정화(丁火)는 촛불처럼 따뜻하고 섬세해요. 주인의 감정을 누구보다 잘 읽고, 슬플 때 곁에 와 위로해주는 다정한 아이입니다.',
    traits: ['감정 공감력', '다정함', '직관력', '예민함'],
    compatible: ['무·기토(土)일주', '갑·을목(木)일주'],
    walkStyle: '차분하고 조용한 산책을 좋아해요. 조명이 부드러운 저녁 산책이 특히 잘 맞습니다.',
    foodPref: '음식에 까다로울 수 있어요. 신선한 재료로 만든 프리미엄 식사를 선호합니다.',
    healthTip: '눈과 심장이 약할 수 있어요. 정기적인 안과 검진과 스트레스 관리가 중요합니다.'
  },
  '무': {
    title: '든든한 산형',
    desc: '무토(戊土)는 큰 산처럼 묵직하고 듬직해요. 집을 잘 지키고 가족을 지키려는 보호본능이 강하며, 믿음직한 성격입니다.',
    traits: ['보호본능', '인내심', '신뢰감', '차분함'],
    compatible: ['경·신금(金)일주', '병·정화(火)일주'],
    walkStyle: '묵직하고 느긋한 걸음이에요. 산책 속도는 느리지만 끈기 있게 오래 걸을 수 있습니다.',
    foodPref: '든든하게 먹는 걸 좋아해요. 식사량이 많은 편이니 규칙적인 식사 시간이 중요합니다.',
    healthTip: '비장과 위가 약할 수 있어요. 소화가 잘 되는 식사와 규칙적인 배변 습관을 들여주세요.'
  },
  '기': {
    title: '포용의 화합형',
    desc: '기토(己土)는 비옥한 땅처럼 포용력이 뛰어나요. 다른 반려동물과도 잘 지내고, 어린아이에게도 부드럽게 대하는 온화한 성격입니다.',
    traits: ['포용력', '온화함', '사교적', '적응력'],
    compatible: ['경·신금(金)일주', '병·정화(火)일주'],
    walkStyle: '누구와 함께 걸어도 잘 적응해요. 강아지 공원에서 다른 친구들과 노는 걸 좋아합니다.',
    foodPref: '골고루 잘 먹는 편이에요. 영양 균형 잡힌 식단이면 만족합니다.',
    healthTip: '비장과 위장이 약할 수 있어요. 과식을 방지하고 소화에 좋은 간식을 선택해주세요.'
  },
  '경': {
    title: '당찬 독립형',
    desc: '경금(庚金)은 날카로운 칼처럼 의지가 강하고 독립적이에요. 자기주장이 뚜렷하고, 한 번 정한 건 끝까지 밀고 나가는 고집이 있습니다.',
    traits: ['독립성', '의지가 강함', '고집', '용기'],
    compatible: ['임·계수(水)일주', '무·기토(土)일주'],
    walkStyle: '자기가 가고 싶은 쪽으로 가려고 해요. 리드 훈련이 필수! 하지만 한 번 길들이면 충성도가 높습니다.',
    foodPref: '육류 위주의 고단백 식단을 선호해요. 씹는 맛이 있는 간식을 특히 좋아합니다.',
    healthTip: '폐와 대장이 약할 수 있어요. 호흡기 건강에 주의하고, 먼지가 많은 환경은 피해주세요.'
  },
  '신': {
    title: '영리한 학습형',
    desc: '신금(辛金)은 보석처럼 영리고 섬세해요. 학습 능력이 뛰어나 훈련을 빨리 습득하고, 까다로운 트릭도 금방 배우는 천재형입니다.',
    traits: ['영리함', '학습력', '관찰력', '완벽주의'],
    compatible: ['임·계수(水)일주', '무·기토(土)일주'],
    walkStyle: '지능적이라 산책 루트를 잘 기억해요. 새로운 길을 탐험하는 걸 좋아하고 길을 잘 찾습니다.',
    foodPref: '편식을 할 수 있어요. 맛과 식감에 민감하니 다양한 간식으로 취향을 파악해보세요.',
    healthTip: '피부와 호흡기가 약할 수 있어요. 알레르기 유발 식품은 피하고, 정기적인 목욕이 필요합니다.'
  },
  '임': {
    title: '자유로운 모험형',
    desc: '임수(壬水)는 큰 바다처럼 넓은 마음과 자유로운 영혼이에요. 새로운 환경에도 금방 적응하고, 호기심이 왕성한 탐험가입니다.',
    traits: ['호기심', '적응력', '자유로움', '넓은 마음'],
    compatible: ['갑·을목(木)일주', '경·신금(金)일주'],
    walkStyle: '자유롭게 뛰어놀기를 좋아해요! 노줄 산책이나 넓은 공원에서 뛰어놀면 행복해합니다.',
    foodPref: '다양한 맛을 좋아해요. 새로운 간식이나 토핑을 올려주면 식사 시간이 더 즐거워집니다.',
    healthTip: '신장과 방광이 약할 수 있어요. 충분한 수분 섭취와 규칙적인 배변이 중요합니다.'
  },
  '계': {
    title: '지혜로운 관찰형',
    desc: '계수(癸水)는 이슬처럼 조용하지만 지혜롭고 직관이 뛰어나요. 눈치가 빠르고 상황 파악력이 좋아, 주인의 기분 변화를 제일 먼저 알아채요.',
    traits: ['직관력', '눈치가 빠름', '차분함', '깊은 감성'],
    compatible: ['갑·을목(木)일주', '경·신금(金)일주'],
    walkStyle: '차분하게 주변을 관찰하며 걸어요. 비 오는 날 산책을 묘하게 좋아할 수 있습니다.',
    foodPref: '수분이 많은 식사를 선호해요. 습식사료나 물에 불린 사료를 좋아할 확률이 높아요.',
    healthTip: '신장과 방광이 약할 수 있어요. 물을 충분히 마시도록 하고, 추운 날엔 보온에 신경 써주세요.'
  }
}

const LUCK_MSG = {
  '木': '🌱 새로운 성장의 기운이 있어요. 산책 코스를 바꿔보거나 새로운 장난감을 소개해보세요!',
  '火': '🔥 에너지가 넘치는 시기! 활동량을 늘리고, 애견 운동회나 훈련 클래스에 참여해보세요.',
  '土': '🏔️ 안정이 필요한 시기예요. 집에서 편안한 시간을 보내고, 쿠션과 베드를 새로 마련해주세요.',
  '金': '✨ 깔끔함이 행운의 열쇠! 그루밍을 예쁘게 해주고, 깨끗한 환경을 유지해주세요.',
  '水': '💧 물과 관련된 행운이! 수영을 시도해보거나, 산책 중 시원한 물가를 찾아가보세요.'
}

const COMPATIBILITY = {
  '木火': '목생화(木生火) — 나무가 불을 지피듯, 서로 에너지를 주고받는 환상의 케미!',
  '木土': '목극토(木剋土) — 나무가 땅을 뚫듯, 서로 다른 성향이지만 보완하는 관계.',
  '木金': '금극목(金剋木) — 다소 충돌할 수 있지만, 서로 성장하게 만드는 자극적인 관계.',
  '木水': '수생목(水生木) — 물이 나무를 키우듯, 서로를 키워주는 따뜻한 관계.',
  '木木': '동행(同行) — 비슷한 성향으로 이해하기 쉽지만, 경쟁심이 생길 수도 있어요.',
  '火土': '화생토(火生土) — 불이 흙을 굳히듯, 서로 든든하게 받쳐주는 관계.',
  '火金': '화극금(火剋金) — 불이 쇠를 녹이듯, 서로 녹여주지만 조율이 필요한 관계.',
  '火水': '수극화(水剋火) — 불과 물의 만남! 자극적이지만 서로 조절해주는 균형 관계.',
  '火火': '동행(同行) — 열정이 두 배! 함께 있으면 에너지가 넘치지만 싸움에 주의.',
  '土金': '토생금(土生金) — 흙이 금을 품듯, 서로를 품어주는 포근한 관계.',
  '土水': '토극수(土剋水) — 흙이 물을 막듯, 서로 제어해주는 관계. 균형이 중요!',
  '土土': '동행(同行) — 안정감은 최고! 하지만 변화에 둘 다 서툴 수 있어요.',
  '金水': '금생수(金生水) — 쇠에서 물이 흐르듯, 자연스럽게 잘 맞는 궁합!',
  '金金': '동행(同行) — 비슷한 기질로 이해하지만, 고집이 충돌할 수 있어요.',
  '水水': '동행(同行) — 깊은 감성을 공유하지만, 서로 소심해질 수 있으니 활동적인 자극이 필요!'
}

function getCompatibility(el1, el2) {
  const key1 = el1 + el2
  const key2 = el2 + el1
  return COMPATIBILITY[key1] || COMPATIBILITY[key2] || '서로 다른 매력을 가진 특별한 관계!'
}

function getTodayLuck() {
  const now = new Date()
  const dayGanIdx = Math.floor(now.getTime() / 86400000) % 10
  return CHEONGAN[dayGanIdx]
}

function getMainElement(distribution) {
  let max = 0, main = '土'
  for (const [el, pct] of Object.entries(distribution)) {
    if (pct > max) { max = pct; main = el }
  }
  return main
}

export function computeSaju(year, month, day, hour) {
  // 연주
  const yearGanIdx = (year - 4) % 10
  const yearJiIdx = (year - 4) % 12
  const yearGan = CHEONGAN[yearGanIdx]
  const yearJi = JIJI[yearJiIdx]
  const yearAnimal = JIJI_ANIMAL[yearJiIdx]

  // 월주 (간단 근사)
  const monthGanIdx = ((year - 4) % 5 * 2 + month) % 10
  const monthJiIdx = (month + 1) % 12
  const monthGan = CHEONGAN[monthGanIdx]
  const monthJi = JIJI[monthJiIdx]

  // 일주 (줄리안 데이 근사)
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
  const dayGanIdx = (jdn - 1) % 10
  const dayJiIdx = (jdn - 1) % 12
  const dayGan = CHEONGAN[dayGanIdx]
  const dayJi = JIJI[dayJiIdx]

  // 시주
  const hourJiIdx = Math.floor(((hour || 12) + 1) / 2) % 12
  const hourGanIdx = (dayGanIdx % 5 * 2 + hourJiIdx) % 10
  const hourGan = CHEONGAN[hourGanIdx]
  const hourJi = JIJI[hourJiIdx]

  const yearPillar = yearGan + yearJi
  const monthPillar = monthGan + monthJi
  const dayPillar = dayGan + dayJi
  const hourPillar = hourGan + hourJi

  // 오행 분석
  const elements = [yearGan, monthGan, dayGan, hourGan].map(g => CHEONGAN_ELEMENT[CHEONGAN.indexOf(g)])
  const elementsWithJi = [
    ...elements,
    JIJI_ELEMENT[yearJiIdx], JIJI_ELEMENT[monthJiIdx],
    JIJI_ELEMENT[dayJiIdx], JIJI_ELEMENT[hourJiIdx]
  ]
  const counts = {}
  for (const e of elementsWithJi) counts[e] = (counts[e] || 0) + 1
  const totalElements = Object.values(counts).reduce((a, b) => a + b, 0)
  const distribution = Object.fromEntries(
    Object.entries(counts).map(([k, v]) => [k, Math.round(v / totalElements * 100)])
  )

  const allElements = ['木', '火', '土', '金', '水']
  const missing = allElements.filter(e => !counts[e])
  const mainElement = getMainElement(distribution)
  const personality = DOG_PERSONALITY[dayGan]
  const todayLuck = getTodayLuck()
  const todayLuckElement = CHEONGAN_ELEMENT[CHEONGAN.indexOf(todayLuck)]
  const compatibility = getCompatibility(mainElement, todayLuckElement)

  return {
    yearPillar, monthPillar, dayPillar, hourPillar,
    yearAnimal,
    ilju: dayPillar,
    personality,
    distribution,
    missing,
    mainElement,
    todayLuck,
    todayLuckMsg: LUCK_MSG[todayLuckElement],
    compatibility,
    elementNames: ELEMENT_NAMES,
    elementColors: ELEMENT_COLORS
  }
}
