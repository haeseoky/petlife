import HomeView from './views/HomeView.vue'

const meta = {
  home: {
    title: 'PetLife — 반려동물 사주풀이 · 강아지 고양이 운세 🐾',
    description: '무료 반려동물 사주풀이 서비스. 강아지·고양이의 생년월일시로 성격 분석, 오늘의 운세, 궁합, MBTI, 주간 운세까지. PetLife에서 우리 아이의 사주를 확인해보세요!'
  },
  draw: {
    title: '밸런스 게임 — PetLife',
    description: '반려동물 관련 재미있는 밸런스 게임으로 우리 아이에 대해 더 알아가세요. PetLife 밸런스 게임.'
  },
  memory: {
    title: '기분 트래커 — PetLife',
    description: '매일 반려동물의 기분을 기록하고 변화를 추적하세요. PetLife 기분 트래커로 우리 아이의 감정을 파악해보세요.'
  },
  color: {
    title: '색상 퀴즈 — PetLife',
    description: '반려동물 색상 퀴즈로 우리 아이의 성향을 알아보세요. PetLife 컬러 테스트.'
  },
  reaction: {
    title: '리액션 테스트 — PetLife',
    description: '반려동물의 리액션 속도를 측정해보세요. PetLife 리액션 테스트 게임.'
  }
}

export default [
  { path: '/', name: 'home', component: HomeView, meta: meta.home },
  { path: '/draw', name: 'draw', component: () => import('./views/DrawView.vue'), meta: meta.draw },
  { path: '/memory', name: 'memory', component: () => import('./views/MemoryView.vue'), meta: meta.memory },
  { path: '/color', name: 'color', component: () => import('./views/ColorView.vue'), meta: meta.color },
  { path: '/reaction', name: 'reaction', component: () => import('./views/ReactionView.vue'), meta: meta.reaction },
]
