// packages
import tap from 'tap'
import path from 'path'
import { promisify } from 'util'
import { exec } from 'child_process'

const pexec = promisify(exec)

tap.test('main -> wrong event', assert => {
  assert.plan(2)

  process.env.GITHUB_EVENT_NAME = 'not-a-pull_request'

  pexec('node index.js')
    .catch(({ code, stdout }) => {
      assert.equal(code, 1)
      assert.equal(stdout.trim(), '::error::action triggered outside of a pull_request')
    })
})

tap.test('main -> not dependabot', assert => {
  assert.plan(1)

  process.env.GITHUB_EVENT_NAME = 'pull_request'
  process.env.GITHUB_EVENT_PATH = path.join(path.resolve(), 'test', 'cli', 'event.json')

  pexec('node index.js')
    .then(({ code, stdout }) => {
      assert.equal(stdout.trim(), '::warning::exiting early - expected PR by "dependabot[bot],dependabot-preview[bot]", found "foo" instead')
    })
})

tap.test('main -> allow sender bar', assert => {
  assert.plan(1)

  process.env.INPUT_ACCEPTSENDER = 'bar'

  process.env.GITHUB_EVENT_NAME = 'pull_request'
  process.env.GITHUB_EVENT_PATH = path.join(path.resolve(), 'test', 'cli', 'event.json')

  pexec('node index.js')
    .then(({ code, stdout }) => {
      assert.equal(stdout.trim(), '::warning::exiting early - expected PR by "dependabot[bot],dependabot-preview[bot],bar", found "foo" instead')
    })
})
