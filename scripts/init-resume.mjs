import { copyFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const language = process.argv[2] === 'en' ? 'en' : 'zh'
const template =
  language === 'en'
    ? 'examples/resume.en.md'
    : 'examples/resume.zh-CN.md'
const destination = resolve(projectRoot, 'resume.md')

if (existsSync(destination)) {
  console.error('resume.md already exists. Nothing was overwritten.')
  process.exit(1)
}

copyFileSync(resolve(projectRoot, template), destination)
console.log(`Created resume.md from ${template}.`)
