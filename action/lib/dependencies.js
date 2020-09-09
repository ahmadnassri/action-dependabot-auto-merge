import path from 'path'
import fs from 'fs'

import core from '@actions/core'

// Look at possible package files to determine the dependency type
// For now, this only includes npm
export default function (workspace) {
  const packageJsonPath = path.join(workspace, 'package.json')

  if (fs.existsSync(packageJsonPath)) {
    try {
      return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    } catch (err) {
      core.debug(err)
    }
  }
}
