// Loads the environment variables for use in the say way as Next.js

import { loadEnvConfig } from '@next/env'

const projectDir = process.cwd()
loadEnvConfig(projectDir)
