export async function approve (octokit, repo, { number }) {
  await octokit.pulls.createReview({
    ...repo,
    pull_number: number,
    event: 'APPROVE'
  })
}

export async function comment (octokit, repo, { number }, body) {
  await octokit.issues.createComment({
    ...repo,
    issue_number: number,
    body
  })
}
