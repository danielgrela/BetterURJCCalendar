import { defineConfig } from 'vitest/config'

// Config aparte de vite.config.ts: los tests son de lógica pura y no necesitan los plugins de React Router
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
})
