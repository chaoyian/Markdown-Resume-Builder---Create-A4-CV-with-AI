import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export function marpEntry(root = projectRoot) {
  return resolve(root, 'node_modules/@marp-team/marp-cli/marp-cli.js')
}

export function classifyBrowser(browserPath) {
  const normalized = browserPath.toLowerCase()
  if (normalized.includes('firefox')) return 'firefox'
  if (normalized.includes('edge') || normalized.includes('msedge')) return 'edge'
  return 'chrome'
}

function executableFromPath(command) {
  const lookup = process.platform === 'win32' ? 'where.exe' : 'which'
  const result = spawnSync(lookup, [command], { encoding: 'utf8' })
  if (result.status !== 0) return null
  return result.stdout.split(/\r?\n/).find(Boolean) ?? null
}

export function browserCandidates(platform = process.platform, env = process.env) {
  if (platform === 'darwin') {
    const systemCandidates = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Firefox.app/Contents/MacOS/firefox',
    ]
    if (!env.HOME) return systemCandidates
    return [
      ...systemCandidates,
      ...systemCandidates.map((path) => resolve(env.HOME, path.slice(1))),
    ]
  }

  if (platform === 'win32') {
    const roots = [env.PROGRAMFILES, env['PROGRAMFILES(X86)'], env.LOCALAPPDATA]
      .filter(Boolean)
    return roots.flatMap((root) => [
      join(root, 'Microsoft/Edge/Application/msedge.exe'),
      join(root, 'Google/Chrome/Application/chrome.exe'),
      join(root, 'Mozilla Firefox/firefox.exe'),
    ])
  }

  return [
    'google-chrome-stable',
    'google-chrome',
    'microsoft-edge-stable',
    'microsoft-edge',
    'chromium-browser',
    'chromium',
    'firefox',
  ]
}

export function findBrowser({
  platform = process.platform,
  env = process.env,
  pathExists = existsSync,
  pathLookup = executableFromPath,
} = {}) {
  if (env.BROWSER_PATH) {
    const browserPath = resolve(env.BROWSER_PATH)
    if (pathExists(browserPath)) {
      return { kind: classifyBrowser(browserPath), path: browserPath, source: 'BROWSER_PATH' }
    }
  }

  for (const candidate of browserCandidates(platform, env)) {
    const browserPath = platform === 'linux' ? pathLookup(candidate) : candidate
    if (browserPath && pathExists(browserPath)) {
      return { kind: classifyBrowser(browserPath), path: browserPath, source: 'auto' }
    }
  }

  return null
}

export function printBrowserHelp(platform = process.platform) {
  console.error('No supported browser was found. / 未找到受支持的浏览器。')
  if (platform === 'win32') {
    console.error('Install or update Microsoft Edge, Google Chrome, or Firefox.')
  } else if (platform === 'darwin') {
    console.error('Install Google Chrome, Microsoft Edge, or Firefox. Safari is not supported.')
  } else {
    console.error('Install Chrome, Chromium, Microsoft Edge, or Firefox.')
  }
  console.error('Advanced: set BROWSER_PATH to the browser executable path.')
}

export function openFile(filePath, platform = process.platform) {
  if (process.env.CI || process.env.MARPA4_NO_OPEN === '1') return true

  const command =
    platform === 'darwin'
      ? ['open', [filePath]]
      : platform === 'win32'
        ? ['explorer.exe', [filePath]]
        : ['xdg-open', [filePath]]
  const result = spawnSync(command[0], command[1], { stdio: 'ignore' })
  return !result.error && result.status === 0
}
