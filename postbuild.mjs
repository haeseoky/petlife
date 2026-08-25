// Post-build: fix HTML lang attribute (cross-platform)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dist = 'dist'
for (const f of readdirSync(dist)) {
  if (!f.endsWith('.html')) continue
  const p = join(dist, f)
  const c = readFileSync(p, 'utf8')
  const n = c.replace('<html lang="en"', '<html lang="ko"')
  if (n !== c) {
    writeFileSync(p, n)
    console.log(`Fixed lang attribute: ${f}`)
  }
}
