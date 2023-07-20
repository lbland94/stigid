import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: '/ui',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/scss/_globalIncludes.scss";
        `,
        sassOptions: {
          includePaths: ['./node_modules'],
        },
      },
    },
  },
  build: {
    emptyOutDir: true,
    outDir: '../dist/ui',
  },
});
