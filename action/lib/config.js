// internals
import fs from 'fs'
import path from 'path'

// packages
import core from '@actions/core'
import yaml from 'js-yaml'

// default value is passed from workflow
export default function ({ workspace, inputs }) {
  const configPath = path.join(workspace || '', inputs.config || '.github/auto-merge.yml')

  // read auto-merge.yml to determine what should be merged
  if (fs.existsSync(configPath)) {
    // parse .github/auto-merge.yml
    const configYaml = fs.readFileSync(configPath, 'utf8')
    const config = yaml.load(configYaml)
    core.info('loaded merge config: \n' + configYaml)

    return config
  }

  // or convert the input "target" to the equivalent config
  const config = [{ match: { dependency_type: 'all', update_type: `semver:${inputs.target}` } }]
  core.info('using workflow\'s "target": \n' + yaml.dump(config))

  return config
}
