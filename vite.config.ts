import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      // '/api': {
      //   target: 'https://clinic.bitnp.net',
      //   changeOrigin: true,
      //   configure: (proxy) => {
      //     proxy.on("proxyReq", (proxyReq) => {
      //       proxyReq.setHeader("origin", "https://clinic.bitnp.net")
      //     })
      //   }
      // }
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("origin", "http://127.0.0.1:5000")
          })
        }
      },
      '/manage': {
        target: 'https://clinic.bitnp.net',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.setHeader("origin", "https://clinic.bitnp.net")
          })
        }
      }
    }
  }
})
