// packages
import tap from 'tap'
import sinon from 'sinon'

import core from '@actions/core'

// module
import parse from '../../lib/parse.js'

const config = [{ match: { dependency_type: 'all', update_type: 'semver:major' } }]

const dependencies = {
  prod: {
    dependencies: {
      'api-problem': '6.1.2'
    }
  },
  dev: {
    devDependencies: {
      'api-problem': '6.1.2'
    }
  }
}

tap.test('title -> security tag is detected', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')

  const options = {
    title: '[Security] bump api-problem from 6.1.2 to 6.1.4 in /path',
    dependencies: dependencies.prod,
    config
  }

  assert.ok(parse(options))
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(5)?.firstArg, 'security critical: true')

  core.info.restore()
})

tap.test('title -> security tag is detected (conventional commits)', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')

  const options = {
    title: 'chore(deps): [security] bump api-problem from 6.1.2 to 6.1.4 in /path',
    dependencies: dependencies.prod,
    config
  }

  assert.ok(parse(options))
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(5)?.firstArg, 'security critical: true')

  core.info.restore()
})

tap.test('labels -> security tag is detected', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')

  const options = {
    title: 'Bump api-problem from 6.1.2 to 6.1.4 in /path',
    labels: ['security'],
    dependencies: dependencies.prod,
    config
  }

  assert.ok(parse(options))
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(5)?.firstArg, 'security critical: true')

  core.info.restore()
})

tap.test('labels -> not security-critical update is detected', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')

  const options = {
    title: 'Bump api-problem from 6.1.2 to 6.1.4 in /path',
    dependencies: dependencies.prod,
    config
  }

  assert.ok(parse(options))
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(5)?.firstArg, 'security critical: false')

  core.info.restore()
})

tap.test('title -> dependency is detected as dev dependency (title fallback)', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')

  const options = {
    title: 'chore(deps-dev): bump api-problem from 6.1.2 to 6.1.4 in /path',
    dependencies: dependencies.prod,
    config
  }

  assert.ok(parse(options))
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(4)?.firstArg, 'dependency type: development')

  core.info.restore()
})

tap.test('title -> dependency is detected as production dependency (title fallback)', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')

  const options = {
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.1.4 in /path',
    dependencies: dependencies.prod,
    config
  }

  assert.ok(parse(options))
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(4)?.firstArg, 'dependency type: production')

  core.info.restore()
})

tap.test('title -> dependency is detected as dev dependency (package.json)', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')

  const options = {
    title: 'Bump api-problem from 6.1.2 to 6.1.4 in /path',
    dependencies: dependencies.dev,
    config
  }

  assert.ok(parse(options))
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(4)?.firstArg, 'dependency type: development')

  core.info.restore()
})

tap.test('title -> dependency is detected as production dependency (package.json)', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info')

  const options = {
    title: 'Bump api-problem from 6.1.2 to 6.1.4 in /path',
    dependencies: dependencies.prod,
    config
  }

  assert.ok(parse(options))
  assert.ok(core.info.called)
  assert.equal(core.info.getCall(4)?.firstArg, 'dependency type: production')

  core.info.restore()
})
