import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist/extension',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/extension/background.ts'),
        manifest: resolve(__dirname, 'src/extension/manifest.json'),
        blocked: resolve(__dirname, 'src/extension/blocked.html')
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
});