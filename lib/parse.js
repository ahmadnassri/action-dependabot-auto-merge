const { diff, valid } = require('semver')
const core = require('@actions/core')

// semver regex
const semver = /(?<version>(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildmetadata>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)/

module.exports = function (title, options) {
  // log
  core.info(`title: "${title}"`)

  // extract version from the title
  const from = title.match(new RegExp('from ' + semver.source))?.groups
  const to = title.match(new RegExp('to ' + semver.source))?.groups

  // exit early
  if (!from || !to || !valid(from.version) || !valid(to.version)) {
    core.setFailed('failed to parse title: invalid semver')
    return process.exit(1)
  }

  // log
  core.info(`from: ${from.version}`)
  core.info(`to: ${to.version}`)

  // analyze with semver
  const result = diff(from.version, to.version)

  // if target is a match, tell dependabot to
  if (options.target === result) {
    core.info(`dependency update target is ${result}, will auto-merge`)
    return 'merge'
  }

  core.info('manual merging required')
}
