// 간지 표
const CHEONGAN = ['갑','을','병','정','무','기','경','신','임','계']
const JIJI = ['자','축','인','묘','진','사','오','미','신','유','술','해']
const CHEONGAN_ELEMENT = ['木','木','火','火','土','土','金','金','水','水']
const JIJI_ELEMENT = ['水','土','木','木','土','火','火','土','金','金','土','水']
const ELEMENT_NAMES = { '木': '목(木)', '火': '화(火)', '土': '토(土)', '金': '금(金)', '水': '수(水)' }
const ELEMENT_COLORS = { '木': '#22c55e', '火': '#ef4444', '土': '#eab308', '金': '#e5e7eb', '水': '#3b82f6' }

const DOG_PERSONALITY = {
  '갑': '활발하고 리더십이 강한 타입! 산책을 좋아하고 다른 강아지들을 이끄는 성향이 있어요.',
  '을': '부드럽고 온화한 성격. 가족에게 애정이 많고 순응력이 뛰어나요.',
  '병': '밝고 에너지가 넘쳐요! 장난기 많고 항상 즐거운 강아지예요.',
  '정': '섬세하고 따뜻해요. 주인의 감정을 잘 읽고 위로해주는 타입이에요.',
  '무': '든든하고 묵직해요. 집을 잘 지키고 신뢰감이 넘쳐요.',
  '기': '포용력이 뛰어나요. 다른 반려동물과도 잘 지내는 화합의 달인!',
  '경': '의지가 강하고 독립적이에요. 자기주장이 뚜렷한 멋진 강아지!',
  '신': '날카롭고 영리해요. 학습 능력이 뛰어나고 훈련을 잘 따라와요.',
  '임': '유연하고 적응력이 좋아요. 새로운 환경에서도 금방 적응해요.',
  '계': '지혜롭고 직관이 뛰어나요. 조용하지만 깊은 감성을 가졌어요.'
}

export function computeSaju(year, month, day, hour) {
  // 연주
  const yearGanIdx = (year - 4) % 10
  const yearJiIdx = (year - 4) % 12
  const yearGan = CHEONGAN[yearGanIdx]
  const yearJi = JIJI[yearJiIdx]

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

  // 사주 문자열
  const yearPillar = yearGan + yearJi
  const monthPillar = monthGan + monthJi
  const dayPillar = dayGan + dayJi
  const hourPillar = hourGan + hourJi

  // 오행 분석
  const elements = [yearGan, monthGan, dayGan, hourGan]
    .map(g => CHEONGAN_ELEMENT[CHEONGAN.indexOf(g)])
  const elementsWithJi = [
    ...elements,
    JIJI_ELEMENT[yearJiIdx],
    JIJI_ELEMENT[monthJiIdx],
    JIJI_ELEMENT[dayJiIdx],
    JIJI_ELEMENT[hourJiIdx]
  ]

  const counts = {}
  for (const e of elementsWithJi) {
    counts[e] = (counts[e] || 0) + 1
  }

  const totalElements = Object.values(counts).reduce((a, b) => a + b, 0)
  const distribution = Object.fromEntries(
    Object.entries(counts).map(([k, v]) => [k, Math.round(v / totalElements * 100)])
  )

  // 부족한 오행
  const allElements = ['木', '火', '土', '金', '水']
  const missing = allElements.filter(e => !counts[e])

  const ilju = dayPillar
  const personality = DOG_PERSONALITY[dayGan] || '독특한 매력의 강아지예요!'

  return {
    yearPillar, monthPillar, dayPillar, hourPillar,
    ilju,
    personality,
    distribution,
    missing,
    elementNames: ELEMENT_NAMES,
    elementColors: ELEMENT_COLORS
  }
}
