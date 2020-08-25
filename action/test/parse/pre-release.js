// packages
import tap from 'tap'
import sinon from 'sinon'
import core from '@actions/core'

// module
import parse from '../../lib/parse.js'

tap.test('parse -> pre-release -> direct match', async assert => {
  assert.plan(4)

  sinon.stub(core, 'info')

  const proceed = parse('chore(deps): bump api-problem from 6.1.2 to 6.1.4-prerelease in /path', 'preminor')

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(2).args[0], 'to: 6.1.4-prerelease')
  assert.equal(core.info.getCall(3).args[0], 'dependency update target is "preminor", found "prepatch", will auto-merge')

  core.info.restore()
})

tap.test('parse -> pre-release -> greater match', async assert => {
  assert.plan(4)

  sinon.stub(core, 'info')

  const proceed = parse('chore(deps): bump api-problem from 6.1.2 to 6.1.4-prerelease in /path', 'major')

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(2).args[0], 'to: 6.1.4-prerelease')
  assert.equal(core.info.getCall(3).args[0], 'dependency update target is "major", found "prepatch", will auto-merge')

  core.info.restore()
})
