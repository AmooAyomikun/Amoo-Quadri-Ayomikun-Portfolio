#!/usr/bin/env node
/**
 * check-confirms.mjs
 * PRD §13: "The production build must fail if any [CONFIRM] marker remains."
 *
 * Scans all .ts, .tsx, .css, .md files under src/ and content/.
 * Exits 1 if any [CONFIRM: …] marker is found, printing the file and line.
 */

import { readdir, readFile } from 'fs/promises'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT = join(__dirname, '..')

const SCAN_DIRS = ['src', 'content']
const EXTENSIONS = new Set(['.ts', '.tsx', '.css', '.md', '.json'])
const CONFIRM_RE = /\[CONFIRM:/g

/** Recursively collect all files under a directory */
async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(full)))
    } else if (EXTENSIONS.has(extname(entry.name))) {
      files.push(full)
    }
  }
  return files
}

async function main() {
  let violations = 0

  for (const scanDir of SCAN_DIRS) {
    const dir = join(ROOT, scanDir)
    let files
    try {
      files = await collectFiles(dir)
    } catch {
      // Directory may not exist yet during early phases — skip silently
      continue
    }

    for (const file of files) {
      const content = await readFile(file, 'utf8')
      const lines = content.split('\n')
      lines.forEach((line, idx) => {
        if (CONFIRM_RE.test(line)) {
          const rel = file.replace(ROOT + '\\', '').replace(ROOT + '/', '')
          console.error(`[CONFIRM found] ${rel}:${idx + 1}  →  ${line.trim()}`)
          violations++
        }
        CONFIRM_RE.lastIndex = 0 // reset stateful regex
      })
    }
  }

  if (violations > 0) {
    console.error(
      `\n✖  Build blocked: ${violations} [CONFIRM] marker${violations === 1 ? '' : 's'} must be resolved before production build.\n`,
    )
    process.exit(1)
  } else {
    console.log('✓  No [CONFIRM] markers found — build may proceed.')
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
