import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

function resolveBasePath() {
  const explicitBase = process.env.VITE_BASE_PATH
  if (explicitBase) {
    return explicitBase.endsWith('/') ? explicitBase : `${explicitBase}/`
  }

  const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]
  if (process.env.GITHUB_ACTIONS === 'true' && repository) {
    return `/${repository}/`
  }

  return '/'
}

export default defineConfig({
  base: resolveBasePath(),
  plugins: [vue()],
  cacheDir: '.vite-cache',
  build: {
    emptyOutDir: false,
  },
})
