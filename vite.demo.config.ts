import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/motion-surveyjs-ui/', // Base path for GitHub Pages (repo name)
  build: {
    outDir: 'dist-demo',
    emptyOutDir: true,
  },
})
