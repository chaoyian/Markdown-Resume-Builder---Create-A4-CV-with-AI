import { existsSync, readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const requiredFiles = [
  'src/resume-library.mjs',
  'src/runtime.mjs',
  'src/export-interactive.mjs',
  'src/export-pdf.mjs',
  'src/doctor.mjs',
  'launchers/launch-resume.cmd',
  'launchers/launch-resume.command',
  'launchers/launch-resume.sh',
  'themes/a4-resume.css',
  'themes/a4-resume-serif.css',
  'tests/resume-library.test.mjs',
  'tests/runtime.test.mjs',
  '.github/workflows/ci.yml',
  '.github/workflows/release.yml',
  'README.md',
  'README.en.md',
  'LICENSE',
]

for (const path of requiredFiles) {
  if (!existsSync(resolve(projectRoot, path))) throw new Error(`Required file is missing: ${path}`)
}

const packageJson = JSON.parse(readFileSync(resolve(projectRoot, 'package.json'), 'utf8'))
if (packageJson.version !== '2.0.0') throw new Error('package.json must declare version 2.0.0.')

for (const [themePath, themeName] of [
  ['themes/a4-resume.css', 'a4-resume'],
  ['themes/a4-resume-serif.css', 'a4-resume-serif'],
]) {
  const theme = readFileSync(resolve(projectRoot, themePath), 'utf8')
  if (!theme.includes(`@theme ${themeName}`) || !theme.includes('@size A4 210mm 297mm')) {
    throw new Error(`${themePath} is missing required Marp metadata.`)
  }
}

for (const example of ['examples/resume.zh-CN.md', 'examples/resume.en.md']) {
  const source = readFileSync(resolve(projectRoot, example), 'utf8')
  if (!source.includes('theme: a4-resume') || !source.includes('size: A4')) {
    throw new Error(`${example} does not select the A4 resume theme.`)
  }
}

const trackedPrivateResume = spawnSync('git', ['ls-files', 'resumes'], {
  cwd: projectRoot,
  encoding: 'utf8',
})
if (trackedPrivateResume.status !== 0 || trackedPrivateResume.stdout.trim()) {
  throw new Error('resumes/ must remain untracked.')
}

const ignoredResumeLibrary = spawnSync(
  'git',
  ['check-ignore', '--quiet', 'resumes/.privacy-check'],
  { cwd: projectRoot, stdio: 'ignore' },
)
if (ignoredResumeLibrary.status !== 0) throw new Error('resumes/ must be covered by .gitignore.')

console.log('Project structure, release metadata, and privacy boundary are valid.')
