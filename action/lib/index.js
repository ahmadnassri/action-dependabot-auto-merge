// packages
import github from '@actions/github'

// modules
import parse from './parse.js'
import loadConfig from './config.js'
import dependencies from './dependencies.js'
import { approve, comment } from './api.js'

const workspace = process.env.GITHUB_WORKSPACE || '/github/workspace'

export default async function ({ token, config: filename }) {
  // extract the title
  const { repo, payload: { pull_request } } = github.context // eslint-disable-line camelcase

  // init octokit
  const octokit = github.getOctokit(token)

  const config = loadConfig({ workspace, filename })

  // parse and determine what command to tell dependabot
  const proceed = parse({
    config,
    title: pull_request.title,
    labels: pull_request.labels.map(label => label.name.toLowerCase()),
    dependencies: dependencies(workspace)
  })

  if (proceed) {
    const command = config.approve ? approve : comment

    await command(octokit, repo, pull_request.number, `@dependabot ${config.command}`)
  }
}
