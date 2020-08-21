module.exports = async function (octokit, context) {
  const { data: { id } } = await octokit.pulls.createReview({
    ...context.repo,
    pull_number: context.pull_request.number
  })

  await octokit.pulls.submitReview({
    ...context.repo,
    pull_number: context.pull_request.number,
    event: 'APPROVE',
    review_id: id
  })
}
