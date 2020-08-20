// packages
const { test } = require('tap')
const sinon = require('sinon')
const core = require('@actions/core')

// module
const parse = require('../lib/parse')

test('title -> parse', async assert => {
  assert.plan(5)

  sinon.stub(core, 'info')

  const command = parse('chore(deps): bump api-problem from 6.1.2 to 7.0.0 in /path', 'patch')

  assert.ok(core.info.called)
  assert.equal(core.info.getCall(1).args[0], 'from: 6.1.2')
  assert.equal(core.info.getCall(2).args[0], 'to: 7.0.0')
  assert.equal(core.info.getCall(3).args[0], 'manual merging required')
  assert.same(command, null)

  core.info.restore()
})
