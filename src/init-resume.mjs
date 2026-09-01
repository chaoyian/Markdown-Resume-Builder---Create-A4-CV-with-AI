import { createInitialResume } from './resume-library.mjs'
import { projectRoot } from './runtime.mjs'

const language = process.argv[2] === 'en' ? 'en' : 'zh'

try {
  const created = createInitialResume(projectRoot, language)
  console.log(`Created resumes/${created.destinationName} from ${created.template}.`)
} catch (error) {
  console.error(error.message)
  process.exit(1)
}
