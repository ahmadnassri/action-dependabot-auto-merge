/* eslint-disable camelcase */

import semver from "semver";
import core from "@actions/core";

function semverDiff(from, to) {
  if (from.indexOf("0.") === 0) return "major";
  return semver.diff(from, to);
}

const regex = {
  // semver regex
  semver: /(?<version>(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+(?<buildmetadata>[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)/,
  // detect dependency name
  name: /(bump|update) (?<name>(?:@[^\s]+\/)?[^\s]+) (requirement)?/i,
  // detect dependency type from PR title
  dev: /\((deps-dev)\):/,
  // detect security flag
  security: /(^|: )\[security\]/i,
  // config values
  config: /(?<type>security|semver):(?<target>.+)/i,
};

const weight = {
  all: 1000,
  premajor: 6,
  major: 5,
  preminor: 4,
  minor: 3,
  prepatch: 2,
  prerelease: 2, // equal to prepatch
  patch: 1,
};

export default function ({
  title,
  labels = [],
  config = [],
  dependencies = {},
}) {
  // log
  core.info(`title: "${title}"`);

  // extract dep name from the title
  const depName = title.match(regex.name)?.groups.name;
  core.info(`depName: ${depName}`);

  // exit early
  if (!depName) {
    core.warning("failed to parse title: could not detect dependency name");
    return process.exit(0); // soft exit
  }

  // extract version from the title
  const from = title.match(new RegExp("from v?" + regex.semver.source))?.groups;
  const to = title.match(new RegExp("to v?" + regex.semver.source))?.groups;

  if (!to) {
    core.warning("failed to parse title: no recognizable versions");
    return process.exit(0); // soft exit
  }

  // exit early
  if (!semver.valid(to.version)) {
    core.warning("failed to parse title: invalid semver");
    return process.exit(0); // soft exit
  }

  // is this a security update?
  const isSecurity = regex.security.test(title) || labels.includes("security");

  // production dependency flag
  let isProd;

  // check if this dependency is a devDependency
  if (dependencies.devDependencies && depName in dependencies.devDependencies) {
    isProd = false;
  }

  // if we could not determine the dependency type from package files, fall back to title parsing
  if (isProd === undefined && regex.dev.test(title)) {
    isProd = false;
  }

  // assume default to be production
  if (isProd === undefined) {
    isProd = true;
  }

  // log
  core.info(`from: ${from ? from.version : "unknown"}`);
  core.info(`to: ${to.version}`);
  core.info(`dependency type: ${isProd ? "production" : "development"}`);
  core.info(`security critical: ${isSecurity}`);

  // analyze with semver
  let versionChange;

  console.log(from.version, to.version);
  if (from && from.version) {
    versionChange = semverDiff(from.version, to.version);
  }
  console.log(versionChange);

  // check all configuration variants to see if one matches
  for (const {
    match: { dependency_name, dependency_type, update_type },
  } of config) {
    if (
      // catch all
      dependency_type === "all" ||
      // evaluate prod dependencies
      (dependency_type === "production" && isProd) ||
      // evaluate dev dependencies
      (dependency_type === "development" && !isProd) ||
      // evaluate individual dependency
      (dependency_name && depName.match(new RegExp(dependency_name)))
    ) {
      core.info(`config: ${dependency_name || dependency_type}:${update_type}`);

      switch (true) {
        case update_type === "in_range":
          core.warning("in_range update type not supported yet");
          return process.exit(0); // soft exit

        case update_type === "all":
          core.info(
            `${
              dependency_name || dependency_type
            }:${update_type} detected, will auto-merge`
          );
          return true;

        // security:patch, semver:minor, ...
        case regex.config.test(update_type): {
          const { type, target } = update_type.match(regex.config)?.groups;

          // skip when config is for security update and PR is not security
          if (type === "security" && !isSecurity) continue;

          if (target === "all") {
            core.info(
              `${
                dependency_name || dependency_type
              }:${update_type} detected, will auto-merge`
            );
            return true;
          }

          // when there is no "from" version, there is no change detected
          if (!versionChange) {
            core.warning("no version range detected in PR title");
            continue;
          }

          console.log(versionChange);

          // evaluate weight of detected change
          if ((weight[target] || 0) >= (weight[versionChange] || 0)) {
            // tell dependabot to merge
            core.info(
              `${
                dependency_name || dependency_type
              }:${update_type} detected, will auto-merge`
            );
            return true;
          }
        }
      }
    }
  }

  core.info("manual merging required");

  return false;
}
