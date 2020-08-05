# GitHub Action: Dependabot Auto Merge

Automatically merge Dependabot PRs when version comparison is within range

## Usage

```yaml
name: auto-merge

on:
  pull_request:

jobs:
  auto-merge:
    runs-on: ubuntu-latest
    if: github.actor == 'dependabot[bot]'
    steps:
      - uses: actions/checkout@v2
      - uses: docker://ahmadnassri/action-dependabot-auto-merge:v1
```

### Examples

Use a specific user's Personal Access Token:

```yaml
steps:
  - uses: actions/checkout@v2
  - uses: docker://ahmadnassri/action-dependabot-auto-merge:v1
    with:
      target: patch
      github-token: ${{ secrets.mytoken }}
```


Only merge if the changed dependency version is a `patch` _(default behavior)_:

```yaml
steps:
  - uses: actions/checkout@v2
  - uses: docker://ahmadnassri/action-dependabot-auto-merge:v1
    with:
      target: patch
```

Only merge if the changed dependency version is a `minor`:

```yaml
steps:
  - uses: actions/checkout@v2
  - uses: docker://ahmadnassri/action-dependabot-auto-merge:v1
    with:
      target: minor
```

Only merge if the changed dependency version is a `major`:

```yaml
steps:
  - uses: actions/checkout@v2
  - uses: docker://ahmadnassri/action-dependabot-auto-merge:v1
    with:
      target: major
```

### Inputs

| output         | required | default        | description                                         |
| -------------- | -------- | -------------- | --------------------------------------------------- |
| `github-token` | ❌        | `github.token` | The GitHub token used to merge the pull-request     |
| `target`       | ❌        | `patch` | The version comparison target (major, minor, patch) |
