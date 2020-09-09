/* eslint-disable camelcase */

import semver from 'semver'
import core from '@actions/core'

const regex = {
  // semver regex
  semver: /(?<version>(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildmetadata>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)/,
  // detect dependency name
  name: /(?<name>(?:@[^\s]+\/)?[^\s]+) from/,
  // detect dependency type from PR title
  dev: /\((deps-dev)\):/,
  // detect security flag
  security: /(^|: )\[Security\]/i,
  // config values
  config: /(?<type>security|semver):(?<target>.+)/
}

const weight = {
  all: 1000,
  premajor: 6,
  major: 5,
  preminor: 4,
  minor: 3,
  prepatch: 2,
  prerelease: 2, // equal to prepatch
  patch: 1
}

export default function ({ title, labels = [], config = [], dependencies = {} }) {
  // log
  core.info(`title: "${title}"`)

  // extract dep name from the title
  const depName = title.match(regex.name)?.groups.name
  core.info(`depName: ${depName}`)

  // exit early
  if (!depName) {
    core.error('failed to parse title: could not detect dependency name')
    return process.exit(0) // soft exit
  }

  // extract version from the title
  const from = title.match(new RegExp('from ' + regex.semver.source))?.groups
  const to = title.match(new RegExp('to ' + regex.semver.source))?.groups

  // exit early
  if (!from || !to || !semver.valid(from.version) || !semver.valid(to.version)) {
    core.error('failed to parse title: invalid semver')
    return process.exit(0) // soft exit
  }

  // is this a security update?
  const isSecurity = regex.security.test(title) || labels.includes('security')

  // production dependency flag
  let isProd

  // check if this dependency is a devDependency
  if (dependencies.devDependencies && depName in dependencies.devDependencies) {
    isProd = false
  }

  // if we could not determine the dependency type from package files, fall back to title parsing
  if (isProd === undefined && regex.dev.test(title)) {
    isProd = false
  }

  // assume default to be production
  if (isProd === undefined) {
    isProd = true
  }

  // log
  core.info(`from: ${from.version}`)
  core.info(`to: ${to.version}`)
  core.info(`dependency type: ${isProd ? 'production' : 'development'}`)
  core.info(`security critical: ${isSecurity}`)

  // analyze with semver
  const versionChange = semver.diff(from.version, to.version)

  // check all configuration variants to see if one matches
  for (const { match: { dependency_type, update_type } } of config) {
    if (
      dependency_type === 'all' ||
      (dependency_type === 'production' && isProd) ||
      (dependency_type === 'development' && !isProd)
    ) {
      switch (true) {
        case update_type === 'all':
          core.info(`${dependency_type}:${update_type} detected, will auto-merge`)
          return true

        case update_type === 'in_range':
          core.error('in_range update type not supported yet')
          return process.exit(0) // soft exit

        // security:patch, semver:minor, ...
        case regex.config.test(update_type): {
          const { type, target } = update_type.match(regex.config)?.groups

          // skip when config is for security update and PR is not security
          if (type === 'security' && !isSecurity) continue

          // evaluate weight of detected change
          if ((weight[target] || 0) >= (weight[versionChange] || 0)) {
          // tell dependabot to merge
            core.info(`${dependency_type}:${update_type} detected, will auto-merge`)
            return true
          }
        }
      }
    }
  }

  core.info('manual merging required')

  return false
}
