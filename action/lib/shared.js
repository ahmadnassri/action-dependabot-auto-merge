export const ghWorkspace = process.env.GITHUB_WORKSPACE || "/github/workspace";

export function targetToMergeConfig(target) {
  return [
    { match: { dependency_type: "all", update_type: `semver:${target}` } },
  ]
}
