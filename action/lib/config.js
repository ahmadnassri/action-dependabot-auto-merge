// internals
import fs from 'fs'
import path from 'path'

// packages
import core from '@actions/core'
import yaml from 'js-yaml'

// default value is passed from workflow
export default function ({ workspace, target }) {
  const configPath = path.join(workspace, '.github', 'auto-merge.yml')

  let config

  // read auto-merge.yml to determine what should be merged
  if (fs.existsSync(configPath)) {
    // parse .github/auto-merge.yml
    const configYaml = fs.readFileSync(configPath, 'utf8')
    config = yaml.safeLoad(configYaml)
    core.info('loaded merge config: \n' + configYaml)
  } else {
    // or convert the input "target" to the equivalent config
    config = [{ match: { dependency_type: 'all', update_type: `semver:${target}` } }]
    core.info('using workflow\'s "target": \n' + yaml.safeDump(config))
  }
}
