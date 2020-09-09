// packages
import tap from 'tap'
import sinon from 'sinon'
import core from '@actions/core'
import github from '@actions/github'

// module
import main from '../../lib/index.js'

tap.test('main -> wrong event', assert => {
  assert.plan(3)

  sinon.stub(core, 'error')
  sinon.stub(process, 'exit')

  sinon.stub(github, 'context').value({
    eventName: 'not-a-pull_request'
  })

  main()

  assert.ok(process.exit.called)
  assert.equal(process.exit.getCall(0).firstArg, 1)
  assert.equal(core.error.getCall(0).firstArg, 'action triggered outside of a pull_request')

  process.exit.restore()
  core.error.restore()
})

tap.test('main -> not dependabot', assert => {
  assert.plan(3)

  sinon.stub(core, 'warning')
  sinon.stub(process, 'exit')

  sinon.stub(github, 'context').value({
    eventName: 'pull_request',
    repo: 'foo/bar',
    payload: {
      sender: { login: 'foo' }
    }
  })

  main()

  assert.ok(process.exit.called)
  assert.equal(process.exit.getCall(0).firstArg, 0)
  assert.equal(core.warning.getCall(0).firstArg, 'expected PR by "dependabot[bot]", found "foo" instead')

  process.exit.restore()
  core.warning.restore()
})
