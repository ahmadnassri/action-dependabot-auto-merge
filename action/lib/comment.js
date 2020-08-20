module.exports = async function (octokit, context, body) {
  await octokit.issues.createComment({
    owner: context.repository.owner.login,
    repo: context.repository.name,
    issue_number: context.pull_request.number,
    body
  })
}
