> **Note:** _Dependabot will wait until all your status checks pass before merging. This is a function of Dependabot itself, and not this Action._

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

| input          | required | default                  | description                                         |
|----------------|----------|--------------------------|-----------------------------------------------------|
| `github-token` | ✔        | `github.token`           | The GitHub token used to merge the pull-request     |
| `config`       | ✔        | `.github/auto-merge.yml` | Path to configuration file *(relative to root)*     |
| `target`       | ❌        | `patch`                  | The version comparison target (major, minor, patch) |
| `command`      | ❌        | `merge`                  | The command to pass to Dependabot                   |
| `botName`      | ❌        | `dependabot`             | The bot to tag in approve/comment message.          |
| `approve`      | ❌        | `true`                   | Auto-approve pull-requests                          |

### Token Scope

The GitHub token is a [Personal Access Token][github-pat] with the following scopes:

- `repo` for private repositories
- `public_repo` for public repositories

The token MUST be created from a user with **`push`** permission to the repository.

> ℹ _see reference for [user owned repos][github-user-repos] and for [org owned repos][github-org-repos]_

### Configuration file syntax

Using the configuration file _(specified with `config` input)_, you have the option to provide a more fine-grained configuration. The following example configuration file merges

- minor updates for `aws-sdk`
- minor development dependency updates
- patch production dependency updates
- minor security-critical production dependency updates

```yaml
- match:
    dependency_name: aws-sdk
    update_type: semver:minor

- match:
    dependency_type: development
    update_type: semver:minor # includes patch updates!

- match:
    dependency_type: production
    update_type: security:minor # includes patch updates!

- match:
    dependency_type: production
    update_type: semver:patch
```

#### Match Properties

| property          | required | supported values                           |
| ----------------- | -------- | ------------------------------------------ |
| `dependency_name` | ❌       | full name of dependency, or a regex string |
| `dependency_type` | ❌       | `all`, `production`, `development`         |
| `update_type`     | ✔        | `all`, `security:*`, `semver:*`            |

> **`update_type`** can specify security match or semver match with the syntax: `${type}:${match}`, e.g.
>
> - **security:patch**  
>   SemVer patch update that fixes a known security vulnerability
>
> - **semver:patch**  
>   SemVer patch update, e.g. > 1.x && 1.0.1 to 1.0.3
>
> - **semver:minor**  
>   SemVer minor update, e.g. > 1.x && 2.1.4 to 2.3.1
>
> To allow `prereleases`, the corresponding `prepatch`, `preminor` and `premajor` types are also supported

###### Defaults

By default, if no configuration file is present in the repo, the action will assume the following:

```yaml
- match:
    dependency_type: all
    update_type: semver:${TARGET}
```

> Where `$TARGET` is the `target` value from the action [Inputs](#inputs)

The syntax is based on the [legacy dependaBot v1 config format](https://dependabot.com/docs/config-file/#automerged_updates).
However, **`in_range` is not supported yet**.

## Exceptions and Edge Cases

1. Parsing of _version ranges_ is not currently supported

```
Update stone requirement from ==1.* to ==3.*
requirements: update sphinx-autodoc-typehints requirement from <=1.11.0 to <1.12.0
Update rake requirement from ~> 10.4 to ~> 13.0
```

2. Parsing of non semver numbering is not currently supported

```
Bump actions/cache from v2.0 to v2.1.2
chore(deps): bump docker/build-push-action from v1 to v2
```

3. Sometimes Dependabot does not include the "from" version, so version comparison logic is impossible:

```
Update actions/setup-python requirement to v2.1.4
Update actions/cache requirement to v2.1.2
```

if your config is anything other than `update_type: all`, or `update_type: semver:all` the action will fallback to manual merge, since there is no way to compare version ranges for merging.

[github-pat]: https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token
[github-user-repos]: https://docs.github.com/en/github/setting-up-and-managing-your-github-user-account/permission-levels-for-a-user-account-repository
[github-org-repos]: https://docs.github.com/en/github/setting-up-and-managing-organizations-and-teams/repository-permission-levels-for-an-organization
