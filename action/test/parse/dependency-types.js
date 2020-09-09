// packages
import tap from 'tap'
import sinon from 'sinon'
import core from '@actions/core'
import fs from 'fs'

// module
import parse from '../../lib/parse.js'
import { targetToMergeConfig } from '../../lib/shared.js'

const fakePackageJson = JSON.stringify({
  dependencies: {
    "api-problem": "6.1.2",
  }
});
const fakePackageJsonDev = JSON.stringify({
  devDependencies: {
    "api-problem": "6.1.2",
  }
});

tap.test('title -> security tag is detected', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')
  sinon.stub(fs, 'readFileSync').returns(fakePackageJson)
  sinon.stub(fs, 'existsSync').returns(true)

  const proceed = parse('[Security] bump api-problem from 6.1.2 to 6.1.4 in /path', [], targetToMergeConfig('major'))

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(6).args[0], 'security critical: true')

  core.info.restore()
  fs.readFileSync.restore()
  fs.existsSync.restore()
})

tap.test('title -> security tag is detected (conventional commits)', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')
  sinon.stub(fs, 'readFileSync').returns(fakePackageJson)
  sinon.stub(fs, 'existsSync').returns(true)

  const proceed = parse('chore(deps): [security] bump api-problem from 6.1.2 to 6.1.4 in /path', [], targetToMergeConfig('major'))

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(6).args[0], 'security critical: true')

  core.info.restore()
  fs.readFileSync.restore()
  fs.existsSync.restore()
})

tap.test('labels -> security tag is detected', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')
  sinon.stub(fs, 'readFileSync').returns(fakePackageJson)
  sinon.stub(fs, 'existsSync').returns(true)

  const proceed = parse('Bump api-problem from 6.1.2 to 6.1.4 in /path', ['security'], targetToMergeConfig('major'))

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(6).args[0], 'security critical: true')

  core.info.restore()
  fs.readFileSync.restore()
  fs.existsSync.restore()
})

tap.test('labels -> not security-critical update is detected', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')
  sinon.stub(fs, 'readFileSync').returns(fakePackageJson)
  sinon.stub(fs, 'existsSync').returns(true)

  const proceed = parse('Bump api-problem from 6.1.2 to 6.1.4 in /path', [], targetToMergeConfig('major'))

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(6).args[0], 'security critical: false')

  core.info.restore()
  fs.readFileSync.restore()
  fs.existsSync.restore()
})

tap.test('title -> dependency is detected as dev dependency (title fallback)', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')
  sinon.stub(fs, 'existsSync').returns(false)

  const proceed = parse('chore(deps-dev): bump api-problem from 6.1.2 to 6.1.4 in /path', [], targetToMergeConfig('major'))

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(4).args[0], 'dependency type: development')

  core.info.restore()
  fs.existsSync.restore()
})

tap.test('title -> dependency is detected as production dependency (title fallback)', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')
  sinon.stub(fs, 'existsSync').returns(false)

  const proceed = parse('chore(deps): bump api-problem from 6.1.2 to 6.1.4 in /path', [], targetToMergeConfig('major'))

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(5).args[0], 'dependency type: production')

  core.info.restore()
  fs.existsSync.restore()
})

tap.test('title -> dependency is detected as dev dependency (package.json)', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')
  sinon.stub(fs, 'readFileSync').returns(fakePackageJsonDev)
  sinon.stub(fs, 'existsSync').returns(true)

  const proceed = parse('Bump api-problem from 6.1.2 to 6.1.4 in /path', [], targetToMergeConfig('major'))

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(4).args[0], 'dependency type: development')

  core.info.restore()
  fs.readFileSync.restore()
  fs.existsSync.restore()
})

tap.test('title -> dependency is detected as production dependency (package.json)', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')
  sinon.stub(fs, 'readFileSync').returns(fakePackageJson)
  sinon.stub(fs, 'existsSync').returns(true)

  const proceed = parse('Bump api-problem from 6.1.2 to 6.1.4 in /path', [], targetToMergeConfig('major'))

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(5).args[0], 'dependency type: production')

  core.info.restore()
  fs.readFileSync.restore()
  fs.existsSync.restore()
})
