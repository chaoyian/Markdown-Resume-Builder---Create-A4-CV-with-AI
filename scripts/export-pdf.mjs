import { existsSync, mkdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const [inputArg, outputArg] = process.argv.slice(2)

if (!inputArg || !outputArg) {
  console.error('Usage: node scripts/export-pdf.mjs <input.md> <output.pdf>')
  process.exit(1)
}

const inputPath = resolve(projectRoot, inputArg)
const outputPath = resolve(projectRoot, outputArg)

if (!existsSync(inputPath)) {
  console.error(`Input file not found: ${inputArg}`)
  console.error('Create a private copy with npm run init:zh or npm run init:en.')
  process.exit(1)
}

mkdirSync(dirname(outputPath), { recursive: true })

const marpExecutable = join(
  projectRoot,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'marp.cmd' : 'marp',
)

if (!existsSync(marpExecutable)) {
  console.error('Marp CLI is not installed. Run npm install first.')
  process.exit(1)
}

const result = spawnSync(
  marpExecutable,
  [inputPath, '--pdf', '--output', outputPath],
  {
    cwd: projectRoot,
    stdio: 'inherit',
  },
)

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 1)
