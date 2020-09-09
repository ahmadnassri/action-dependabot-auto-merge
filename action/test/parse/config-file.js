// packages
import tap from 'tap'

import sinon from 'sinon'
import core from '@actions/core'
import yaml from 'js-yaml';

// module
import parse from '../../lib/parse.js'

const configAllPatchSecMinor = `
- match:
    dependency_type: "all"
    update_type: "semver:patch"
- match:
    dependency_type: "all"
    update_type: "security:minor"
`

const configAllPatchDevSecAll = `
- match:
    dependency_type: "all"
    update_type: "semver:patch"
- match:
    dependency_type: "development"
    update_type: "security:all"
`

const configProdPatchDevMajor = `
- match:
    dependency_type: "production"
    update_type: "semver:patch"
- match:
    dependency_type: "development"
    update_type: "semver:major"
`

const configInRange = `
- match:
    dependency_type: "all"
    update_type: "in_range"
`

const tests = [
  {
    name: "all deps patch, security minor --> patch (✓)",
    expect: true,
    config: configAllPatchSecMinor,
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.1.4'
  },
  {
    name: "all deps patch, security minor --> minor (✗)",
    expect: false,
    config: configAllPatchSecMinor,
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.2.0'
  },
  {
    name: "all deps patch, security minor --> security:minor (✓)",
    expect: true,
    config: configAllPatchSecMinor,
    title: 'chore(deps): [security] bump api-problem from 6.1.2 to 6.2.0'
  },
  {
    name: "all deps patch, security minor --> security:major (✗)",
    expect: false,
    config: configAllPatchSecMinor,
    title: 'chore(deps): [security] bump api-problem from 6.1.2 to 7.2.0'
  },
  {
    name: "all deps patch, dev security all --> patch (✓)",
    expect: true,
    config: configAllPatchDevSecAll,
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.1.3'
  },
  {
    name: "all deps patch, dev security all --> preminor (✗)",
    expect: false,
    config: configAllPatchDevSecAll,
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.2.0-pre'
  },
  {
    name: "all deps patch, dev security all --> dev security:premajor (✓)",
    expect: true,
    config: configAllPatchDevSecAll,
    title: 'chore(deps-dev): [security] bump api-problem from 6.1.2 to 7.0.0-pre'
  },
  {
    name: "prod patch, dev major --> prod patch (✓)",
    expect: true,
    config: configProdPatchDevMajor,
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.1.3'
  },
  {
    name: "prod patch, dev major --> prod minor (✗)",
    expect: false,
    config: configProdPatchDevMajor,
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.2.0'
  },
  {
    name: "prod patch, dev major --> dev minor (✓)",
    expect: true,
    config: configProdPatchDevMajor,
    title: 'chore(deps-dev): bump api-problem from 6.1.2 to 6.2.0'
  },
  {
    name: "prod patch, dev major --> dev premajor (✗)",
    expect: false,
    config: configProdPatchDevMajor,
    title: 'chore(deps-dev): bump api-problem from 6.1.2 to 7.0.0-pre'
  },
  {
    name: "in_range --> throws",
    throws: true,
    config: configInRange,
    title: 'chore(deps): bump api-problem from 6.1.2 to 6.1.3'
  },
];

for (const test of tests) {
  tap.test(`compound merge configs in config files --> ${test.name}`, async assert => {
    sinon.stub(core, 'info')

    const mergeConfig = yaml.safeLoad(test.config);

    if (test.throws === true) {
      assert.throws(() => parse(test.title, [], mergeConfig));
    } else {
      assert.equal(parse(test.title, [], mergeConfig), test.expect);
    }

    core.info.restore()
  });
}
