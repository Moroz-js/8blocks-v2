import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

// Тесты импортируют модули по тем же алиасам, что и приложение (tsconfig paths);
// vitest их сам не читает, поэтому дублируем здесь.
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@payload-config',
        replacement: fileURLToPath(new URL('./payload.config.ts', import.meta.url)),
      },
      { find: /^@\//, replacement: `${fileURLToPath(new URL('./src', import.meta.url))}/` },
    ],
  },
})
