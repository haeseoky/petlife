<template>
  <section class="hero">
    <div class="hero-emoji">🐶</div>
    <h1 class="hero-title">우리 댕댕이 · 냥이의 사주는?</h1>
    <p class="hero-desc">
      반려동물의 생년월일시로 알아보는 특별한 사주!
      강아지와 고양이 모두 분석해드려요
    </p>
    <div class="badges">
      <span class="badge">강아지 · 고양이</span>
      <span class="badge">사주 분석</span>
      <span class="badge">무료</span>
    </div>
  </section>
</template>

<style scoped>
.hero {
  text-align: left;
  padding: 40px 0 48px;
}
.hero-emoji {
  font-size: 1.5rem;
  margin-bottom: 12px;
  opacity: 0.8;
}
.hero-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 16px;
  line-height: 1.3;
}
.hero-desc {
  font-size: 1.05rem;
  color: var(--text-sub);
  margin-bottom: 24px;
  word-break: keep-all;
}
.badges {
  display: flex;
  gap: 12px;
}
.badge {
  background: transparent;
  color: #8E847B;
  padding: 2px 0;
  font-size: 0.85rem;
  font-weight: 500;
}
.badge:not(:last-child)::after {
  content: "·";
  margin-left: 12px;
  color: var(--border-light);
}
</style>
