import { existsSync, readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const requiredFiles = [
  'themes/a4-resume.css',
  'examples/resume.zh-CN.md',
  'examples/resume.en.md',
  'README.md',
  'README.en.md',
  'LICENSE',
]

for (const path of requiredFiles) {
  if (!existsSync(resolve(projectRoot, path))) {
    throw new Error(`Required file is missing: ${path}`)
  }
}

const theme = readFileSync(
  resolve(projectRoot, 'themes/a4-resume.css'),
  'utf8',
)

if (!theme.includes('@theme a4-resume')) {
  throw new Error('Theme metadata is missing @theme a4-resume.')
}

if (!theme.includes('@size A4 210mm 297mm')) {
  throw new Error('Theme metadata is missing the A4 size preset.')
}

for (const example of [
  'examples/resume.zh-CN.md',
  'examples/resume.en.md',
]) {
  const source = readFileSync(resolve(projectRoot, example), 'utf8')
  if (!source.includes('theme: a4-resume') || !source.includes('size: A4')) {
    throw new Error(`${example} does not select the A4 resume theme.`)
  }
}

const trackedPrivateResume = spawnSync(
  'git',
  ['ls-files', '--error-unmatch', 'resume.md'],
  { cwd: projectRoot, stdio: 'ignore' },
)

if (trackedPrivateResume.status === 0) {
  throw new Error('resume.md must remain untracked.')
}

const ignoredPrivateResume = spawnSync(
  'git',
  ['check-ignore', '--quiet', 'resume.md'],
  { cwd: projectRoot, stdio: 'ignore' },
)

if (ignoredPrivateResume.status !== 0) {
  throw new Error('resume.md must be covered by .gitignore.')
}

console.log('Project structure and privacy boundary are valid.')
