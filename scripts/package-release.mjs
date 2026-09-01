import {
  chmodSync,
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packageJson = JSON.parse(readFileSync(resolve(projectRoot, 'package.json'), 'utf8'))
const args = Object.fromEntries(
  process.argv.slice(2).map((argument) => {
    const [key, value] = argument.replace(/^--/, '').split('=')
    return [key, value]
  }),
)

const platformNames = { darwin: 'macos', win32: 'windows', linux: 'linux' }
const platform = args.platform ?? platformNames[process.platform]
const arch = args.arch ?? process.arch
const expectedPlatform = platformNames[process.platform]

if (!['windows', 'macos', 'linux'].includes(platform)) {
  throw new Error(`Unsupported release platform: ${platform}`)
}
if (!['x64', 'arm64'].includes(arch)) {
  throw new Error(`Unsupported release architecture: ${arch}`)
}
if (platform !== expectedPlatform || arch !== process.arch) {
  throw new Error(
    `Release packages must be built natively (requested ${platform}-${arch}, running ${expectedPlatform}-${process.arch}).`,
  )
}

const packageName = `${packageJson.name}-v${packageJson.version}-${platform}-${arch}`
const stageRoot = resolve(projectRoot, 'dist/stage', packageName)
rmSync(stageRoot, { recursive: true, force: true })
mkdirSync(stageRoot, { recursive: true })

for (const directory of ['src', 'themes', 'examples', 'docs']) {
  cpSync(resolve(projectRoot, directory), resolve(stageRoot, directory), { recursive: true })
}
cpSync(resolve(projectRoot, 'node_modules'), resolve(stageRoot, 'node_modules'), { recursive: true })

for (const file of [
  'package.json',
  'package-lock.json',
  'README.md',
  'README.en.md',
  'LICENSE',
  'THIRD_PARTY_NOTICES.md',
]) {
  copyFileSync(resolve(projectRoot, file), resolve(stageRoot, file))
}

const launcher =
  platform === 'windows'
    ? ['launch-resume.cmd', 'Launch Resume Toolkit.cmd']
    : platform === 'macos'
      ? ['launch-resume.command', 'Launch Resume Toolkit.command']
      : ['launch-resume.sh', 'launch-resume.sh']
copyFileSync(resolve(projectRoot, 'launchers', launcher[0]), resolve(stageRoot, launcher[1]))
if (platform !== 'windows') chmodSync(resolve(stageRoot, launcher[1]), 0o755)

const runtimeDirectory = resolve(stageRoot, 'runtime')
mkdirSync(runtimeDirectory, { recursive: true })
const nodeExecutable = realpathSync(process.execPath)
const runtimeName = platform === 'windows' ? 'node.exe' : 'node'
copyFileSync(nodeExecutable, resolve(runtimeDirectory, runtimeName))
if (platform !== 'windows') chmodSync(resolve(runtimeDirectory, runtimeName), 0o755)

const nodeLicenseCandidates = [
  resolve(dirname(nodeExecutable), 'LICENSE'),
  resolve(dirname(nodeExecutable), '..', 'LICENSE'),
]
const nodeLicense = nodeLicenseCandidates.find(existsSync)
if (nodeLicense) {
  copyFileSync(nodeLicense, resolve(runtimeDirectory, 'NODEJS-LICENSE.txt'))
} else if (process.env.CI) {
  throw new Error('Unable to locate the Node.js LICENSE beside the hosted runtime.')
}

mkdirSync(resolve(stageRoot, 'resumes'), { recursive: true })
writeFileSync(
  resolve(stageRoot, 'resumes', 'START-HERE.txt'),
  'Launch the toolkit to create a private resume from a template.\n双击启动器，从模板创建本地私人简历。\n',
)

const marpVersion = JSON.parse(
  readFileSync(resolve(projectRoot, 'node_modules/@marp-team/marp-cli/package.json'), 'utf8'),
).version
writeFileSync(
  resolve(stageRoot, 'PACKAGE-MANIFEST.txt'),
  [
    `Toolkit: ${packageJson.version}`,
    `Platform: ${platform}`,
    `Architecture: ${arch}`,
    `Node.js: ${process.version}`,
    `Marp CLI: ${marpVersion}`,
    'Browser: not included; Chrome, Edge, Chromium, or Firefox is required',
    '',
  ].join('\n'),
)

console.log(stageRoot)
