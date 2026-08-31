<script setup>
import { t } from '../i18n.js'

const careTips = [
  {
    category: t('autumnTempChange'),
    icon: '🍂',
    tips: [
      t('autumnWalkTip1'),
      t('autumnWalkTip2'),
      t('autumnClothing')
    ]
  },
  {
    category: t('autumnParasites'),
    icon: '🕷️',
    tips: [
      t('autumnTickPrevent'),
      t('autumnFleaPrevent'),
      t('autumnRegularCheck')
    ]
  },
  {
    category: t('autumnSkin'),
    icon: '🧴',
    tips: [
      t('autumnDrySkin'),
      t('autumnBrushing'),
      t('autumnSkinCare')
    ]
  },
  {
    category: t('autumnFood'),
    icon: '🍽️',
    tips: [
      t('autumnNutrition'),
      t('autumnWeightManage'),
      t('autumnApples')
    ]
  },
  {
    category: t('autumnExercise'),
    icon: '🏃',
    tips: [
      t('autumnWalkTime'),
      t('autumnIndoorPlay'),
      t('autumnWeatherCheck')
    ]
  },
  {
    category: t('autumnEmergency'),
    icon: '🚨',
    isEmergency: true,
    tips: [
      t('autumnEmergencyTitle') + ': ' + t('autumnEmergencySymptoms'),
      t('autumnEmergencyAction')
    ]
  }
]
</script>

<template>
  <div class="autumn-care-card">
    <div class="care-header">
      <h3>{{ t('autumnCareTitle') }}</h3>
      <p class="care-desc">{{ t('autumnCareDesc') }}</p>
    </div>

    <div class="care-tips">
      <div
        v-for="(section, idx) in careTips"
        :key="idx"
        class="tip-section"
        :class="{ emergency: section.isEmergency }"
      >
        <div class="tip-header">
          <span class="tip-icon">{{ section.icon }}</span>
          <h4 class="tip-title">{{ section.category }}</h4>
        </div>
        <ul class="tip-list">
          <li v-for="(tip, tipIdx) in section.tips" :key="tipIdx">
            {{ tip }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.autumn-care-card {
  background: var(--card-bg);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 32px 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(123, 94, 77, 0.05);
  transition: all 0.3s ease;
}

.care-header {
  margin-bottom: 28px;
  text-align: left;
}

.care-header h3 {
  font-size: 1.3rem;
  font-weight: 800;
  color: #D84315;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.care-desc {
  font-size: 0.95rem;
  color: var(--text-sub);
  line-height: 1.6;
}

.care-tips {
  display: grid;
  gap: 20px;
}

.tip-section {
  background: var(--bg-main);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
}

.tip-section.emergency {
  background: #FFF3E0;
  border-color: #FF7043;
}

.tip-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.tip-icon {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.tip-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

.tip-section.emergency .tip-title {
  color: #D84315;
}

.tip-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tip-list li {
  font-size: 0.9rem;
  color: var(--text-main);
  line-height: 1.6;
  padding-left: 16px;
  position: relative;
  word-break: keep-all;
}

.tip-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #FF7043;
  font-weight: bold;
}

.tip-section.emergency .tip-list li::before {
  color: #D84315;
  font-size: 1.2rem;
}

.tip-section.emergency .tip-list li {
  font-weight: 500;
}

/* Dark Mode Overrides */
html.dark .autumn-care-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

html.dark .tip-section {
  background: rgba(255, 255, 255, 0.03);
}

html.dark .tip-section.emergency {
  background: rgba(255, 112, 67, 0.1);
  border-color: rgba(255, 112, 67, 0.3);
}

html.dark .tip-list li {
  color: rgba(255, 255, 255, 0.9);
}

@media (max-width: 600px) {
  .autumn-care-card {
    padding: 24px 16px;
  }

  .care-header h3 {
    font-size: 1.15rem;
  }

  .care-desc {
    font-size: 0.85rem;
  }

  .tip-section {
    padding: 16px;
  }

  .tip-icon {
    font-size: 1.5rem;
  }

  .tip-title {
    font-size: 0.95rem;
  }

  .tip-list li {
    font-size: 0.85rem;
  }
}
</style>