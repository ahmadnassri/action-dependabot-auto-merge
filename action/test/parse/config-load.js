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

  const expected = { rules: [{ dependency_type: 'development', update_type: 'semver:minor' }] }

  const result = config({ workspace })

  assert.match(core.info.getCall(-1)?.firstArg, 'loaded merge config')
  assert.deepEqual(result, expected)

  core.info.restore()
})

tap.test('input.config --> custom', async assert => {
  assert.plan(2)

  sinon.stub(core, 'info') // silence output on terminal

  const expected = { rules: [{ dependency_type: 'development', update_type: 'semver:minor' }] }

  const result = config({ workspace, filename: 'config-valid.yml' })

  assert.match(core.info.getCall(-1)?.firstArg, 'loaded merge config')
  assert.deepEqual(result, expected)

  core.info.restore()
})

tap.test('input.config --> no file', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info') // silence output on terminal
  sinon.stub(core, 'error')
  sinon.stub(process, 'exit')

  config({})

  assert.ok(process.exit.called)
  assert.equal(process.exit.getCall(0)?.firstArg, 1)
  assert.equal(core.error.getCall(0)?.firstArg, 'missing config file')

  process.exit.restore()
  core.info.restore()
  core.error.restore()
})
