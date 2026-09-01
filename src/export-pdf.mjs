import { existsSync, mkdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import {
  findBrowser,
  marpEntry,
  printBrowserHelp,
  projectRoot,
} from './runtime.mjs'

const [inputArg, outputArg] = process.argv.slice(2)

if (!inputArg || !outputArg) {
  console.error('Usage: node src/export-pdf.mjs <input.md> <output.pdf>')
  process.exit(1)
}

const inputPath = resolve(projectRoot, inputArg)
const outputPath = resolve(projectRoot, outputArg)
const marpScript = marpEntry(projectRoot)

if (!existsSync(inputPath)) {
  console.error(`Input file not found: ${inputArg}`)
  process.exit(1)
}

if (!existsSync(marpScript)) {
  console.error('Marp CLI is missing. Reinstall the toolkit or run npm install.')
  process.exit(1)
}

const browser = findBrowser()
if (!browser) {
  printBrowserHelp()
  process.exit(1)
}

mkdirSync(dirname(outputPath), { recursive: true })
const result = spawnSync(
  process.execPath,
  [
    marpScript,
    inputPath,
    '--pdf',
    '--output',
    outputPath,
    '--browser',
    browser.kind,
    '--browser-path',
    browser.path,
  ],
  { cwd: projectRoot, stdio: 'inherit' },
)

if (result.error) console.error(result.error.message)
process.exit(result.status ?? 1)
