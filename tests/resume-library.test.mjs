import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join, resolve } from 'node:path'
import test from 'node:test'
import {
  createAvailableOutputPath,
  formatTimestamp,
  listResumeFiles,
  moveSelection,
  resolveResumeFile,
  sanitizeOutputStem,
} from '../src/resume-library.mjs'

function withTemporaryProject(run) {
  const root = mkdtempSync(join(tmpdir(), 'marp-resume-test-'))
  try {
    mkdirSync(join(root, 'resumes'), { recursive: true })
    mkdirSync(join(root, 'output', 'pdf'), { recursive: true })
    run(root)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

test('lists only visible top-level Markdown files in Chinese filename order', () => {
  withTemporaryProject((root) => {
    const resumes = join(root, 'resumes')
    for (const name of ['英文版.md', '国企基金版.md', '投研通用版.md', '.隐藏.md', '说明.txt']) {
      writeFileSync(join(resumes, name), '')
    }
    mkdirSync(join(resumes, '子目录'))
    writeFileSync(join(resumes, '子目录', '嵌套.md'), '')
    assert.deepEqual(listResumeFiles(resumes).map((file) => file.name), [
      '国企基金版.md',
      '投研通用版.md',
      '英文版.md',
    ])
  })
})

test('returns an empty list when the library is missing or empty', () => {
  withTemporaryProject((root) => {
    assert.deepEqual(listResumeFiles(join(root, 'missing')), [])
    assert.deepEqual(listResumeFiles(join(root, 'resumes')), [])
  })
})

test('resolves only visible top-level Markdown files under resumes', () => {
  withTemporaryProject((root) => {
    const resume = join(root, 'resumes', '投研 通用版.md')
    writeFileSync(resume, '# Resume')
    assert.equal(resolveResumeFile(root, 'resumes/投研 通用版.md').absolutePath, resume)
    assert.throws(() => resolveResumeFile(root, 'examples/public.md'), /top-level Markdown/)
    assert.throws(() => resolveResumeFile(root, 'resumes/.hidden.md'), /visible .md/)
  })
})

test('moves arrow selection with wraparound and ignores other keys', () => {
  assert.equal(moveSelection(0, 'up', 3), 2)
  assert.equal(moveSelection(2, 'down', 3), 0)
  assert.equal(moveSelection(1, 'left', 3), 1)
  assert.equal(moveSelection(0, 'down', 0), 0)
})

test('sanitizes Unicode and filesystem-reserved characters', () => {
  assert.equal(sanitizeOutputStem('  国企 基金版  '), '国企_基金版')
  assert.equal(sanitizeOutputStem('English / Growth:*?'), 'English_Growth')
  assert.equal(sanitizeOutputStem('file. '), 'file')
  assert.equal(sanitizeOutputStem('...'), 'resume')
})

test('formats timestamps and avoids overwriting same-second exports', () => {
  withTemporaryProject((root) => {
    const output = join(root, 'output', 'pdf')
    const date = new Date(2026, 7, 24, 14, 30, 0)
    assert.equal(formatTimestamp(date), '2026-08-24_14-30-00')
    const first = createAvailableOutputPath(output, '国企基金版', date)
    assert.equal(basename(first), '国企基金版_2026-08-24_14-30-00.pdf')
    writeFileSync(first, 'first')
    assert.equal(
      createAvailableOutputPath(output, '国企基金版', date),
      resolve(output, '国企基金版_2026-08-24_14-30-00_2.pdf'),
    )
  })
})
