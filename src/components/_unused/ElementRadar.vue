<script setup>
import { ref, onMounted, computed } from 'vue'
import { t } from '../i18n.js'

const props = defineProps({
  distribution: { type: Object, required: true },
  missing: { type: Array, default: () => [] }
})

const ELEMENTS = ['木', '火', '土', '金', '水']
const LABELS = {
  '木': { ko: '목', en: 'Wood' },
  '火': { ko: '화', en: 'Fire' },
  '土': { ko: '토', en: 'Earth' },
  '金': { ko: '금', en: 'Metal' },
  '水': { ko: '수', en: 'Water' }
}

const progress = ref(0)

onMounted(() => {
  requestAnimationFrame(() => {
    setTimeout(() => { progress.value = 1 }, 50)
  })
})

const W = 320, H = 320
const cx = W / 2, cy = H / 2
const R = 100

function polar(i, r) {
  const a = (i * 72 - 90) * Math.PI / 180
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

const gridLevels = [33, 66, 100]

const gridPolygons = computed(() =>
  gridLevels.map(lvl =>
    ELEMENTS.map((_, i) => {
      const { x, y } = polar(i, R * lvl / 100)
      return `${x},${y}`
    }).join(' ')
  )
)

const dataPolygon = computed(() =>
  ELEMENTS.map((el, i) => {
    const pct = props.distribution[el] || 0
    const r = R * (pct / 100) * progress.value
    const { x, y } = polar(i, r)
    return `${x},${y}`
  }).join(' ')
)

const vertexInfo = computed(() =>
  ELEMENTS.map((el, i) => {
    const pct = props.distribution[el] || 0
    const outer = polar(i, R)
    const label = polar(i, R + 36)
    return {
      el, pct,
      ox: outer.x, oy: outer.y,
      lx: label.x, ly: label.y,
      isMissing: props.missing.includes(el),
      label: LABELS[el]
    }
  })
)
</script>

<template>
  <div class="element-radar">
    <div class="radar-header">
      <h3>{{ t('elementRadarTitle') }}</h3>
      <p>{{ t('elementRadarDesc') }}</p>
    </div>

    <div class="radar-canvas">
      <svg :viewBox="`0 0 ${W} ${H}`" class="radar-svg">
        <!-- Grid polygons -->
        <polygon
          v-for="(pts, idx) in gridPolygons"
          :key="'g' + idx"
          :points="pts"
          class="grid-poly"
        />

        <!-- Axis lines -->
        <line
          v-for="v in vertexInfo"
          :key="'ax-' + v.el"
          :x1="cx" :y1="cy" :x2="v.ox" :y2="v.oy"
          class="axis-line"
        />

        <!-- Data area -->
        <polygon :points="dataPolygon" class="data-area" />

        <!-- Data dots -->
        <circle
          v-for="v in vertexInfo"
          :key="'dot-' + v.el"
          :cx="polar(ELEMENTS.indexOf(v.el), R * ((v.pct || 0) / 100) * progress).x"
          :cy="polar(ELEMENTS.indexOf(v.el), R * ((v.pct || 0) / 100) * progress).y"
          r="4"
          class="data-dot"
        />

        <!-- Labels -->
        <g v-for="v in vertexInfo" :key="'lbl-' + v.el">
          <!-- Missing indicator -->
          <circle v-if="v.isMissing" :cx="v.ox" :cy="v.oy" r="8" class="missing-ring" />

          <text :x="v.lx" :y="v.ly" text-anchor="middle" class="lbl-text">
            <tspan :x="v.lx" class="lbl-name">{{ v.label.ko }}({{ v.el }})</tspan>
            <tspan :x="v.lx" dy="1.3em" class="lbl-pct">{{ v.pct }}%</tspan>
          </text>
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.element-radar {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 32px 24px;
  margin-bottom: 24px;
}

.radar-header { margin-bottom: 16px; }
.radar-header h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 6px;
}
.radar-header p {
  font-size: 0.85rem;
  color: var(--text-sub);
}

.radar-canvas {
  display: flex;
  justify-content: center;
}
.radar-svg {
  width: 100%;
  max-width: 360px;
  height: auto;
  overflow: visible;
}

.grid-poly {
  fill: none;
  stroke: var(--border-light);
  stroke-width: 0.8;
}

.axis-line {
  stroke: var(--border-light);
  stroke-width: 0.6;
  stroke-dasharray: 3 3;
}

.data-area {
  fill: var(--primary);
  fill-opacity: 0.2;
  stroke: var(--primary);
  stroke-width: 2;
  stroke-linejoin: round;
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.data-dot {
  fill: var(--primary);
  stroke: var(--white);
  stroke-width: 1.5;
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.missing-ring {
  fill: none;
  stroke: #ef4444;
  stroke-width: 1.5;
  stroke-dasharray: 3 2;
  opacity: 0.7;
}

.lbl-text { font-family: 'Pretendard', sans-serif; pointer-events: none; }
.lbl-name {
  font-size: 12px;
  font-weight: 700;
  fill: var(--text-main);
}
.lbl-pct {
  font-size: 11px;
  font-weight: 600;
  fill: var(--primary);
}

html.dark .grid-poly { stroke: rgba(255,255,255,0.08); }
html.dark .axis-line { stroke: rgba(255,255,255,0.08); }
</style>
