// packages
const { test } = require('tap')
const sinon = require('sinon')
const core = require('@actions/core')

// module
const parse = require('../lib/parse')

test('title -> parse', async assert => {
  assert.plan(4)

  sinon.stub(core, 'info')

  const command = parse('chore(deps): bump api-problem from 6.1.2 to 6.1.4-prerelease in /path', 'major')

  assert.ok(core.info.called)
  assert.equal(core.info.getCall(2).args[0], 'to: 6.1.4-prerelease')
  assert.equal(core.info.getCall(3).args[0], 'dependency update target is "major", found "prepatch", will auto-merge')
  assert.equal(command, 'merge')

  core.info.restore()
})
