export async function approve (octokit, repo, { number }, body) {
  await octokit.rest.pulls.createReview({
    ...repo,
    pull_number: number,
    event: 'APPROVE',
    body
  })
}

export async function comment (octokit, repo, { number }, body) {
  await octokit.rest.issues.createComment({
    ...repo,
    issue_number: number,
    body
  })
}
