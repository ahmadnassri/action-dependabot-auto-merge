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

  delete process.env.CI // ensure this doesn't exist

  env()

  assert.ok(process.exit.called)
  assert.equal(process.exit.getCall(0).args[0], 1)
  assert.equal(core.setFailed.getCall(0).args[0], 'action called outside of CI')

  process.exit.restore()
  core.setFailed.restore()
})
