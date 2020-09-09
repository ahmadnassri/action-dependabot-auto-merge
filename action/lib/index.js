import core from '@actions/core'
import github from '@actions/github'

// modules
import parse from './parse.js'
import { approve, comment } from './api.js'
import yaml from 'js-yaml';
import { ghWorkspace, targetToMergeConfig } from './shared.js';
import path from 'path'
import fs from 'fs'

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

  // read auto-merge.yml to determine what should be merged
  const configPath = path.join(ghWorkspace, '.github', 'auto-merge.yml')
  let mergeConfig;
  if (fs.existsSync(configPath)) {
    // parse .github/auto-merge.yml
    const mergeConfigYaml = fs.readFileSync(configPath, 'utf8')
    mergeConfig = yaml.safeLoad(mergeConfigYaml);
    core.info('loaded merge config: \n' + mergeConfigYaml);
  } else {
    // or convert the input "target" to the equivalent config
    mergeConfig = targetToMergeConfig(inputs.target);
    core.info('target converted to equivalent config: ' + JSON.stringify(mergeConfig, undefined, 4));
  }

  // parse and determine what command to tell dependabot
  const proceed = parse(
    pull_request.title,
    pull_request.labels.map(l => l.name.toLowerCase()),
    mergeConfig
  )

  if (proceed) {
    const command = inputs.approve === 'true' ? approve : comment

    await command(octokit, repo, pull_request, `@dependabot ${inputs.command}`)
  }
}
