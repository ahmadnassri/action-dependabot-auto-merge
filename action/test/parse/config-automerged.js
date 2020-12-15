// packages
import tap from 'tap'
import sinon from 'sinon'

import core from '@actions/core'

// module
import parse from '../../lib/parse.js'

const configAllPatchSecMinor = [
  { dependency_type: 'all', update_type: 'semver:patch' },
  { dependency_type: 'all', update_type: 'security:minor' }
]

const configAllPatchDevSecAll = [
  { dependency_type: 'all', update_type: 'semver:patch' },
  { dependency_type: 'development', update_type: 'security:all' }
]

const configProdPatchDevMajor = [
  { dependency_type: 'production', update_type: 'semver:patch' },
  { dependency_type: 'development', update_type: 'semver:major' }
]

const tests = [
  {
    name: 'all deps patch, security minor --> patch (✓)',
    outcome: true,
    message: 'all:semver:patch detected, will auto-merge',
    config: { rules: configAllPatchSecMinor },
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.1.4'
  },
  {
    name: 'all deps patch, security minor --> minor (✗)',
    outcome: false,
    message: 'manual merging required',
    config: { rules: configAllPatchSecMinor },
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.2.0'
  },
  {
    name: 'all deps patch, security minor --> security:minor (✓)',
    outcome: true,
    message: 'all:security:minor detected, will auto-merge',
    config: { rules: configAllPatchSecMinor },
    title: 'chore(deps): [security] bump api-problem from 6.1.2 to 6.2.0'
  },
  {
    name: 'all deps patch, security minor --> security:major (✗)',
    outcome: false,
    message: 'manual merging required',
    config: { rules: configAllPatchSecMinor },
    title: 'chore(deps): [security] bump api-problem from 6.1.2 to 7.2.0'
  },
  {
    name: 'all deps patch, dev security all --> patch (✓)',
    outcome: true,
    message: 'all:semver:patch detected, will auto-merge',
    config: { rules: configAllPatchDevSecAll },
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.1.3'
  },
  {
    name: 'all deps patch, dev security all --> preminor (✗)',
    outcome: false,
    message: 'manual merging required',
    config: { rules: configAllPatchDevSecAll },
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.2.0-pre'
  },
  {
    name: 'all deps patch, dev security all --> dev security:premajor (✓)',
    outcome: true,
    message: 'development:security:all detected, will auto-merge',
    config: { rules: configAllPatchDevSecAll },
    title: 'chore(deps-dev): [security] bump api-problem from 6.1.2 to 7.0.0-pre'
  },
  {
    name: 'prod patch, dev major --> prod patch (✓)',
    outcome: true,
    message: 'production:semver:patch detected, will auto-merge',
    config: { rules: configProdPatchDevMajor },
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.1.3'
  },
  {
    name: 'prod patch, dev major --> prod minor (✗)',
    outcome: false,
    message: 'manual merging required',
    config: { rules: configProdPatchDevMajor },
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.2.0'
  },
  {
    name: 'prod patch, dev major --> dev minor (✓)',
    outcome: true,
    message: 'development:semver:major detected, will auto-merge',
    config: { rules: configProdPatchDevMajor },
    title: 'chore(deps-dev): bump api-problem from 6.1.2 to 6.2.0'
  },
  {
    name: 'prod patch, dev major --> dev premajor (✗)',
    outcome: false,
    message: 'manual merging required',
    config: { rules: configProdPatchDevMajor },
    title: 'chore(deps-dev): bump api-problem from 6.1.2 to 7.0.0-pre'
  }
]

for (const { name, title, config, outcome, message } of tests) {
  tap.test(`compound merge configs in config files --> ${name}`, async assert => {
    assert.plan(2)

    sinon.stub(core, 'info') // silence output on terminal
    sinon.stub(process, 'exit')

    const result = parse({ title, config })

    assert.equal(core.info.getCall(-1)?.firstArg, message)
    assert.equal(result, outcome)

    process.exit.restore()
    core.info.restore()
  })
}
