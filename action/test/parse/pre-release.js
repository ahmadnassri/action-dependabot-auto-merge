// packages
import tap from 'tap'
import sinon from 'sinon'
import core from '@actions/core'
import fs from 'fs'

// module
import parse from '../../lib/parse.js'
import { targetToMergeConfig } from '../../lib/shared.js'

tap.test('parse -> pre-release -> direct match', async assert => {
  assert.plan(4)

  sinon.stub(core, 'info')
  sinon.stub(fs, 'existsSync').returns(false)

  const proceed = parse('chore(deps): bump api-problem from 6.1.2 to 6.1.4-prerelease in /path', [], targetToMergeConfig('preminor'))

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(4).args[0], 'to: 6.1.4-prerelease')
  assert.equal(core.info.getCall(7).args[0], 'all dependency updates semver:preminor allowed, got semver:prepatch, will auto-merge')

  core.info.restore()
  fs.existsSync.restore()
})

tap.test('parse -> pre-release -> greater match', async assert => {
  assert.plan(4)

  sinon.stub(core, 'info')
  sinon.stub(fs, 'existsSync').returns(false)

  const proceed = parse('chore(deps): bump api-problem from 6.1.2 to 6.1.4-prerelease in /path', [], targetToMergeConfig('major'))

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(4).args[0], 'to: 6.1.4-prerelease')
  assert.equal(core.info.getCall(7).args[0], 'all dependency updates semver:major allowed, got semver:prepatch, will auto-merge')

  core.info.restore()
  fs.existsSync.restore()
})

tap.test('parse -> pre-release -> lesser match (premajor)', async assert => {
  assert.plan(4)

  sinon.stub(core, 'info')
  sinon.stub(fs, 'existsSync').returns(false)

  const proceed = parse('chore(deps): bump api-problem from 6.1.2 to 7.0.0-pre.0 in /path', [], targetToMergeConfig('minor'))

  assert.notOk(proceed, false)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(4).args[0], 'to: 7.0.0-pre.0')
  assert.equal(core.info.getCall(7).args[0], 'manual merging required')

  core.info.restore()
  fs.existsSync.restore()
})

tap.test('parse -> pre-release -> lesser match (preminor)', async assert => {
  assert.plan(4)

  sinon.stub(core, 'info')
  sinon.stub(fs, 'existsSync').returns(false)

  const proceed = parse('chore(deps): bump api-problem from 6.1.2 to 6.2.0-pre.1 in /path', [], targetToMergeConfig('patch'))

  assert.notOk(proceed, false)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(4).args[0], 'to: 6.2.0-pre.1')
  assert.equal(core.info.getCall(7).args[0], 'manual merging required')

  core.info.restore()
  fs.existsSync.restore()
})

tap.test('parse -> pre-release -> actual prerelease', async assert => {
  assert.plan(4)

  sinon.stub(core, 'info')
  sinon.stub(fs, 'existsSync').returns(false)

  const proceed = parse('chore(deps): bump api-problem from 6.1.2-pre.0 to 6.1.2-pre.1 in /path', [], targetToMergeConfig('patch'))

  assert.notOk(proceed, false)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(4).args[0], 'to: 6.1.2-pre.1')
  assert.equal(core.info.getCall(7).args[0], 'manual merging required')

  core.info.restore()
  fs.existsSync.restore()
})
