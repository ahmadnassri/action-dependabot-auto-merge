// packages
import core from '@actions/core'
import github from '@actions/github'

// modules
import parse from './parse.js'
import config from './config.js'
import dependencies from './dependencies.js'
import { approve, comment } from './api.js'

const workspace = process.env.GITHUB_WORKSPACE || '/github/workspace'

export default async function (inputs) {
  // exit early
  if (github.context.eventName !== 'pull_request') {
    core.error('action triggered outside of a pull_request')
    return process.exit(1)
  }

  // extract the title
  const { repo, payload: { sender, pull_request } } = github.context // eslint-disable-line camelcase

  // exit early if PR is not by dependabot
  if (!sender || !['dependabot[bot]', 'dependabot-preview[bot]'].includes(sender.login)) {
    core.warning(`expected PR by "dependabot[bot]", found "${sender.login}" instead`)
    return process.exit(0)
  }

  // init octokit
  const octokit = github.getOctokit(inputs.token)

  // parse and determine what command to tell dependabot
  const proceed = parse({
    title: pull_request.title,
    labels: pull_request.labels.map(label => label.name.toLowerCase()),
    config: config({ workspace, target: inputs.target }),
    dependencies: dependencies(workspace)
  })

  if (proceed) {
    const command = inputs.approve === 'true' ? approve : comment

    await command(octokit, repo, pull_request, `@dependabot ${inputs.command}`)
  }
}
