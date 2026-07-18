<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main id="main-content" class="app">
    <router-view />
  </main>
</template>

<style>
:root {
  --primary: #7B5E4D;
  --primary-light: #F8F5F2;
  --text-main: #2C2C2C;
  --text-sub: #666666;
  --border-light: #E5E1DA;
  --bg-main: #FDFCFB;
  --white: #FFFFFF;
  --card-bg: #FFFFFF;
  --bar-bg: #F0EDE9;
  --missing-bg: #FFF9F0;
  --missing-text: #A37B45;
  --compat-bg: #F0F7FF;
  --compat-text: #3B82F6;
  --tip-border: #F8F7F5;
  --toast-bg: #2C2C2C;
  --placeholder: #CCC6C0;
}

html.dark {
  --primary: #C4A882;
  --primary-light: #2A2420;
  --text-main: #E8E2DC;
  --text-sub: #A89E96;
  --border-light: #3A3430;
  --bg-main: #1A1714;
  --white: #242018;
  --card-bg: #242018;
  --bar-bg: #3A3430;
  --missing-bg: #2E2518;
  --missing-text: #C4A882;
  --compat-bg: #1E2A3A;
  --compat-text: #6BA3F7;
  --tip-border: #3A3430;
  --toast-bg: #E8E2DC;
  --placeholder: #5A524A;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--bg-main);
  color: var(--text-main);
  line-height: 1.6;
  letter-spacing: -0.01em;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.app {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

button {
  font-family: inherit;
  transition: all 0.2s ease;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

input, select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* 스킵 링크 */
.skip-link {
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary);
  color: white;
  padding: 10px 20px;
  z-index: 1000;
  font-size: 0.9rem;
  border-radius: 0 0 8px 8px;
  text-decoration: none;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: top 0.2s ease;
}
.skip-link:focus {
  top: 0;
  outline: 2px solid white;
  outline-offset: 2px;
}

/* 인쇄 스타일 */
@media print {
  body {
    background: white !important;
    color: #2C2C2C !important;
  }
  .header, .footer, .btn-group, .share-toast, .dark-toggle, .history-toggle {
    display: none !important;
  }
  .app {
    max-width: 100% !important;
    padding: 0 !important;
  }
  .pillar-card, .personality-card, .element-card, .detail-card, .luck-card, .tips-card {
    break-inside: avoid;
    border-color: #ddd !important;
    background: white !important;
  }
  .result-title {
    font-size: 1.5rem !important;
  }
  .personality-title {
    color: #7B5E4D !important;
  }
  .pillar-value {
    color: #7B5E4D !important;
  }
  .trait-tag {
    background: #f5f0eb !important;
    color: #7B5E4D !important;
  }
  .compat-tag {
    background: #f0f5ff !important;
    color: #3B82F6 !important;
  }
  .bar-fill {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
</style>
