const core = require('@actions/core')

const required = [
  {
    name: 'CI',
    test: v => v !== 'true',
    message: 'action called outside of CI'
  },
  {
    name: 'GITHUB_EVENT_NAME',
    test: v => v !== 'pull_request',
    message: 'action called on non pull-request event'
  },
  {
    name: 'GITHUB_TOKEN',
    test: v => !v || v.trim() === '',
    message: 'GITHUB_TOKEN required'
  }
]

module.exports = function () {
  for (const env of required) {
    if (env.test(process.env[env.name])) {
      core.setFailed(env.message)
      return process.exit(1)
    }
  }
}
