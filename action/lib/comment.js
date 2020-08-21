module.exports = async function (octokit, { repo, payload: { pull_request } }, body) { // eslint-disable-line camelcase
  await octokit.issues.createComment({
    ...repo,
    issue_number: pull_request.number,
    body
  })
}
