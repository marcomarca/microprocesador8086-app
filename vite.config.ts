import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({ mode }) => {
  const isSingleFile = mode === 'singlefile';

  return {
    base: './',
    plugins: [svelte(), ...(isSingleFile ? [viteSingleFile()] : [])],
    build: {
      sourcemap: false,
      cssCodeSplit: !isSingleFile,
      assetsInlineLimit: isSingleFile ? 100_000_000 : 4096,
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  };
});
