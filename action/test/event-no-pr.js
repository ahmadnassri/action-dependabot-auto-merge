// packages
const { test } = require('tap')
const sinon = require('sinon')
const core = require('@actions/core')

// module
const env = require('../lib/env')

test('event -> no-pr', assert => {
  assert.plan(3)

  sinon.stub(core, 'setFailed')
  sinon.stub(process, 'exit')

  process.env.CI = 'true'
  process.env.GITHUB_EVENT_NAME = 'not-a-pull-request'

  env()

  assert.ok(process.exit.called)
  assert.equal(process.exit.getCall(0).args[0], 1)
  assert.equal(core.setFailed.getCall(0).args[0], 'action called on non pull-request event')

  process.exit.restore()
  core.setFailed.restore()
})
