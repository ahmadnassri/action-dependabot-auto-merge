module.exports = async function (octokit, event, comment) {
  await octokit.issues.createComment({
    owner: event.repository.owner.login,
    repo: event.repository.name,
    issue_number: event.pull_request.number,
    body: comment
  })
}
