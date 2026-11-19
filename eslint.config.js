import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.claude', '.react-router']),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
  {
    // Exportaciones de módulo de ruta que React Router entiende (no son componentes)
    rules: {
      'react-refresh/only-export-components': ['warn', {
        allowConstantExport: true,
        allowExportNames: ['meta', 'links', 'headers', 'loader', 'clientLoader', 'action', 'Layout', 'HydrateFallback', 'ErrorBoundary'],
      }],
    },
  },
  {
    // Configuración que se ejecuta en Node durante el build
    files: ['react-router.config.js', 'vite.config.ts'],
    languageOptions: { globals: globals.node },
  },
])
