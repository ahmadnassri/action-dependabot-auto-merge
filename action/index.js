// packages
const core = require('@actions/core')
const github = require('@actions/github')
// libraries
const parse = require('./lib/parse')
const approve = require('./lib/approve')
const comment = require('./lib/comment')

// parse inputs
const inputs = {
  token: core.getInput('github-token', { required: true }),
  target: core.getInput('target', { required: true })
}

// error handler
function errorHandler (err) {
  core.error(`Unhandled error: ${err}`)
  process.exit(1)
}

// catch errors and exit
process.on('unhandledRejection', errorHandler)
process.on('uncaughtException', errorHandler)

// exit early
if (github.context.eventName !== 'pull_request') {
  core.error('action triggered outside of a pull_request')
  process.exit(1)
}

// extract the title
const { payload: { sender, pull_request: { title } } } = github.context

// exit early if PR is not by dependabot
if (sender.login !== 'dependabot[bot]') {
  core.warning(`expected PR by "dependabot[bot]", found "${sender.login}" instead`)
  process.exit(0)
}

// init octokit
const octokit = github.getOctokit(inputs.token)

async function main () {
  // parse and determine what command to tell dependabot
  const command = parse(title, { target: inputs.target || 'patch' })

  if (command === 'merge') {
    await approve(octokit, github.context)
    await comment(octokit, github.context, `@dependabot ${command}`)
  }
}

// awaiting top-level await
main()
