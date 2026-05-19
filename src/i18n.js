import { ref, watch } from 'vue'

const messages = {
  ko: {
    appTitle: '🐾 PetLife',
    heroEmoji: '🐾',
    heroTitle: '반려동물 사주 보기',
    heroDesc: '강아지·고양이의 사주(四柱)를 재미있게 분석해드려요!',
    badges: ['사주 분석', '오행 균형', '성격 파악', '운세 체크'],
    petType: '반려동물 종류',
    dog: '강아지',
    cat: '고양이',
    nameLabel: '이름',
    namePlaceholder: '예: 초코',
    catPlaceholder: '예: 나비',
    breedLabel: '품종',
    breedDefault: '품종 선택',
    birthLabel: '생년월일',
    hourLabel: '태어난 시각',
    submitBtn: '사주 보기',
    fourPillars: '사주명식 (四柱)',
    year: '년(年)',
    month: '월(月)',
    day: '일(日)',
    hour: '시(時)',
    ilju: '일주',
    personality: '성격 분석',
    traits: '특징',
    fiveElements: '오행(五行) 분포',
    missingElements: '부족한 오행',
    walkStyle: '산책 스타일',
    catPlayStyle: '놀이 & 활동 스타일',
    foodPref: '식성 & 추천 식단',
    healthTip: '건강 관리 팁',
    compatible: '잘 맞는 일주',
    todayLuck: '오늘의 운세',
    todayIlju: '오늘 일주',
    monthlyLuck: '이달의 운세',
    monthlyEnergy: '이달의 기운',
    careTips: '맞춤 케어 팁',
    shareBtn: '결과 공유하기',
    printBtn: '저장/인쇄',
    imageBtn: '이미지 저장',
    saving: '저장 중...',
    resetBtn: '다시 보기',
    copied: '클립보드에 복사되었습니다',
    historyTitle: '저장된 사주 기록',
    historyDesc: '최대 20개까지 자동 저장됩니다',
    compatTitle: '반려동물 궁합',
    compatDesc: '다른 반려동물과의 궁합을 확인해보세요!',
    compatNameLabel: '이름',
    compatBirthLabel: '생년월일',
    compatHourLabel: '태어난 시',
    compatBtn: '궁합 보기',
    compatChecking: '확인 중...',
    compatRetry: '다시 확인',
    missingWood: '산책과 자연 접촉이 좋아요! 공원 산책을 자주 시켜주세요.',
    missingFire: '따뜻한 햇살을 좋아해요. 일광욕 시간을 충분히 주세요.',
    missingEarth: '안정적인 환경이 중요해요. 집을 편안하게 꾸며주세요.',
    missingMetal: '깔끔한 그루밍이 중요해요. 정기적으로 미용해주세요.',
    missingWater: '물과 관련된 활동을 좋아할 수 있어요. 수영을 시도해보세요!',
    balanced: '오행이 골고루 갖춰져 있어 아주 균형 잡힌 강아지예요!',
    footer: '© 2026 PetLife — 반려동물과 함께하는 행복한 삶 🐶',
    darkMode: '다크 모드',
    lightMode: '라이트 모드',
    records: '기록',
    close: '닫기',
    yearSuffix: '년',
    monthSuffix: '월',
    daySuffix: '일',
    hourSuffix: '시',
    zodiacSuffix: '띠',
    of: '의 사주',
    resultOf: '의 사주 결과'
  },
  en: {
    appTitle: '🐾 PetLife',
    heroEmoji: '🐾',
    heroTitle: 'Pet Saju Reading',
    heroDesc: 'Discover your dog or cat\'s Four Pillars of Destiny (Saju) in a fun way!',
    badges: ['Saju Analysis', 'Five Elements', 'Personality', 'Fortune'],
    petType: 'Pet Type',
    dog: 'Dog',
    cat: 'Cat',
    nameLabel: 'Name',
    namePlaceholder: 'e.g. Coco',
    catPlaceholder: 'e.g. Luna',
    breedLabel: 'Breed',
    breedDefault: 'Select breed',
    birthLabel: 'Date of Birth',
    hourLabel: 'Time of Birth',
    submitBtn: 'Read Saju',
    fourPillars: 'Four Pillars (四柱)',
    year: 'Year (年)',
    month: 'Month (月)',
    day: 'Day (日)',
    hour: 'Hour (時)',
    ilju: 'Day Master',
    personality: 'Personality Analysis',
    traits: 'Traits',
    fiveElements: 'Five Elements (五行)',
    missingElements: 'Missing Elements',
    walkStyle: 'Walk Style',
    catPlayStyle: 'Play & Activity Style',
    foodPref: 'Diet & Food Tips',
    healthTip: 'Health Care Tips',
    compatible: 'Compatible Day Masters',
    todayLuck: 'Today\'s Fortune',
    todayIlju: 'Today\'s Day Master',
    monthlyLuck: 'Monthly Fortune',
    monthlyEnergy: 'This Month\'s Energy',
    careTips: 'Personalized Care Tips',
    shareBtn: 'Share Result',
    printBtn: 'Save/Print',
    imageBtn: 'Save Image',
    saving: 'Saving...',
    resetBtn: 'Start Over',
    copied: 'Copied to clipboard',
    historyTitle: 'Saved Saju Records',
    historyDesc: 'Up to 20 records saved automatically',
    compatTitle: 'Pet Compatibility',
    compatDesc: 'Check compatibility with another pet!',
    compatNameLabel: 'Name',
    compatBirthLabel: 'Date of Birth',
    compatHourLabel: 'Time of Birth',
    compatBtn: 'Check Compatibility',
    compatChecking: 'Checking...',
    compatRetry: 'Try Again',
    missingWood: 'Loves nature walks! Take them to the park often.',
    missingFire: 'Enjoys warm sunshine. Give plenty of sunbathing time.',
    missingEarth: 'A stable environment matters. Make home cozy.',
    missingMetal: 'Grooming is important. Regular grooming recommended.',
    missingWater: 'May enjoy water activities. Try swimming!',
    balanced: 'All five elements are balanced — a very well-rounded pet!',
    footer: '© 2026 PetLife — Happy life with your pet 🐶',
    darkMode: 'Light Mode',
    lightMode: 'Dark Mode',
    records: 'Records',
    close: 'Close',
    yearSuffix: '',
    monthSuffix: '',
    daySuffix: '',
    hourSuffix: '',
    zodiacSuffix: '',
    of: '\'s Saju',
    resultOf: '\'s Saju Result'
  }
}

const STORAGE_KEY = 'petlife_lang'
const currentLang = ref(loadLang())

function loadLang() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && messages[saved]) return saved
  const nav = navigator.language || 'ko'
  return nav.startsWith('ko') ? 'ko' : 'en'
}

function setLang(lang) {
  currentLang.value = lang
  localStorage.setItem(STORAGE_KEY, lang)
}

function toggleLang() {
  setLang(currentLang.value === 'ko' ? 'en' : 'ko')
}

function t(key) {
  return messages[currentLang.value]?.[key] || messages.ko[key] || key
}

export { currentLang, setLang, toggleLang, t }
