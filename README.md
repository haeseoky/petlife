# 🐾 PetLife

> 반려동물 사주풀이 & 종합 운세 서비스

## 🌐 서비스 URL
- **메인:** https://petlife.nutalk.co.kr
- **Pages:** https://petlife-pe7.pages.dev

## 📋 소개
반려동물의 생일을 기반으로 사주풀이, MBTI, 궁합, 운세 등 다양한 정보를 제공하는 웹 서비스입니다.

## ✨ 주요 기능
- 🏮 **Pet Zodiac** — 반려동물 띠별 성격 분석
- 🎂 **Birthday Countdown** — 생일까지 남은 날짜
- 🔮 **PetFortuneGacha** — 오늘의 운세 가챠
- 💕 **PetBalanceGame** — 반려동물 궁합 게임
- 📅 **LuckyCalendar** — 행운의 날짜 캘린더
- ⭐ **WeeklyHoroscope** — 주간 운세
- 🐶 **Pet Mood Tracker** — 반려동물 기분 추적

## 🛠 기술 스택
- **Frontend:** Vue 3 + Vite
- **배포:** Cloudflare Pages (자동 push 배포)
- **디자인:** hub-design-guide (밝은 테마)
- **i18n:** 한국어 / 영어 (313키)
- **PWA:** manifest.json + Service Worker

## 📂 구조
```
src/
├── components/     # Vue 컴포넌트
├── composables/    # useScrollNav, useShare 등
├── data/           # recipe, fortune, zodiac, saju 등
├── views/          # 페이지 뷰
└── locales/        # ko.json, en.json
```

## 📊 데이터
- 사주풀이, 운세, 궁합 등 정적 데이터 기반
- 외부 API 의존성 없음

## 🔗 관련
- **메인 허브:** https://hub.nutalk.co.kr
- **GitHub:** https://github.com/haeseoky/petlife
