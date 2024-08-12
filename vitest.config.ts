import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    extensions: ['.ts', '.js'],
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['./packages/**/__test__/*.test.ts'],
  },
})



