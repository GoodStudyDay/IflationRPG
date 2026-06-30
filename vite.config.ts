import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  // 生产构建使用仓库名作为 base，dev 模式使用 /
  base: command === 'build' ? '/IflationRPG/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
}))