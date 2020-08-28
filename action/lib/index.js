import core from '@actions/core'
import github from '@actions/github'

// modules
import parse from './parse.js'
import { approve, comment } from './api.js'

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
  const proceed = parse(pull_request.title, inputs.target || 'patch')

  if (proceed) {
    const command = inputs.approve ? approve : comment

    await command(octokit, repo, pull_request, `@dependabot ${inputs.command}`)
  }
}
