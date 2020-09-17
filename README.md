# GitHub Action: Dependabot Auto Merge

[![license][license-img]][license-url]
[![version][version-img]][version-url]
[![super linter][super-linter-img]][super-linter-url]
[![test][test-img]][test-url]
[![release][release-img]][release-url]

[license-url]: LICENSE
[license-img]: https://badgen.net/github/license/ahmadnassri/action-dependabot-auto-merge

[version-url]: https://github.com/ahmadnassri/action-dependabot-auto-merge/releases
[version-img]: https://badgen.net//github/release/ahmadnassri/action-dependabot-auto-merge

[super-linter-url]: https://github.com/ahmadnassri/action-dependabot-auto-merge/actions?query=workflow%3Asuper-linter
[super-linter-img]: https://github.com/ahmadnassri/action-dependabot-auto-merge/workflows/super-linter/badge.svg

[test-url]: https://github.com/ahmadnassri/action-dependabot-auto-merge/actions?query=workflow%3Atest
[test-img]: https://github.com/ahmadnassri/action-dependabot-auto-merge/workflows/test/badge.svg

[release-url]: https://github.com/ahmadnassri/action-dependabot-auto-merge/actions?query=workflow%3Arelease
[release-img]: https://github.com/ahmadnassri/action-dependabot-auto-merge/workflows/release/badge.svg

Automatically merge Dependabot PRs when version comparison is within range.

## Usage

```yaml
name: auto-merge

on:
  pull_request:

jobs:
  auto-merge:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: ahmadnassri/action-dependabot-auto-merge@v2
        with:
          target: minor
          github-token: ${{ secrets.mytoken }}
```

The action will only merge PRs whose checks (CI/CD) pass.

### Examples

Minimal setup:

```yaml
steps:
  - uses: ahmadnassri/action-dependabot-auto-merge@v2
    with:
      github-token: ${{ secrets.mytoken }}
```

Only merge if the changed dependency version is a `patch` _(default behavior)_:

```yaml
steps:
  - uses: ahmadnassri/action-dependabot-auto-merge@v2
    with:
      target: patch
      github-token: ${{ secrets.mytoken }}
```

Only merge if the changed dependency version is a `minor`:

```yaml
steps:
  - uses: ahmadnassri/action-dependabot-auto-merge@v2
    with:
      target: minor
      github-token: ${{ secrets.mytoken }}
```

Using a configuration file:

###### `.github/workflows/auto-merge.yml`

```yaml
steps:
  - uses: actions/checkout@v2
  - uses: ahmadnassri/action-dependabot-auto-merge@v2
    with:
      github-token: ${{ secrets.mytoken }}
```

###### `.github/auto-merge.yml`

```yaml
- match:
    dependency_type: all
    update_type: "semver:minor" # includes patch updates!
```

### Inputs

| input          | required | default        | description                                         |
| -------------- | -------- | -------------- | --------------------------------------------------- |
| `github-token` | ✔        | `github.token` | The GitHub token used to merge the pull-request     |
| `target`       | ❌       | `patch`        | The version comparison target (major, minor, patch) |
| `command`      | ❌       | `merge`        | The command to pass to Dependabot                   |
| `approve`      | ❌       | `true`         | Auto-approve pull-requests                          |

### Token Scope

The GitHub token is a [Personal Access Token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) with the following scopes: `repo` for private repositories, and `public_repo` for public repositories, and should be created from a user with "push" permission to the repository _(see reference for [user owned repos](https://docs.github.com/en/github/setting-up-and-managing-your-github-user-account/permission-levels-for-a-user-account-repository) and for [org owned repos](https://docs.github.com/en/github/setting-up-and-managing-organizations-and-teams/repository-permission-levels-for-an-organization))_

### Configuration file syntax

Using the configuration file `.github/auto-merge.yml`, you have the option to provide a more fine-grained configuration. The following example configuration file merges

* minor development dependency updates
* patch production dependency updates
* minor security-critical production dependency updates

```yaml
- match:
    dependency_type: development
    # Supported dependency types:
    # - development
    # - production
    # - all
    update_type: "semver:minor" # includes patch updates!
    # Supported updates to automerge:
    # - "security:patch"
    #   SemVer patch update that fixes a known security vulnerability
    # - "semver:patch"
    #   SemVer patch update, e.g. > 1.x && 1.0.1 to 1.0.3
    # - "semver:minor"
    #   SemVer minor update, e.g. > 1.x && 2.1.4 to 2.3.1
    # - "in_range" (NOT SUPPORTED YET)
    #   matching the version requirement in your package manifest
    # - "security:all"
    # - "all"
    # To allow prereleases, the corresponding prepatch, preminor and premajor types are also supported
- match:
    dependency_type: production
    update_type: "security:minor" # includes patch updates!
- match:
    dependency_type: production
    update_type: "semver:patch"
```

###### Defaults

By default, if no configuration file is present in the repo, the action will assume the following:

```yaml
- match:
    dependency_type: all
    update_type: "semver:$TARGET"
```

> Where `$TARGET` is the `target` value from the action [Inputs](#inputs)

The syntax is based on the [legacy dependaBot v1 config format](https://dependabot.com/docs/config-file/#automerged_updates), but does not support `dependency_name` and `in_range` yet.
