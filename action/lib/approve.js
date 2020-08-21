module.exports = async function (octokit, repo, { number }) {
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
