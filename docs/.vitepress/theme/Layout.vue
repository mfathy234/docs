<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vitepress'

const { Layout } = DefaultTheme
const router = useRouter()

// VitePress makes the root .VPNavBar transparent at ≥960 px.
// The visible areas are .content-body and (on sidebar pages) .title.
// Navbar is ALWAYS dark navy regardless of color mode.
// Sidebar is light in light mode and dark in dark mode — handled by CSS.
// We only force navbar + hero via JS (highest-priority inline styles).
function applyBrandColors() {
  const isDark  = document.documentElement.classList.contains('dark')
  const navGrad  = 'linear-gradient(180deg, #0F2D58 0%, #0D2545 100%)'
  const heroGrad = isDark
    ? 'linear-gradient(135deg, #07162a 0%, #0D2545 50%, #112E5A 100%)'
    : 'linear-gradient(135deg, #0a2040 0%, #0D2545 50%, #112E5A 100%)'

  // ── Navbar — always dark ─────────────────────────────────────
  document.querySelectorAll<HTMLElement>(
    '.VPNav, .VPNavBar, .VPNavBar .content-body, .VPNavBar .title'
  ).forEach(el => {
    el.style.setProperty('background', navGrad, 'important')
    el.style.setProperty('border-bottom', '1px solid rgba(34,165,200,0.15)', 'important')
  })

  // ── Sidebar — let CSS handle light/dark; clear any stale inline style ──
  document.querySelectorAll<HTMLElement>(
    '.VPSidebar, .VPSidebar .curtain'
  ).forEach(el => {
    el.style.removeProperty('background')
  })

  // ── Hero ─────────────────────────────────────────────────────
  document.querySelectorAll<HTMLElement>('.VPHero, .VPHomeHero')
    .forEach(el => el.style.setProperty('background', heroGrad, 'important'))
}

let observer: MutationObserver | null = null

onMounted(() => {
  applyBrandColors()

  // Re-apply after every SPA navigation
  router.onAfterRouteChanged = () => {
    requestAnimationFrame(applyBrandColors)
  }

  // Watch for dark/light mode toggle (VitePress toggles .dark on <html>)
  observer = new MutationObserver(() => {
    requestAnimationFrame(applyBrandColors)
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <Layout />
</template>
