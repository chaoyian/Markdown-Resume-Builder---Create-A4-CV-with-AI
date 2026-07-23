import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const resumePath = resolve(projectRoot, 'resume.md')

if (!existsSync(resumePath)) {
  console.error('resume.md not found.')
  console.error('Run npm run init:zh or npm run init:en first.')
  process.exit(1)
}

const terminal = createInterface({
  input: process.stdin,
  output: process.stdout,
})

const purpose = await terminal.question(
  'Purpose / 用途 (default: resume): ',
)
terminal.close()

const safePurpose =
  purpose
    .normalize('NFKC')
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-')
    .replace(/\s+/g, '_')
    .replace(/^\.+|\.+$/g, '') || 'resume'

const now = new Date()
const pad = (value) => String(value).padStart(2, '0')
const timestamp = [
  now.getFullYear(),
  '-',
  pad(now.getMonth() + 1),
  '-',
  pad(now.getDate()),
  '_',
  pad(now.getHours()),
  '-',
  pad(now.getMinutes()),
  '-',
  pad(now.getSeconds()),
].join('')

const output = `output/pdf/${safePurpose}_${timestamp}.pdf`
const result = spawnSync(
  process.execPath,
  ['scripts/export-pdf.mjs', 'resume.md', output],
  {
    cwd: projectRoot,
    stdio: 'inherit',
  },
)

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}

console.log(`Created ${output}`)

if (process.platform === 'darwin') {
  spawnSync('open', [output], { cwd: projectRoot, stdio: 'ignore' })
}
