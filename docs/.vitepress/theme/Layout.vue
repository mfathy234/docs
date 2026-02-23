<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const { Layout } = DefaultTheme
const router = useRouter()

function applyBrandColors() {
  document.querySelectorAll('.VPSidebar, .VPSidebar .curtain, .VPSidebar .nav').forEach((el) => {
    (el as HTMLElement).style.setProperty('background-color', '#04172D', 'important')
  })
  document.querySelectorAll('.VPNav, .VPNavBar').forEach((el) => {
    (el as HTMLElement).style.setProperty('background-color', '#04172D', 'important')
    ;(el as HTMLElement).style.setProperty('border-bottom', '1px solid rgba(26,144,176,0.18)', 'important')
  })
}

onMounted(() => {
  applyBrandColors()
  router.onAfterRouteChanged = () => applyBrandColors()
})
</script>

<template>
  <Layout />
</template>
