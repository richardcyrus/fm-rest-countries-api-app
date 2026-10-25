/// <reference types="vite-plus" />
/// <reference types="vite-plus/client" />
import react from '@vitejs/plugin-react'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, lazyPlugins } from 'vite-plus'

// Sent by Vercel in production; the dev server sets its own further down.
// `continue: true` is required: without it Vercel stops routing at this match
// and never reaches the function. (Nitro's `routeRules` headers omit it, so
// they cannot be used here.) No CSP: pages load the CSS reset, fonts and flag
// images from other origins.
const SECURITY_HEADER_ROUTES = [
  {
    src: '/(.*)',
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'same-origin',
    },
    continue: true,
  },
]

// https://vitejs.dev/config/
export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    arrowParens: 'always',
    embeddedLanguageFormatting: 'auto',
    htmlWhitespaceSensitivity: 'css',
    bracketSameLine: false,
    jsxSingleQuote: false,
    proseWrap: 'preserve',
    quoteProps: 'as-needed',
    semi: false,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'es5',
    useTabs: false,
    printWidth: 80,
    sortPackageJson: false,
    ignorePatterns: [
      'dist',
      'src/routeTree.gen.ts',
      '.next',
      '.idea',
      '.nova',
      '.vscode',
      'node_modules/',
      'yarn.lock',
      'package-lock.json',
      'pnpm-lock.yaml',
    ],
  },
  // The Start and Nitro plugins reshape SSR module resolution, which breaks
  // Vitest's node environment, so they are left out when running tests.
  plugins: lazyPlugins(() =>
    process.env.VITEST
      ? [react()]
      : [
          tanstackStart(),
          nitro({
            vercel: { config: { version: 3, routes: SECURITY_HEADER_ROUTES } },
          }),
          react(),
        ]
  ),
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
    tsconfigPaths: true,
  },
  css: {
    modules: {
      generateScopedName: '[local]_[hash:base64:5]',
      localsConvention: 'camelCase',
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    watch: false,
  },
  server: {
    headers: {
      'X-XSS-Protection': '1; mode=block',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'same-origin',
    },
  },
})
// vp migrate: pending .oxlintrc.json.
