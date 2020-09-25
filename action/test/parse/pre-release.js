// packages
import tap from 'tap'
import sinon from 'sinon'
import core from '@actions/core'

// module
import parse from '../../lib/parse.js'

function config (target) {
  return [{ match: { dependency_type: 'all', update_type: `semver:${target}` } }]
}

tap.test('parse -> pre-release -> direct match', async assert => {
  assert.plan(4)

  sinon.stub(core, 'info')

  const options = {
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.1.4-prerelease in /path',
    config: config('preminor')
  }

  assert.ok(parse(options))
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(3)?.firstArg, 'to: 6.1.4-prerelease')
  assert.equal(core.info.getCall(7)?.firstArg, 'all:semver:preminor detected, will auto-merge')

  core.info.restore()
})

tap.test('parse -> pre-release -> greater match', async assert => {
  assert.plan(4)

  sinon.stub(core, 'info')

  const options = {
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.1.4-prerelease in /path',
    config: config('major')
  }

  assert.ok(parse(options))
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(3)?.firstArg, 'to: 6.1.4-prerelease')
  assert.equal(core.info.getCall(7)?.firstArg, 'all:semver:major detected, will auto-merge')

  core.info.restore()
})

tap.test('parse -> pre-release -> lesser match (premajor)', async assert => {
  assert.plan(4)

  sinon.stub(core, 'info')

  const options = {
    title: 'chore(deps): bump api-problem from 6.1.2 to 7.0.0-pre.0 in /path',
    config: config('minor')
  }

  assert.notOk(parse(options))
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(3)?.firstArg, 'to: 7.0.0-pre.0')
  assert.equal(core.info.getCall(7)?.firstArg, 'manual merging required')

  core.info.restore()
})

tap.test('parse -> pre-release -> lesser match (preminor)', async assert => {
  assert.plan(4)

  sinon.stub(core, 'info')

  const options = {
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.2.0-pre.1 in /path',
    config: config('patch')
  }

  assert.notOk(parse(options))
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(3)?.firstArg, 'to: 6.2.0-pre.1')
  assert.equal(core.info.getCall(7)?.firstArg, 'manual merging required')

  core.info.restore()
})

tap.test('parse -> pre-release -> actual prerelease', async assert => {
  assert.plan(4)

  sinon.stub(core, 'info')

  const options = {
    title: 'chore(deps): bump api-problem from 6.1.2-pre.0 to 6.1.2-pre.1 in /path',
    config: config('patch')
  }

  assert.notOk(parse(options))
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(3)?.firstArg, 'to: 6.1.2-pre.1')
  assert.equal(core.info.getCall(7)?.firstArg, 'manual merging required')

  core.info.restore()
})
