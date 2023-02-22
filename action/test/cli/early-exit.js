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

tap.test('main -> not part of the allowed_users', assert => {
  assert.plan(1)

  process.env.GITHUB_EVENT_NAME = 'pull_request'
  process.env.GITHUB_EVENT_PATH = path.join(path.resolve(), 'test', 'cli', 'event.json')
  process.env[`INPUT_allowed_users`] = ["test","somebody"]

  pexec('node index.js')
    .then(({ code, stdout }) => {
      assert.equal(stdout.trim(), '::warning::exiting early - expected PR by "test,somebody", found "foo" instead')
    })
})

tap.test('main -> user is part of the allowed_users', assert => {
  assert.plan(1)

  process.env.GITHUB_EVENT_NAME = 'pull_request'
  process.env.GITHUB_EVENT_PATH = path.join(path.resolve(), 'test', 'cli', 'event.json')
  process.env[`INPUT_allowed_users`] = ["foo","somebody"]

  pexec('node index.js')
    .catch(({ code, stdout }) => {
      // If it reaches the other validation errors then it is a valid user
      assert.equal(code, 1)
    })
})
