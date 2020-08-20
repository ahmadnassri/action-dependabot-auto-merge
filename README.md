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

| output         | required | default        | description                                         |
| -------------- | -------- | -------------- | --------------------------------------------------- |
| `target`       | ❌       | `patch`        | The version comparison target (major, minor, patch) |
| `github-token` | ❌       | `github.token` | The GitHub token used to merge the pull-request     |
