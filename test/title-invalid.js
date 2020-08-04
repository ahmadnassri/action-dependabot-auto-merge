// packages
const { test } = require('tap')
const sinon = require('sinon')
const core = require('@actions/core')

// module
const parse = require('../lib/parse')

test('title -> fail', assert => {
  assert.plan(3)

  sinon.stub(core, 'info') // silence output on terminal
  sinon.stub(core, 'setFailed')
  sinon.stub(process, 'exit')

  parse('chore(deps): bump api-problem from FOO to BAR in /path')

  assert.ok(process.exit.called)
  assert.equal(process.exit.getCall(0).args[0], 1)
  assert.equal(core.setFailed.getCall(0).args[0], 'failed to parse title: invalid semver')

  process.exit.restore()
  core.setFailed.restore()
})
