// packages
import tap from 'tap'
import sinon from 'sinon'

import core from '@actions/core'

// module
import config from '../../lib/config.js'

import path from 'path'
const __dirname = path.resolve()

const workspace = `${__dirname}/test/fixtures/`

tap.test('input.config --> default', async assert => {
  assert.plan(2)

  sinon.stub(core, 'info') // silence output on terminal

  const expected = [{ match: { dependency_type: 'development', update_type: 'semver:minor' } }]

  const result = config({ workspace, inputs: { } })

  assert.match(core.info.getCall(-1)?.firstArg, 'loaded merge config')
  assert.match(result, expected)

  core.info.restore()
})

tap.test('input.config --> custom', async assert => {
  assert.plan(2)

  sinon.stub(core, 'info') // silence output on terminal

  const expected = [{ match: { dependency_type: 'development', update_type: 'semver:minor' } }]

  const result = config({ workspace, inputs: { config: 'config-valid.yml' } })

  assert.match(core.info.getCall(-1)?.firstArg, 'loaded merge config')
  assert.match(result, expected)

  core.info.restore()
})

tap.test('input.config --> no file', async assert => {
  assert.plan(2)

  sinon.stub(core, 'info') // silence output on terminal

  const expected = [{ match: { dependency_type: 'all', update_type: 'semver:patch' } }]

  const result = config({ inputs: { target: 'patch' } })

  assert.match(core.info.getCall(-1)?.firstArg, 'using workflow\'s "target":')
  assert.match(result, expected)

  core.info.restore()
})
