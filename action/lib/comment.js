module.exports = async function (octokit, context, body) {
  await octokit.issues.createComment({
    ...context.repo,
    issue_number: context.pull_request.number,
    body
  })
}
