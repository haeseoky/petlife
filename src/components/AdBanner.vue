<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  slot: { type: String, default: '' },
  format: { type: String, default: 'auto' },
  responsive: { type: Boolean, default: true },
  style: { type: String, default: 'display:block;min-height:90px;' }
})

const adRef = ref(null)
const pushed = ref(false)

onMounted(() => {
  if (pushed.value) return
  try {
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    pushed.value = true
  } catch (e) {
    console.warn('AdSense push failed:', e)
  }
})
</script>

<template>
  <div class="ad-container" ref="adRef">
    <ins
      class="adsbygoogle"
      :style="style"
      data-ad-client="ca-pub-6821934063903820"
      :data-ad-slot="slot"
      :data-ad-format="format"
      :data-full-width-responsive="responsive"
    />
  </div>
</template>

<style scoped>
.ad-container {
  width: 100%;
  max-width: 100%;
  margin: 16px 0;
  min-height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
</style>
