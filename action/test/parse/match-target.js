// packages
import tap from 'tap'
import sinon from 'sinon'
import core from '@actions/core'

// module
import parse from '../../lib/parse.js'

tap.test('title -> in range', async assert => {
  assert.plan(7)

  sinon.stub(core, 'info')

  const proceed = parse('chore(deps): bump api-problem from 6.1.2 to 6.1.4 in /path', [], 'major')

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(0).args[0], 'title: "chore(deps): bump api-problem from 6.1.2 to 6.1.4 in /path"')
  assert.equal(core.info.getCall(1).args[0], 'depName: api-problem')
  assert.equal(core.info.getCall(2).args[0], 'from: 6.1.2')
  assert.equal(core.info.getCall(3).args[0], 'to: 6.1.4')
  assert.equal(core.info.getCall(7).args[0], 'all dependency updates semver:major allowed, got semver:patch, will auto-merge')

  core.info.restore()
})

tap.test('parse -> out of range', async assert => {
  assert.plan(5)

  sinon.stub(core, 'info')

  const proceed = parse('chore(deps): bump api-problem from 6.1.2 to 7.0.0 in /path', [], 'patch')

  assert.notOk(proceed, false)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(2).args[0], 'from: 6.1.2')
  assert.equal(core.info.getCall(3).args[0], 'to: 7.0.0')
  assert.equal(core.info.getCall(7).args[0], 'manual merging required')

  core.info.restore()
})
