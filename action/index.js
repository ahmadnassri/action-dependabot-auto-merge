// // internals
// import { inspect } from 'util'

// // packages
// import core from '@actions/core'

// // modules
// import main from './lib/index.js'

// // parse inputs
// const inputs = {
//   token: core.getInput('github-token', { required: true }),
//   target: core.getInput('target', { required: true }),
//   command: core.getInput('command', { required: false }),
//   approve: core.getInput('approve', { required: false })
// }

// // error handler
// function errorHandler ({ message, stack, request }) {
//   core.error(`${message}\n${stack}`)

//   // debugging for API calls
//   if (request) {
//     const { method, url, body, headers } = request
//     core.debug(`${method} ${url}\n\n${inspect(headers)}\n\n${inspect(body)}`)
//   }

//   process.exit(1)
// }

// // catch errors and exit
// process.on('unhandledRejection', errorHandler)
// process.on('uncaughtException', errorHandler)

import { execSync } from "child_process";

let output = execSync("ls -la /github/workspace", {encoding: "utf8"});
console.log("ls -la /github/workspace");
console.log(output);

// await main(inputs)
