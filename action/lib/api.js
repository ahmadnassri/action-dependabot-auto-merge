export async function approve (octokit, repo, { number }) {
  const { data: { id } } = await octokit.pulls.createReview({
    ...repo,
    pull_number: number
  })

  await octokit.pulls.submitReview({
    ...repo,
    pull_number: number,
    event: 'APPROVE',
    review_id: id
  })
}

export async function comment (octokit, repo, { number }, body) {
  await octokit.issues.createComment({
    ...repo,
    issue_number: number,
    body
  })
}
