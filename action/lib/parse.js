import semver from 'semver'
import core from '@actions/core'
import path from 'path'
import fs from 'fs'
import yaml from 'js-yaml';

// semver regex
const semverRegEx = /(?<version>(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildmetadata>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)/
// regex to detect dependency name
const depNameRegex = /(?<name>(?:@[^\s]+\/)?[^\s]+) from/
// regexes to detect dependency type from PR title
const devDependencyRegEx = /\((deps-dev)\):/
const dependencyRegEx = /\((deps)\):/
const securityRegEx = /(^|: )\[Security\]/i

const ghWorkspace = process.env.GITHUB_WORKSPACE || "/github/workspace";

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

export default function (title, labels = [], target) {
  // log
  core.info(`title: "${title}"`)

  // extract dep name from the title
  const depName = title.match(depNameRegex)?.groups.name;
  core.info(`depName: ${depName}`)

  // exit early
  if (!depName) {
    core.error('failed to parse title: could not detect dependency name')
    return process.exit(0) // soft exit
  }

  // extract version from the title
  const from = title.match(new RegExp('from ' + semverRegEx.source))?.groups
  const to = title.match(new RegExp('to ' + semverRegEx.source))?.groups

  // exit early
  if (!from || !to || !semver.valid(from.version) || !semver.valid(to.version)) {
    core.error('failed to parse title: invalid semver')
    return process.exit(0) // soft exit
  }

  const isSecurity = securityRegEx.test(title) || labels.includes("security");
  let isProd;

  // Look at possible package files to determine the dependency type
  // For now, this only includes npm
  const packageJsonPath = path.join(ghWorkspace, 'package.json')
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJsonPath = path.join(ghWorkspace, 'package.json')
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      if (packageJson.devDependencies && depName in packageJson.devDependencies) {
        // This is definitely a devDependency
        isProd = false;
      }
    } catch (e) {
      core.debug(String(e));
    }
  }
  // If we could not determine the dependency type from package files, fall back to title parsing
  if (isProd === undefined && devDependencyRegEx.test(title)) {
    isProd = false;
  }
  if (isProd === undefined) {
    // we failed again, assume its a production dependency
    core.info(`failed to parse dependency type, assuming it is a production dependency`)
    isProd = true
  }

  // log
  core.info(`from: ${from.version}`)
  core.info(`to: ${to.version}`)
  core.info(`dependency type: ${isProd ? "production" : "development"}`)
  core.info(`security critical: ${isSecurity}`)

  // convert target to the automerged_updates syntax
  const configPath = path.join(ghWorkspace, '.github', 'auto-merge.yml')
  let mergeConfig;
  if (fs.existsSync(configPath)) {
    // parse .github/auto-merge.yml
    const mergeConfigYaml = fs.readFileSync(configPath, 'utf8')
    mergeConfig = yaml.safeLoad(mergeConfigYaml);
    core.info('loaded merge config: \n' + mergeConfigYaml);
  } else {
    mergeConfig = [
      { match: { dependency_type: "all", update_type: `semver:${target}` } },
    ];
    core.info('target converted to equivalent config: ' + JSON.stringify(mergeConfig, undefined, 4));
  }

  // analyze with semver
  const updateType = semver.diff(from.version, to.version)

  // Check all defined automerge configs to see if one matches
  for (const { match: { dependency_type, update_type } } of mergeConfig) {
    if (
      dependency_type === "all" ||
      (dependency_type === "production" && isProd) ||
      (dependency_type === "development" && !isProd)
    ) {
      if (update_type === "all") {
        core.info(`all ${dependency_type} updates allowed, will auto-merge`);
        return true;
      } else if (update_type === "in_range") {
        throw new Error("in_range update type not supported yet");
      } else if (update_type.includes(":")) {
        // security:patch, semver:minor, ...
        const [secOrSemver, maxType] = update_type.split(":", 2);
        if (secOrSemver === "security" && !isSecurity) continue;
        if ((weight[maxType] || 0) >= (weight[updateType] || 0)) {
          // tell dependabot to merge
          core.info(`${dependency_type} dependency update${dependency_type === "all" ? "s" : ""} ${update_type} allowed, got ${isSecurity ? "security" : "semver"}:${updateType}, will auto-merge`);
          return true;
        }
      }
    }
  }

  core.info('manual merging required')
  return false
}
