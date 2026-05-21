# PetLife 🐾

반려동물 사주풀이 웹 서비스 — 반려동물의 생일로 사주를 풀어보는 싱글 페이지 애플리케이션.

## 배포

- **도메인:** [nutalk.co.kr](https://nutalk.co.kr)
- **호스팅:** Cloudflare Pages (자동 배포: `main` 브랜치 push 시)
- **프로젝트명:** petlife

## 기술 스택

- Vue 3 + Vite
- 순수 CSS (프레임워크 없음)
- PWA (서비스 워커, 오프라인 캐싱)

## 주요 기능

| 컴포넌트 | 설명 |
|---|---|
| SajuForm | 반려동물 이름/생일 입력 |
| SajuResult | 사주 결과 표시 |
| PetZodiac | 띠별 운세 |
| PetMBTI | 반려동물 MBTI 성격 분석 |
| PetBalanceGame | 밸런스 게임 |
| PetFortuneGacha | 운세 가챠 |
| PetMoodTracker | 기분 트래커 |
| PetLuckyFood | 오늘의 추천 메뉴 |
| LuckyCalendar | 행운 캘린더 |
| WeeklyHoroscope | 주간 운세 |
| BirthdayCountdown | 생일 카운트다운 |
| CompatSection | 궁합 분석 |
| FengShuiGuide | 풍수 가이드 |
| HeroSection | 메인 히어로 영역 |
| HistoryList | 결과 히스토리 |
| AdBanner | AdSense 광고 배너 |

## 개발

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 미리보기
```

## 광고

- Google AdSense 적용 (ca-pub-6821934063903820)
- 슬롯 3개: Top / Mid / Bottom

## SEO

- robots.txt, sitemap.xml
- JSON-LD 구조화 데이터
- Open Graph 메타태그
- canonical URL
