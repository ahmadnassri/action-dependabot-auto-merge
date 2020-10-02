// packages
import tap from 'tap'
import sinon from 'sinon'

import core from '@actions/core'

// module
import parse from '../../lib/parse.js'

tap.test('parse -> invalid semver', assert => {
  assert.plan(3)

  sinon.stub(core, 'info') // silence output on terminal
  sinon.stub(core, 'warning')
  sinon.stub(process, 'exit')

  parse({ title: 'chore(deps): bump api-problem from FOO to BAR in /path' })

  assert.ok(process.exit.called)
  assert.equal(process.exit.getCall(0)?.firstArg, 0)
  assert.equal(core.warning.getCall(0)?.firstArg, 'failed to parse title: no recognizable versions')

  process.exit.restore()
  core.info.restore()
  core.warning.restore()
})

tap.only('parse -> invalid dependency name', assert => {
  assert.plan(3)

  sinon.stub(core, 'info') // silence output on terminal
  sinon.stub(core, 'warning')
  sinon.stub(process, 'exit')

  parse({ title: 'from 1.0.0 to 1.0.1' })

  assert.ok(process.exit.called)
  assert.equal(process.exit.getCall(0)?.firstArg, 0)
  assert.equal(core.warning.getCall(0)?.firstArg, 'failed to parse title: could not detect dependency name')

  process.exit.restore()
  core.info.restore()
  core.warning.restore()
})
