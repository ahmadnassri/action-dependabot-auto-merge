import path from 'path'
import fs from 'fs'

import core from '@actions/core'

// Look at possible package files to determine the dependency type
// For now, this only includes npm and composer (php)
export default function (workspace) {
  const packageConfig = [
    {
      'path': path.join(workspace, 'package.json'),
      'dev': 'devDependencies'
    },
    {
      'path': path.join(workspace, 'composer.json'),
      'dev': 'require-dev'
    }
  ];

  for (const { path, dev } of packageConfig) {
    if (fs.existsSync(path)) {
      try {
        let config = JSON.parse(fs.readFileSync(path, 'utf8'))

        return { 'devDependencies': config[dev] };
      } catch (err) {
        core.debug(err)
      }
    }
  }
}
