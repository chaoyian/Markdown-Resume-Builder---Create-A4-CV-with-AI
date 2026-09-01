import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { relative, resolve } from 'node:path'
import { emitKeypressEvents } from 'node:readline'
import {
  createAvailableOutputPath,
  createInitialResume,
  listResumeFiles,
  moveSelection,
  resolveResumeFile,
} from './resume-library.mjs'
import { openFile, projectRoot } from './runtime.mjs'

const resumesDirectory = resolve(projectRoot, 'resumes')
const outputDirectory = resolve(projectRoot, 'output/pdf')

async function chooseItem(title, items) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error('Interactive selection requires a terminal. Pass a resume path instead.')
  }

  emitKeypressEvents(process.stdin)
  const originalRawMode = process.stdin.isRaw
  let selectedIndex = 0

  const render = () => {
    process.stdout.write('\x1b[2J\x1b[H')
    process.stdout.write(`${title}\n\n`)
    items.forEach((item, index) => {
      process.stdout.write(`${index === selectedIndex ? '❯' : ' '} ${item.label}\n`)
    })
    process.stdout.write('\n↑/↓ Select  Enter Confirm  Q Quit\n')
  }

  return new Promise((resolveSelection) => {
    const cleanup = () => {
      process.stdin.off('keypress', onKeypress)
      if (process.stdin.setRawMode && !originalRawMode) process.stdin.setRawMode(false)
      process.stdin.pause()
      process.stdout.write('\x1b[?25h\n')
    }

    const onKeypress = (_text, key = {}) => {
      if ((key.ctrl && key.name === 'c') || key.name === 'q') {
        cleanup()
        resolveSelection(null)
        return
      }
      if (key.name === 'return' || key.name === 'enter') {
        const selected = items[selectedIndex]
        cleanup()
        resolveSelection(selected)
        return
      }
      const nextIndex = moveSelection(selectedIndex, key.name, items.length)
      if (nextIndex !== selectedIndex) {
        selectedIndex = nextIndex
        render()
      }
    }

    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdout.write('\x1b[?25l')
    process.stdin.on('keypress', onKeypress)
    render()
  })
}

async function initializeEmptyLibrary() {
  const selected = await chooseItem('Create your first resume / 创建第一份简历', [
    { label: '中文模板 / Chinese template', language: 'zh' },
    { label: 'English template / 英文模板', language: 'en' },
  ])
  if (!selected) return null

  const created = createInitialResume(projectRoot, selected.language)
  console.log(`Created resumes/${created.destinationName}`)
  console.log('Edit this Markdown file, then launch the toolkit again.')
  console.log('请先编辑该 Markdown 文件，保存后再次启动工具。')
  return null
}

let selectedResume
const requestedPath = process.argv[2]

try {
  if (requestedPath) {
    selectedResume = resolveResumeFile(projectRoot, requestedPath)
  } else {
    const resumeFiles = listResumeFiles(resumesDirectory)
    if (resumeFiles.length === 0) {
      await initializeEmptyLibrary()
      process.exit(0)
    }
    const selected = await chooseItem(
      'Select a resume / 选择简历版本',
      resumeFiles.map((file) => ({ label: file.name, file })),
    )
    selectedResume = selected?.file ?? null
  }
} catch (error) {
  console.error(error.message)
  process.exit(1)
}

if (!selectedResume) {
  console.log('Cancelled / 已取消')
  process.exit(0)
}

mkdirSync(outputDirectory, { recursive: true })
const outputPath = createAvailableOutputPath(outputDirectory, selectedResume.stem)
const result = spawnSync(
  process.execPath,
  [
    resolve(projectRoot, 'src/export-pdf.mjs'),
    relative(projectRoot, selectedResume.absolutePath),
    relative(projectRoot, outputPath),
  ],
  { cwd: projectRoot, stdio: 'inherit' },
)

if (result.status !== 0) {
  if (existsSync(outputPath)) rmSync(outputPath, { force: true })
  if (result.error) console.error(result.error.message)
  process.exit(result.status ?? 1)
}

console.log(`Created ${relative(projectRoot, outputPath)}`)
if (!openFile(outputPath)) {
  console.warn('PDF created, but it could not be opened automatically.')
}
