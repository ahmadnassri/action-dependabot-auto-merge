/* eslint-disable camelcase */

// packages
import tap from 'tap'
import sinon from 'sinon'

import core from '@actions/core'
import fs from 'fs'

// module
import parse from '../../lib/parse.js'

function config (update_type) {
  return [{ match: { dependency_type: 'all', update_type } }]
}

tap.test('title -> in range', async assert => {
  assert.plan(8)

  sinon.stub(core, 'info')
  sinon.stub(fs, 'existsSync').returns(false)

  const options = {
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.1.4 in /path',
    config: config('semver:major')
  }

  assert.ok(parse(options))
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(0)?.firstArg, 'title: "chore(deps): bump api-problem from 6.1.2 to 6.1.4 in /path"')
  assert.equal(core.info.getCall(1)?.firstArg, 'depName: api-problem')
  assert.equal(core.info.getCall(2)?.firstArg, 'from: 6.1.2')
  assert.equal(core.info.getCall(3)?.firstArg, 'to: 6.1.4')
  assert.equal(core.info.getCall(6)?.firstArg, 'config: all:semver:major')
  assert.equal(core.info.getCall(7)?.firstArg, 'all:semver:major detected, will auto-merge')

  core.info.restore()
  fs.existsSync.restore()
})

tap.test('title -> in range, no from', async assert => {
  assert.plan(8)

  sinon.stub(core, 'info')
  // sinon.stub(core, 'warning')
  sinon.stub(fs, 'existsSync').returns(false)

  const options = {
    title: 'Update actions/setup-python requirement to v2.1.4 in /path',
    config: config('all')
  }

  assert.ok(parse(options))
  assert.ok(core.info.called)
  // assert.ok(core.warning.called)
  assert.equal(core.info.getCall(0)?.firstArg, 'title: "Update actions/setup-python requirement to v2.1.4 in /path"')
  assert.equal(core.info.getCall(1)?.firstArg, 'depName: actions/setup-python')
  assert.equal(core.info.getCall(2)?.firstArg, 'from: unknown')
  assert.equal(core.info.getCall(3)?.firstArg, 'to: 2.1.4')
  assert.equal(core.info.getCall(6)?.firstArg, 'config: all:all')
  assert.equal(core.info.getCall(7)?.firstArg, 'all:all detected, will auto-merge')
  // assert.equal(core.warning.getCall(0)?.firstArg, 'no version range detected in PR title')

  core.info.restore()
  fs.existsSync.restore()
})

tap.test('title -> in range, no from', async assert => {
  assert.plan(8)

  sinon.stub(core, 'info')
  // sinon.stub(core, 'warning')
  sinon.stub(fs, 'existsSync').returns(false)

  const options = {
    title: 'Update actions/setup-python requirement to v2.1.4 in /path',
    config: config('semver:all')
  }

  assert.ok(parse(options))
  assert.ok(core.info.called)
  // assert.ok(core.warning.called)
  assert.equal(core.info.getCall(0)?.firstArg, 'title: "Update actions/setup-python requirement to v2.1.4 in /path"')
  assert.equal(core.info.getCall(1)?.firstArg, 'depName: actions/setup-python')
  assert.equal(core.info.getCall(2)?.firstArg, 'from: unknown')
  assert.equal(core.info.getCall(3)?.firstArg, 'to: 2.1.4')
  assert.equal(core.info.getCall(6)?.firstArg, 'config: all:semver:all')
  assert.equal(core.info.getCall(7)?.firstArg, 'all:semver:all detected, will auto-merge')
  // assert.equal(core.warning.getCall(0)?.firstArg, 'no version range detected in PR title')

  core.info.restore()
  fs.existsSync.restore()
})

tap.test('parse -> out of range', async assert => {
  assert.plan(5)

  sinon.stub(core, 'info')
  sinon.stub(fs, 'existsSync').returns(false)

  const options = {
    title: 'chore(deps): bump api-problem from 6.1.2 to 7.0.0 in /path',
    config: config('semver:patch')
  }

  assert.notOk(parse(options), false)
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(2)?.firstArg, 'from: 6.1.2')
  assert.equal(core.info.getCall(3)?.firstArg, 'to: 7.0.0')
  assert.equal(core.info.getCall(7)?.firstArg, 'manual merging required')

  core.info.restore()
  fs.existsSync.restore()
})

tap.test('title -> out of range, no from', async assert => {
  assert.plan(10)

  sinon.stub(core, 'info')
  sinon.stub(core, 'warning')
  sinon.stub(fs, 'existsSync').returns(false)

  const options = {
    title: 'Update actions/setup-python requirement to v2.1.4 in /path',
    config: config('semver:major')
  }

  assert.notOk(parse(options))
  assert.ok(core.info.called)
  assert.ok(core.warning.called)
  assert.equal(core.info.getCall(0)?.firstArg, 'title: "Update actions/setup-python requirement to v2.1.4 in /path"')
  assert.equal(core.info.getCall(1)?.firstArg, 'depName: actions/setup-python')
  assert.equal(core.info.getCall(2)?.firstArg, 'from: unknown')
  assert.equal(core.info.getCall(3)?.firstArg, 'to: 2.1.4')
  assert.equal(core.info.getCall(6)?.firstArg, 'config: all:semver:major')
  assert.equal(core.info.getCall(7)?.firstArg, 'manual merging required')
  assert.equal(core.warning.getCall(0)?.firstArg, 'no version range detected in PR title')

  core.info.restore()
  core.warning.restore()
  fs.existsSync.restore()
})
