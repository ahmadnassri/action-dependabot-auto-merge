// packages
import tap from 'tap'
import sinon from 'sinon'

import core from '@actions/core'

// module
import parse from '../../lib/parse.js'

const ignoreSpecific = [
  { dependency_type: 'aws-sdk', update_type: 'semver:patch' },
  { dependency_type: 'react-router', update_type: 'security:all' }
]

tap.test('ignore with regex', async assert => {
  assert.plan(3)

  sinon.stub(core, 'info') // silence output on terminal
  sinon.stub(process, 'exit')

  const config = {
    ignore: [
      { dependency_name: 'aws-*', update_type: 'semver:major' },
      { dependency_name: 'react-*', update_type: 'security:minor' }
    ]
  }

  parse({ title: 'chore(deps-dev): bump aws-sdk from 6.1.2 to 7.0.0', config })

  assert.ok(process.exit.called)
  assert.equal(process.exit.getCall(0)?.firstArg, 0)
  assert.equal(core.info.getCall(-1)?.firstArg, 'ignored dependency detected')

  core.info.restore()
  process.exit.restore()
})
