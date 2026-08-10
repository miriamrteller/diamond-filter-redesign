import { readFileSync, writeFileSync, readdirSync } from 'fs'
let html = readFileSync('dist/index.html', 'utf8')
for (const f of readdirSync('dist/assets')) {
  const c = readFileSync(`dist/assets/${f}`, 'utf8')
  if (f.endsWith('.js')) html = html.replace(/<script type="module"[^>]*><\/script>/, () => `<script type="module">${c}</script>`)
  else if (f.endsWith('.css')) html = html.replace(/<link rel="stylesheet"[^>]*>/, () => `<style>${c}</style>`)
}
import { execSync } from 'child_process'
writeFileSync('demo-single.html', html)
const style = html.match(/<style>[\s\S]*?<\/style>/)[0]
const script = html.match(/<script type="module">[\s\S]*?<\/script>/)[0]
writeFileSync('artifact.html', '<title>Diamond Filter Redesign — Interactive Case Study</title>\n' + style + '\n<div id="root"></div>\n' + script)
console.log('ok')
