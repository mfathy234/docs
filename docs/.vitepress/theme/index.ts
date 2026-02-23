import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // Mermaid is handled by vitepress-plugin-mermaid via withMermaid() in config.mts
  }
} satisfies Theme
