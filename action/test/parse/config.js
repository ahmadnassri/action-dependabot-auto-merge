// packages
import tap from 'tap'
import sinon from 'sinon'

import core from '@actions/core'

// module
import parse from '../../lib/parse.js'

const configAllPatchSecMinor = [
  { match: { dependency_type: 'all', update_type: 'semver:patch' } },
  { match: { dependency_type: 'all', update_type: 'security:minor' } }
]

const configAllPatchDevSecAll = [
  { match: { dependency_type: 'all', update_type: 'semver:patch' } },
  { match: { dependency_type: 'development', update_type: 'security:all' } }
]

const configProdPatchDevMajor = [
  { match: { dependency_type: 'production', update_type: 'semver:patch' } },
  { match: { dependency_type: 'development', update_type: 'semver:major' } }
]

const configInRange = [
  { match: { dependency_type: 'all', update_type: 'in_range' } }
]

const tests = [
  {
    name: 'all deps patch, security minor --> patch (✓)',
    outcome: true,
    message: 'all:semver:patch detected, will auto-merge',
    config: configAllPatchSecMinor,
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.1.4'
  },
  {
    name: 'all deps patch, security minor --> minor (✗)',
    outcome: false,
    message: 'manual merging required',
    config: configAllPatchSecMinor,
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.2.0'
  },
  {
    name: 'all deps patch, security minor --> security:minor (✓)',
    outcome: true,
    message: 'all:security:minor detected, will auto-merge',
    config: configAllPatchSecMinor,
    title: 'chore(deps): [security] bump api-problem from 6.1.2 to 6.2.0'
  },
  {
    name: 'all deps patch, security minor --> security:major (✗)',
    outcome: false,
    message: 'manual merging required',
    config: configAllPatchSecMinor,
    title: 'chore(deps): [security] bump api-problem from 6.1.2 to 7.2.0'
  },
  {
    name: 'all deps patch, dev security all --> patch (✓)',
    outcome: true,
    message: 'all:semver:patch detected, will auto-merge',
    config: configAllPatchDevSecAll,
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.1.3'
  },
  {
    name: 'all deps patch, dev security all --> preminor (✗)',
    outcome: false,
    message: 'manual merging required',
    config: configAllPatchDevSecAll,
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.2.0-pre'
  },
  {
    name: 'all deps patch, dev security all --> dev security:premajor (✓)',
    outcome: true,
    message: 'development:security:all detected, will auto-merge',
    config: configAllPatchDevSecAll,
    title: 'chore(deps-dev): [security] bump api-problem from 6.1.2 to 7.0.0-pre'
  },
  {
    name: 'prod patch, dev major --> prod patch (✓)',
    outcome: true,
    message: 'production:semver:patch detected, will auto-merge',
    config: configProdPatchDevMajor,
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.1.3'
  },
  {
    name: 'prod patch, dev major --> prod minor (✗)',
    outcome: false,
    message: 'manual merging required',
    config: configProdPatchDevMajor,
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.2.0'
  },
  {
    name: 'prod patch, dev major --> dev minor (✓)',
    outcome: true,
    message: 'development:semver:major detected, will auto-merge',
    config: configProdPatchDevMajor,
    title: 'chore(deps-dev): bump api-problem from 6.1.2 to 6.2.0'
  },
  {
    name: 'prod patch, dev major --> dev premajor (✗)',
    outcome: false,
    message: 'manual merging required',
    config: configProdPatchDevMajor,
    title: 'chore(deps-dev): bump api-problem from 6.1.2 to 7.0.0-pre'
  },
  {
    name: 'in_range --> throws',
    throws: true,
    config: configInRange,
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.1.3'
  }
]

for (const { name, throws, title, config, outcome, message } of tests) {
  tap.test(`compound merge configs in config files --> ${name}`, async assert => {
    assert.plan(throws ? 3 : 2)

    sinon.stub(core, 'info') // silence output on terminal
    sinon.stub(core, 'warning')
    sinon.stub(process, 'exit')

    const result = parse({ title, config })

    if (throws === true) {
      assert.ok(process.exit.called)
      assert.equal(process.exit.getCall(0)?.firstArg, 0)
      assert.equal(core.warning.getCall(0)?.firstArg, 'in_range update type not supported yet')
    } else {
      assert.equal(core.info.getCall(-1)?.firstArg, message)
      assert.equal(result, outcome)
    }

    process.exit.restore()
    core.info.restore()
    core.warning.restore()
  })
}
