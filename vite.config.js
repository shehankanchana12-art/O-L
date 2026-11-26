import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const previewHost = process.env.VITE_PREVIEW_HOST

export default defineConfig({
  // සාපේක්ෂ මාර්ග — GitHub Pages වැනි උප නාමාවලියක සිට විවෘත වීමට
  base: './',
  plugins: [react()],
  build: {
    // ප්‍රකාශන ගොනුව dev.html; dist/index.html ලෙස පිටපත් වේ
    rollupOptions: { input: 'dev.html' },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    // පෙරදර්ශනය සඳහා අවසර ලත් ධාරක නාමය පමණක් එකතු කරයි
    allowedHosts: ['localhost', '127.0.0.1', ...(previewHost ? [previewHost] : [])],
  },
})
