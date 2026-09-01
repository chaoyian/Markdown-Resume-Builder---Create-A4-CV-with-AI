import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from 'node:fs'
import {
  basename,
  dirname,
  extname,
  relative,
  resolve,
} from 'node:path'

const resumeCollator = new Intl.Collator('zh-CN', {
  numeric: true,
  sensitivity: 'base',
})

export function listResumeFiles(resumesDirectory) {
  if (!existsSync(resumesDirectory)) return []

  return readdirSync(resumesDirectory, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isFile() &&
        !entry.name.startsWith('.') &&
        extname(entry.name).toLowerCase() === '.md',
    )
    .map((entry) => ({
      name: entry.name,
      stem: basename(entry.name, extname(entry.name)),
      absolutePath: resolve(resumesDirectory, entry.name),
    }))
    .sort((left, right) => resumeCollator.compare(left.name, right.name))
}

export function resolveResumeFile(projectRoot, inputPath) {
  const resumesDirectory = resolve(projectRoot, 'resumes')
  const absolutePath = resolve(projectRoot, inputPath)

  if (dirname(absolutePath) !== resumesDirectory) {
    throw new Error('Resume must be a top-level Markdown file in resumes/.')
  }

  const fileName = basename(absolutePath)
  if (fileName.startsWith('.') || extname(fileName).toLowerCase() !== '.md') {
    throw new Error('Resume must be a visible .md file in resumes/.')
  }

  if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
    throw new Error(`Resume not found: ${inputPath}`)
  }

  return {
    name: fileName,
    stem: basename(fileName, extname(fileName)),
    absolutePath,
    relativePath: relative(projectRoot, absolutePath),
  }
}

export function createInitialResume(projectRoot, language = 'zh') {
  const isEnglish = language === 'en'
  const template = isEnglish
    ? 'examples/resume.en.md'
    : 'examples/resume.zh-CN.md'
  const destinationName = isEnglish ? 'resume-en.md' : '简历中文版.md'
  const resumesDirectory = resolve(projectRoot, 'resumes')
  const destination = resolve(resumesDirectory, destinationName)

  mkdirSync(resumesDirectory, { recursive: true })
  if (existsSync(destination)) {
    throw new Error(`${destinationName} already exists. Nothing was overwritten.`)
  }

  copyFileSync(resolve(projectRoot, template), destination)
  return { destinationName, destination, template }
}

export function moveSelection(currentIndex, keyName, itemCount) {
  if (itemCount <= 0) return 0
  if (keyName === 'up') return (currentIndex - 1 + itemCount) % itemCount
  if (keyName === 'down') return (currentIndex + 1) % itemCount
  return currentIndex
}

export function sanitizeOutputStem(value) {
  return (
    value
      .normalize('NFKC')
      .trim()
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-')
      .replace(/[. ]+$/g, '')
      .replace(/\s+/g, '_')
      .replace(/[-_]{2,}/g, '_')
      .replace(/^[._-]+|[._-]+$/g, '') || 'resume'
  )
}

export function formatTimestamp(date = new Date()) {
  const pad = (value) => String(value).padStart(2, '0')
  return [
    date.getFullYear(),
    '-',
    pad(date.getMonth() + 1),
    '-',
    pad(date.getDate()),
    '_',
    pad(date.getHours()),
    '-',
    pad(date.getMinutes()),
    '-',
    pad(date.getSeconds()),
  ].join('')
}

export function createAvailableOutputPath(
  outputDirectory,
  resumeStem,
  date = new Date(),
) {
  const safeStem = sanitizeOutputStem(resumeStem)
  const baseName = `${safeStem}_${formatTimestamp(date)}`
  let candidate = resolve(outputDirectory, `${baseName}.pdf`)
  let suffix = 2

  while (existsSync(candidate)) {
    candidate = resolve(outputDirectory, `${baseName}_${suffix}.pdf`)
    suffix += 1
  }

  return candidate
}
