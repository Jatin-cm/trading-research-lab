import { copyFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const indexPath = resolve(rootDir, 'dist', 'index.html')
const notFoundPath = resolve(rootDir, 'dist', '404.html')

if (existsSync(indexPath)) {
  copyFileSync(indexPath, notFoundPath)
  console.log('✓ SPA Routing: dist/404.html successfully generated from dist/index.html for GitHub Pages')
} else {
  console.warn('⚠️ Warning: dist/index.html not found; skipping 404.html copy')
}
