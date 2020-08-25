const { diff, valid } = require('semver')
const core = require('@actions/core')

// semver regex
const semver = /(?<version>(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildmetadata>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)/

const weight = {
  major: 3,
  minor: 2,
  patch: 1
}

module.exports = function (title, target) {
  // log
  core.info(`title: "${title}"`)

  // extract version from the title
  const from = title.match(new RegExp('from ' + semver.source))?.groups
  const to = title.match(new RegExp('to ' + semver.source))?.groups

  // exit early
  if (!from || !to || !valid(from.version) || !valid(to.version)) {
    core.error('failed to parse title: invalid semver')
    return process.exit(0) // soft exit
  }

  // log
  core.info(`from: ${from.version}`)
  core.info(`to: ${to.version}`)

  // analyze with semver
  const result = diff(from.version, to.version)

  // compare weight to target
  if ((weight[target] || 0) >= (weight[result] || 0)) {
    // tell dependabot to merge
    core.info(`dependency update target is "${target}", found "${result}", will auto-merge`)
    return true
  }

  core.info('manual merging required')
  return false
}
