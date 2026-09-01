import { existsSync } from 'node:fs'
import { findBrowser, marpEntry, printBrowserHelp, projectRoot } from './runtime.mjs'

let healthy = true
console.log(`Project: ${projectRoot}`)
console.log(`Node.js: ${process.version} (${process.arch})`)

const marpScript = marpEntry(projectRoot)
if (existsSync(marpScript)) {
  console.log('Marp CLI: ready')
} else {
  healthy = false
  console.error('Marp CLI: missing')
}

const browser = findBrowser()
if (browser) {
  console.log(`Browser: ${browser.kind} (${browser.path})`)
} else {
  healthy = false
  printBrowserHelp()
}

console.log(`Resume library: ${existsSync(`${projectRoot}/resumes`) ? 'ready' : 'not initialized'}`)
process.exit(healthy ? 0 : 1)
