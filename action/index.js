// packages
import core from '@actions/core'

// modules
import main from './lib/index.js'

// parse inputs
const inputs = {
  token: core.getInput('github-token', { required: true }),
  target: core.getInput('target', { required: true }),
  command: core.getInput('command', { required: false }),
  approve: core.getInput('approve', { required: false })
}

// error handler
function errorHandler ({ message, stack }) {
  core.error(`${message}\n${stack}`)
  process.exit(1)
}

// catch errors and exit
process.on('unhandledRejection', errorHandler)
process.on('uncaughtException', errorHandler)

await main(inputs)
