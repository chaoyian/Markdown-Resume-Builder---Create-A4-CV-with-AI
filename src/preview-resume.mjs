import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { resolveResumeFile } from './resume-library.mjs'
import { marpEntry, projectRoot } from './runtime.mjs'

const requestedPath = process.argv[2]
if (!requestedPath) {
  console.error('Pass a resume path, for example: npm run preview -- resumes/resume.md')
  process.exit(1)
}

let resume
try {
  resume = resolveResumeFile(projectRoot, requestedPath)
} catch (error) {
  console.error(error.message)
  process.exit(1)
}

const marpScript = marpEntry(projectRoot)
if (!existsSync(marpScript)) {
  console.error('Marp CLI is missing. Reinstall the toolkit or run npm install.')
  process.exit(1)
}

const result = spawnSync(
  process.execPath,
  [marpScript, resume.absolutePath, '--preview'],
  { cwd: resolve(projectRoot), stdio: 'inherit' },
)
process.exit(result.status ?? 1)
