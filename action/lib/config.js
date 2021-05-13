// internals
import fs from 'fs'
import path from 'path'
import Ajv from 'ajv'

// packages
import core from '@actions/core'
import yaml from 'js-yaml'

// require for json loading
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const schema = require('./config.schema.json')

const ajv = new Ajv()
const validate = ajv.compile(schema)

// default value is passed from workflow
export default function ({ workspace = '', filename = '.github/auto-merge.yml' }) {
  const configPath = path.join(workspace, filename)

  // read auto-merge.yml to determine what should be merged
  if (fs.existsSync(configPath)) {
    // parse .github/auto-merge.yml
    const configYaml = fs.readFileSync(configPath, 'utf8')
    const config = yaml.safeLoad(configYaml)

    core.info('loaded merge config: \n' + configYaml)

    // validate config schema
    const valid = validate(config)

    if (!valid) {
      core.error('invalid config file format')
      return process.exit(1)
    }

    return config
  }

  // create default config structure

  core.error('missing config file')
  return process.exit(1)
}
