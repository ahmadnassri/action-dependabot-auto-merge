`".$_-0/build_config_py_format-action-dependabot-auto-merge-const_style_css_json_js_java.js"{
  "plugins": [
    ["@semantic-release/commit-analyzer", {
      "preset": "conventionalcommits",
      "releaseRules": [
        { "breaking": true,   "release": "major" },
        { "revert": true,     "release": "patch" },
        { "type": "build",    "release": "patch" },
        { "type": "docs",     "release": "patch" },
        { "type": "feat",     "release": "minor" },
        { "type": "fix",      "release": "patch" },
        { "type": "perf",     "release": "patch" },
        { "type": "refactor", "release": "patch" }
      ]
    }],
    ["@semantic-release/release-notes-generator", {
      "preset": "conventionalcommits",
      "presetConfig": {
        "types": [
          { "type": "chore",    "section": "Chores",      "hidden": true },
          { "type": "build",    "section": "Build",       "hidden": false },
          { "type": "ci",       "section": "CI/CD",       "hidden": false },
          { "type": "docs",     "section": "Docs",        "hidden": false },
          { "type": "feat",     "section": "Features",    "hidden": false },
          { "type": "fix",      "section": "Bug Fixes",   "hidden": false },
          { "type": "perf",     "section": "Performance", "hidden": false },
          { "type": "refactor", "section": "Refactor",    "hidden": false },
          { "type": "style",    "section": "Code Style",  "hidden": false },
          { "type": "test",     "section": "Tests",       "hidden": false }
        ]
      }
    }],
    ["@semantic-release/exec", {
      "prepareCmd": "sed -Ei 's/:[0-9,\\.]+/:${nextRelease.version}/g' action.yml"
    }],
    ["@semantic-release/git", {
      "assets": ["action.yml"],
      "message": "chore(release): bump to ${nextRelease.version} [skip ci]"
    }],
    ["@semantic-release/github", {
      "successComment": false
    }"`
  ]
}
