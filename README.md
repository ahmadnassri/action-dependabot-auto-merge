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

Automatically merge Dependabot PRs when version comparison is within range

## Usage

```yaml
name: auto-merge

on:
  pull_request:

jobs:
  auto-merge:
    runs-on: ubuntu-latest
    steps:
      - uses: ahmadnassri/action-dependabot-auto-merge@v1
```

### Examples

Use a specific user's Personal Access Token:

```yaml
steps:
  - uses: ahmadnassri/action-dependabot-auto-merge@v1
    with:
      target: patch
      github-token: ${{ secrets.mytoken }}
```

Only merge if the changed dependency version is a `patch` _(default behavior)_:

```yaml
steps:
  - uses: ahmadnassri/action-dependabot-auto-merge@v1
    with:
      target: patch
```

Only merge if the changed dependency version is a `minor`:

```yaml
steps:
  - uses: ahmadnassri/action-dependabot-auto-merge@v1
    with:
      target: minor
```

Only merge if the changed dependency version is a `major`:

```yaml
steps:
  - uses: ahmadnassri/action-dependabot-auto-merge@v1
    with:
      target: major
```

### Inputs

| input          | required | default        | description                                         |
| -------------- | -------- | -------------- | --------------------------------------------------- |
| `target`       | ❌       | `patch`        | The version comparison target (major, minor, patch) |
| `github-token` | ❌       | `github.token` | The GitHub token used to merge the pull-request     |
| `command`      | ❌       | `merge`        | The command to pass to Dependabot                   |
| `approve`      | ❌       | `true`         | Auto-approve pull-requests                          |

### Configuration file syntax

Using the configuration file `.github/auto-merge.yml`, you have the option to provide a more fine-grained configuration. The following example configuration file merges

* minor development dependency updates
* patch production dependency updates
* minor security-critical production dependency updates

```yml
automerged_updates:
- match:
    dependency_type: "development"
    # Supported dependency types:
    # - "development"
    # - "production"
    # - "all"
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
    # - "all"
- match:
    dependency_type: "production"
    update_type: "security:minor" # includes patch updates!
- match:
    dependency_type: "production"
    update_type: "semver:patch"
```

The syntax is based on https://dependabot.com/docs/config-file/#automerged_updates, but does not support `dependency_name` and `in_range` yet.
