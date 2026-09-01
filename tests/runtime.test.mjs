import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import test from 'node:test'
import { browserCandidates, classifyBrowser, findBrowser } from '../src/runtime.mjs'

test('classifies supported browser executables', () => {
  assert.equal(classifyBrowser('/Applications/Google Chrome.app/Chrome'), 'chrome')
  assert.equal(classifyBrowser('C:\\Program Files\\Microsoft\\Edge\\msedge.exe'), 'edge')
  assert.equal(classifyBrowser('/usr/bin/firefox'), 'firefox')
})

test('honors an existing BROWSER_PATH before automatic discovery', () => {
  const customBrowser = resolve('/custom/chromium')
  const browser = findBrowser({
    platform: 'linux',
    env: { BROWSER_PATH: '/custom/chromium' },
    pathExists: (path) => path === customBrowser,
    pathLookup: () => null,
  })
  assert.deepEqual(browser, {
    kind: 'chrome',
    path: customBrowser,
    source: 'BROWSER_PATH',
  })
})

test('discovers Windows Edge and returns null when nothing exists', () => {
  const candidates = browserCandidates('win32', { PROGRAMFILES: 'C:\\Program Files' })
  const edge = candidates.find((path) => path.includes('msedge.exe'))
  assert.equal(
    findBrowser({
      platform: 'win32',
      env: { PROGRAMFILES: 'C:\\Program Files' },
      pathExists: (path) => path === edge,
    }).kind,
    'edge',
  )
  assert.equal(
    findBrowser({ platform: 'linux', env: {}, pathExists: () => false, pathLookup: () => null }),
    null,
  )
})
