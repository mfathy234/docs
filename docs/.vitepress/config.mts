import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import fs from 'fs'
import path from 'path'

// ─── Sidebar Generator ────────────────────────────────────────────────────────

function prettifyName(name: string): string {
  return name
    .replace(/\.md$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

function generateSidebar() {
  // process.cwd() is always the project root (where `npm run dev` is run from).
  // __dirname can point to a Vite temp dir when config.mts is compiled, so we
  // avoid it here.
  const docsDir = path.join(process.cwd(), 'docs')
  const entries = fs.readdirSync(docsDir, { withFileTypes: true })
    .filter(e => !e.name.startsWith('.'))
    .sort((a, b) => {
      // Directories at the bottom
      if (a.isDirectory() && !b.isDirectory()) return 1
      if (!a.isDirectory() && b.isDirectory()) return -1
      return a.name.localeCompare(b.name)
    })

  const rootItems: any[] = []
  const groups: any[] = []

  for (const entry of entries) {
    if (entry.name === 'index.md') continue

    if (entry.isDirectory()) {
      const subDir = path.join(docsDir, entry.name)
      const subFiles = fs.readdirSync(subDir, { withFileTypes: true })
        .filter(f => f.isFile() && f.name.endsWith('.md'))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(f => ({
          text: prettifyName(f.name),
          link: `/${entry.name}/${f.name.replace(/\.md$/, '')}`
        }))

      if (subFiles.length > 0) {
        groups.push({
          text: prettifyName(entry.name),
          collapsed: false,
          items: subFiles
        })
      }
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      rootItems.push({
        text: prettifyName(entry.name),
        link: `/${entry.name.replace(/\.md$/, '')}`
      })
    }
  }

  return [...rootItems, ...groups]
}

// ─── VitePress Config ─────────────────────────────────────────────────────────

export default withMermaid(
  defineConfig({
    title: 'Microtec Docs',
    description: 'Internal architecture guides, token designs, and system references.',

    base: '/docs/',

    // Suppress dead links from .md files that reference code-repo files (READMEs, etc.)
    ignoreDeadLinks: true,

    vue: {
      template: {
        compilerOptions: {
          // Treat <details> and <summary> as custom elements so Vue's strict
          // HTML5 parser doesn't enforce nesting rules that break wiki-imported files.
          isCustomElement: (tag) => tag === 'details' || tag === 'summary',
        },
      },
    },

    head: [
      ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon-192.png' }],
      ['link', { rel: 'apple-touch-icon', sizes: '192x192', href: '/favicon-192.png' }],
      ['meta', { name: 'theme-color', content: '#04172D' }],
      ['meta', { name: 'og:type', content: 'website' }],
      ['meta', { name: 'og:title', content: 'Microtec Developer Documentation' }],

      // Inline critical overrides — injected AFTER all <link> stylesheets by VitePress,
      // so they win over Vite dev-mode SFC style injection order issues.
      ['style', {}, `
        /* Nav bar — all states including .top (scroll=0) and .has-sidebar */
        .VPNav,
        .VPNavBar,
        .VPNavBar.top,
        .VPNavBar.home,
        .VPNavBar.has-sidebar,
        .VPNavBar.has-sidebar.top { background-color: #04172D !important; }
        .VPNavBar .divider-line { background-color: rgba(26,144,176,0.18) !important; }
        .VPNavBar::before { background-color: transparent !important; }
      `],
    ],

    themeConfig: {
      siteTitle: 'Microtec Docs',
      logo: '/favicon-192.png',

      nav: [
        { text: 'Home', link: '/' },
        {
          text: 'Polaris Systems',
          items: [
            { text: 'Overview', link: '/Polaris-Systems' },
            { text: 'HR Modules', link: '/Polaris-Systems/HR-Modules' },
            { text: 'Personnel API Reference', link: '/Polaris-Systems/HR-Modules/Personnel-Module/API-Reference' },
            { text: 'Agile Ceremonies', link: '/Polaris-Systems/Agile-Cermonies' },
            { text: 'Protocol of Engagement', link: '/Polaris-Systems/Protocol-of-Engagment' },
            { text: 'Protocol of Quality', link: '/Polaris-Systems/Protocol-Of-Quality' },
          ]
        },
        {
          text: 'Microtec',
          items: [
            { text: 'Company Overview', link: '/Microtec/001-Company-Overview' },
            { text: 'Common Processes', link: '/Microtec/002-Common-Processes' },
            { text: 'Teams & Departments', link: '/Microtec/003-Teams-and-Departments' },
            { text: 'Tools & Frameworks', link: '/Microtec/004-Tools-and-Frameworks' },
          ]
        },
        {
          text: 'Architecture',
          items: [
            { text: 'Saga Architecture', link: '/saga-architecture-complete-guide' },
            { text: 'Data Transfer', link: '/DataTransfer/ARCHITECTURE' },
            { text: 'Authorization Tokens', link: '/Authorization-Token-Design' },
            { text: 'Idempotency Fixes', link: '/saga-idempotency-fixes-required' },
          ]
        },
        {
          text: 'Solution Docs',
          items: [
            { text: 'Solution Architecture', link: '/Solution-Documentation/Solution-Architecture' },
            { text: 'Solution Design', link: '/Solution-Documentation/Solution-Design' },
            { text: 'Sales Invoice', link: '/Solution-Documentation/Sales-Invoice-Documentation' },
            { text: 'Purchase Invoice', link: '/Solution-Documentation/Purchase-Invoice-Documentation' },
            { text: 'ZATCA Sending Flow', link: '/Solution-Documentation/Zatca-Sending-flow' },
            { text: 'Idempotency Spec', link: '/Solution-Documentation/Idempotency-Implementation-Specification' },
          ]
        },
        {
          text: 'POS',
          items: [
            { text: 'Architecture', link: '/Pos/ARCHITECTURE' },
            { text: 'App Specifications', link: '/Pos/APP_SPECIFICATIONS' },
            { text: 'Developer Guide', link: '/Pos/DEVELOPER_GUIDE' },
            { text: 'State Management', link: '/Pos/STATE_MANAGEMENT' },
            { text: 'Data Persistence', link: '/Pos/DATA_PERSISTENCE' },
            { text: 'Sync Strategy', link: '/Pos/SYNC_STRATEGY' },
            { text: 'Hardware Integration', link: '/Pos/HARDWARE_INTEGRATION' },
            { text: 'Build & Deployment', link: '/Pos/BUILD_DEPLOYMENT' },
          ]
        },
        {
          text: 'ERP',
          items: [
            { text: 'Technical Overview', link: '/Erp/technical' },
            { text: 'Business Logic', link: '/Erp/business' },
            { text: 'Code Specifications', link: '/Erp/code_specs' },
          ]
        },
        {
          text: 'Processes',
          items: [
            { text: 'Business Process Cycle', link: '/Business-Process-Cycle' },
            { text: 'Kanban Workflow', link: '/Kanban-Workflow' },
            { text: 'Definition of Done', link: '/Definition-of-Done-Feature-Based-Delivery-Process' },
            { text: 'What is Scrum?', link: '/What-is-Scrum' },
            { text: 'The 4 Core Values of Agile', link: '/The-4-Core-Values-of-Agile' },
          ]
        },
        {
          text: 'Recruitment',
          items: [
            { text: 'Sr. Frontend Interview', link: '/Recuritment/Senior-Frontend-Angular-Engineer-interview' },
            { text: 'Sr. Frontend Scoring', link: '/Recuritment/Senior-Frontend-Angular-Engineer-scoring-system' },
            { text: 'Quality Engineers', link: '/Recuritment/Quality-Engineers' },
          ]
        },
        {
          text: 'Resources',
          items: [
            { text: 'FAQ', link: '/Frequently-Asked-Questions-FAQ' },
            { text: 'Training & Tutorials', link: '/Training-and-Tutorials' },
            { text: 'Server Deployment', link: '/Server-Deployment' },
            { text: 'Shared Packages', link: '/Shared-Packages' },
            { text: 'Sequence Diagrams', link: '/Sequence-Diagrams' },
          ]
        },
      ],

      sidebar: generateSidebar(),

      socialLinks: [],

      footer: {
        message: 'Internal Documentation — Microtec',
      },

      search: {
        provider: 'local'
      },

      outline: {
        level: [2, 3],
        label: 'On this page'
      },
    },

    markdown: {
      lineNumbers: false,
      config: (md) => {
        // Azure DevOps wiki files use raw <details> HTML with blank lines inside.
        // markdown-it splits type-6 HTML blocks at blank lines, so the <div> that
        // opens on one line and closes later is treated as separate blocks —
        // leaving an unclosed element that Vue's compiler rejects.
        //
        // Fix: run a core rule AFTER 'normalize' but BEFORE 'block' (the step
        // that runs html_block tokenization). Modifying state.src here means
        // the block tokenizer sees no blank lines inside <details>…</details>,
        // so the entire section becomes one continuous HTML block.
        md.core.ruler.after('normalize', 'fix-details-blank-lines', (state) => {
          if (!state.src.includes('<details')) return
          state.src = state.src.replace(
            /<details[\s\S]*?<\/details\s*>/g,
            (match) => match.replace(/(\r?\n)([ \t]*)\r?\n/g, '$1')
          )
        })
      },
    },

    mermaid: {
      // Mermaid config options
    },

    mermaidPlugin: {
      class: 'mermaid-diagram',
    },
  })
)
