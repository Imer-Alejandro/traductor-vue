import { fileURLToPath, URL } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      manifest: {
        name: 'traductor',
        msTileColor: '#5196CB',
        short_name: 'traductor',
        description: 'Una aplicación de traducion de texto',
        start_url: '/',
        display: 'fullscreen',
        background_color: '#5196CB',
        theme_color: '#5196CB',
        icons: [
          {
            src: "/traducir_logo.png",
            sizes: "250x250",
            type: "image/png"
          },
          {
            src: "/disenoLogo-124x124.png",
            sizes: "124x124",
            type: "image/png",
            purpose: 'maskable',
          }
        ]
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
