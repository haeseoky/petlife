# PetLife 개선 백로그

> nutalk.co.kr — 반려동물 사주풀이 · 강아지 고양이 운세
> 우선순위: 🔴 높음 / 🟡 보통 / 🟢 낮음
> 상태: ⬜ 미시작 / 🔧 진행 중 / ✅ 완료

---

## 🔴 높음 (High)

### 1. ⬜ vite-ssg 빌드 안정화 및 CI/CD 구축
- **설명:** `vite-ssg build` 사용 중이나 배포 파이프라인 불명확
- **방법:** Cloudflare Pages 또는 Netlify에 CI/CD 연결, 빌드 실패 모니터링
- **현재:** 수동 빌드/배포로 추정
- **기대효과:** 자동 배포, 다운타임 제거

### 2. ⬜ 외부 CDN 의존도 감소 — 자체 호스팅
- **설명:** html2canvas, Kakao SDK, Pretendard 폰트를 CDN에서 로드 중
- **방법:** npm 패키지로 설치 후 번들에 포함, 또는 self-host
- **현재:** CDN 3개 (`cdn.jsdelivr.net`, `t1.kakaocdn.net`, `pagead2.googlesyndication.com`)
- **기대효과:** FCP 개선, CDN 장애 대응, CSP 정책 강화

### 3. ⬜ 사주 콘텐츠 SEO 랜딩 페이지 추가
- **설명:** 검색 유입을 위한 개별 콘텐츠 페이지 부재
- **방법:** `/dog-saju`, `/cat-saju`, `/pet-mbti`, `/compatibility` 등 정적 SSG 페이지 생성
- **현재:** public/에 가이드 HTML 있으나 라우트 연동 없음
- **기대효과:** 롱테일 검색 트래픽 유입 증가

### 4. ⬜ 반려동물 프로필 저장 기능 고도화
- **설명:** 현재 localStorage 임시 기록만 가능, 프로필 영구 저장 부재
- **방법:** IndexedDB 또는 Supabase 연동으로 계정 기반 프로필 관리
- **현재:** localStorage `petlife_history` 최대 20개, 기기 종속
- **기대효과:** 재방문율 향상, 개인화된 운세 추천

### 5. ⬜ Google Analytics / Search Console 연동
- **설명:** 사용자 행동 분석 및 검색 성과 추적 부재
- **방법:** GA4 이벤트 추적 (사주 조회, 공유, 게임 클릭), Search Console 사이트맵 제출
- **현재:** sitemap.xml은 있으나 분석 도구 미연동
- **기대효과:** 데이터 기반 UX 개선, 검색 노출 모니터링

---

## 🟡 보통 (Medium)

### 6. ⬜ 다국어(i18n) 확장 — 中文/日本語
- **설명:** 현재 ko/en만 지원, 중국어/일본어 추가
- **방법:** `i18n.js` messages 객체에 zh/ja 추가, saju.js 결과 번역
- **현재:** ko/en 2개국어 완벽 지원
- **기대효과:** 동아시아 시장 진출

### 7. ⬜ 사주 결과 공유 이미지 동적 생성
- **설명:** html2canvas로 클라이언트에서 생성 → 서버 사이드 렌더링으로 전환
- **방법:** Cloudflare Worker 또는 Vercel OG Image API로 동적 OG 이미지
- **현재:** html2canvas 클라이언트 렌더링 (모바일 느림)
- **기대효과:** 공유 속도 5배 향상, 일관된 품질

### 8. ⬜ 게임 허브 통합 개선
- **설명:** game.nutalk.co.kr 서브도메인 게임을 petlife 내에 통합 또는 개선
- **방법:** Vue Router 게임 라우트 추가 (이미 `/draw`, `/memory` 등 존재)
- **현재:** 외부 링크로 연결, 내부 라우트도 일부 존재 (ColorView, DrawView 등)
- **기대효과:** 이탈률 감소, 체류 시간 증가

### 9. ⬜ 접근성(a11y) 감사 및 개선
- **설명:** 스크린 리더, 키보드 내비게이션 점검
- **방법:** Lighthouse a11y 감사, ARIA 라벨 보완, 색 대비 검사
- **현재:** skip-link, aria-label 일부 적용, 인쇄 스타일 있음
- **기대효과:** 웹 접근성 품질 인증 대응

### 10. ⬜ AdSense 수익 최적화
- **설명:** 광고 배치 및 포맷 최적화
- **방법:** AdBanner.vue 배치 A/B 테스트, Core Web Vitals 영향 측정
- **현재:** AdSense 1개 배너만 운영
- **기대효과:** 수익 증대, 사용자 경험 유지

### 11. ⬜ PWA Service Worker 업데이트
- **설명:** 기존 sw.js가 단순 캐시만 수행, 고급 캐싱 전략 필요
- **방법:** Workbox 통합, stale-while-revalidate, 백그라운드 동기화
- **현재:** 기본 sw.js + manifest.json 존재
- **기대효과:** 오프라인 사주 조회 가능

---

## 🟢 낮음 (Low)

### 12. ⬜ 다크모드 자동 전환 개선
- **설명:** 시스템 설정 변경 시 실시간 반영
- **방법:** `matchMedia.addEventListener('change', ...)` 적용
- **현재:** 초기 로드 시만 감지, 이후 수동 토글
- **기대효과:** 자연스러운 테마 전환

### 13. ⬜ 추가 반려동물 종 지원
- **설명:** 토끼, 햄스터, 새, 파충류 등 사주 지원
- **방법:** saju.js에 다른 동물 오행 해석 추가
- **현재:** 강아지/고양이만 지원
- **기대효과:** 소유자층 확장

### 14. ⬜ 커뮤니티 기능
- **설명:** 반려동물 사후기 공유 게시판
- **방법:** 댓글 시스템 (Giscus/Disqus) 또는 자체 API
- **기대효과:** 사용자 참여도 및 UGC 증가

### 15. ⬜ 정기 콘텐츠 발행
- **설명:** 월간 반려동물 운세 캘린더, 별자리 운세 등
- **방법:** LuckyCalendar.vue 데이터 자동화, RSS/블로그 연동
- **기대효과:** 재방문 동기, 신선한 콘텐츠

### 16. ⬜ Lighthouse 90+ 달성
- **설명:** 성능 점수 최적화
- **방법:** 번들 크기 분석, 이미지 최적화, lazy loading
- **기대효과:** 검색 순위 및 UX 개선

---

## 완료됨 (Done)

### ✅ 핵심 기능
- 사주풀이 (사주팔자, 오행 분포, 일주 분석)
- 강아지/고양이 10천간별 상세 성격 분석 (산책, 식성, 건강팁)
- 반려동물 MBTI 16유형 분석
- 궁합 분석 (점수, 관계, 팁)
- 오늘의 운세 + 주간 운세 (7일)
- 행운의 캘린더, 풍수 가이드
- 럭키 네임 추천, 행운의 아이템

### ✅ 인터랙티브 기능
- 반려동물 기분 트래커 (streak 기록)
- 운세 가챠 캡슐 (일 1회)
- 밸런스 게임 (20문항)
- 소원권 생성
- 일일 미션 (오행 기반)
- 타로 카드 뽑기
- 생일 카운트다운
- 기록 관리 (localStorage 20개)

### ✅ UI/UX
- 다크모드 / 라이트모드 토글
- 한국어 / 영어 i18n
- Pretendard 폰트 적용
- 인쇄 최적화 스타일
- 접근성 skip-link

### ✅ SEO / 공유
- Open Graph / Twitter Card 메타
- JSON-LD 구조화된 데이터 (WebApplication)
- noscript 크롤러 대응 폴백
- sitemap.xml, robots.txt
- Kakao 공유, 이미지 저장 (html2canvas)

### ✅ 인프라
- PWA manifest.json, icon, sw.js
- Vite SSG 빌드
- AdSense 연동
- 정적 가이드 페이지 (dog-saju, cat-saju, pet-mbti 등)

---

_최종 업데이트: 2026-07-01_
