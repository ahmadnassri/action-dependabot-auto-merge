// packages
import github from '@actions/github'

// modules
import parse from './parse.js'
import config from './config.js'
import dependencies from './dependencies.js'
import { approve, comment } from './api.js'

const workspace = process.env.GITHUB_WORKSPACE || '/github/workspace'

export default async function (inputs) {
  // extract the title
  const { repo, payload: { pull_request } } = github.context // eslint-disable-line camelcase

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
