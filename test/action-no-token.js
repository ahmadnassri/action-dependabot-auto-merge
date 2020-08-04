// packages
const { test } = require('tap')
const sinon = require('sinon')
const core = require('@actions/core')

// module
const env = require('../lib/env')

test('action -> no-token', assert => {
  assert.plan(3)

  sinon.stub(core, 'setFailed')
  sinon.stub(process, 'exit')

  process.env.CI = 'true'
  process.env.GITHUB_EVENT_NAME = 'pull_request'

  delete process.env.GITHUB_TOKEN // ensure this doesn't exist

  env()

  assert.ok(process.exit.called)
  assert.equal(process.exit.getCall(0).args[0], 1)
  assert.equal(core.setFailed.getCall(0).args[0], 'GITHUB_TOKEN required')

  process.exit.restore()
  core.setFailed.restore()
})
