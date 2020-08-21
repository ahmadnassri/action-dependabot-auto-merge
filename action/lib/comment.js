module.exports = async function (octokit, repo, { number }, body) { // eslint-disable-line camelcase
  await octokit.issues.createComment({
    ...repo,
    issue_number: number,
    body
  })
}
