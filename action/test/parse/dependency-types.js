// packages
import tap from 'tap'
import sinon from 'sinon'
import core from '@actions/core'
import fs from 'fs'

// module
import parse from '../../lib/parse.js'

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

  const proceed = parse('[Security] bump api-problem from 6.1.2 to 6.1.4 in /path', [], 'major')

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(5).args[0], 'security critical: true')

  core.info.restore()
  fs.readFileSync.restore()
})

tap.test('title -> security tag is detected (conventional commits)', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')
  sinon.stub(fs, 'readFileSync').returns(fakePackageJson)

  const proceed = parse('chore(deps): [security] bump api-problem from 6.1.2 to 6.1.4 in /path', [], 'major')

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(5).args[0], 'security critical: true')

  core.info.restore()
  fs.readFileSync.restore()
})

tap.test('labels -> security tag is detected', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')
  sinon.stub(fs, 'readFileSync').returns(fakePackageJson)

  const proceed = parse('Bump api-problem from 6.1.2 to 6.1.4 in /path', ['security'], 'major')

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(5).args[0], 'security critical: true')

  core.info.restore()
  fs.readFileSync.restore()
})

tap.test('labels -> not security-critical update is detected', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')
  sinon.stub(fs, 'readFileSync').returns(fakePackageJson)

  const proceed = parse('Bump api-problem from 6.1.2 to 6.1.4 in /path', [], 'major')

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(5).args[0], 'security critical: false')

  core.info.restore()
  fs.readFileSync.restore()
})

tap.test('title -> dependency is detected as dev dependency', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')

  const proceed = parse('chore(deps-dev): bump api-problem from 6.1.2 to 6.1.4 in /path', [], 'major')

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(4).args[0], 'dependency type: development')

  core.info.restore()
})

tap.test('title -> dependency is detected as production dependency', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')

  const proceed = parse('chore(deps): bump api-problem from 6.1.2 to 6.1.4 in /path', [], 'major')

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(4).args[0], 'dependency type: production')

  core.info.restore()
})

tap.test('title -> dependency is detected as dev dependency (package.json fallback)', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')
  sinon.stub(fs, 'readFileSync').returns(fakePackageJsonDev)

  const proceed = parse('Bump api-problem from 6.1.2 to 6.1.4 in /path', [], 'major')

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(4).args[0], 'dependency type: development')

  core.info.restore()
  fs.readFileSync.restore()
})

tap.test('title -> dependency is detected as production dependency (package.json fallback)', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')
  sinon.stub(fs, 'readFileSync').returns(fakePackageJson)

  const proceed = parse('Bump api-problem from 6.1.2 to 6.1.4 in /path', [], 'major')

  assert.ok(proceed)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(4).args[0], 'dependency type: production')

  core.info.restore()
  fs.readFileSync.restore()
})
